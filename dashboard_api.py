from flask import Blueprint, jsonify, request
from flask_socketio import SocketIO, emit
from datetime import datetime, timedelta
import json
import time
from collections import defaultdict


from services import SessionLayer, NLPResult, UserBaseline

dashboard_bp = Blueprint('dashboard', __name__)

class DashboardDataStore:

    
    def __init__(self):
        self.messages = []  
        self.user_profiles = defaultdict(lambda: {
            'messages': [],
            'total_score': 0,
            'alerts': 0,
            'sos_count': 0,
            'first_seen': None,
            'last_seen': None,
            'ema_history': []
        })
        self.stats = {
            'total_messages': 0,
            'total_alerts': 0,
            'total_sos': 0,
            'active_users': 0
        }
    
    def add_message(self, message_data):
        
        self.messages.insert(0, message_data)
        
        # Keep last 1000 messages
        if len(self.messages) > 1000:
            self.messages = self.messages[:1000]
        
        # Update user profile
        user_id = message_data['user_id']
        profile = self.user_profiles[user_id]
        
        profile['messages'].insert(0, message_data)
        profile['total_score'] += message_data['risk_score']
        
        if message_data['alert']:
            profile['alerts'] += 1
        
        if message_data.get('sos_activated'):
            profile['sos_count'] += 1
        
        if profile['first_seen'] is None:
            profile['first_seen'] = message_data['timestamp']
        
        profile['last_seen'] = message_data['timestamp']
        
        profile['ema_history'].append({
            'timestamp': message_data['timestamp'],
            'ema_value': message_data.get('ema_score', 50.0),
            'risk_score': message_data['risk_score']
        })
        
        # Update global stats
        self.stats['total_messages'] = len(self.messages)
        self.stats['total_alerts'] = sum(1 for m in self.messages if m['alert'])
        self.stats['total_sos'] = sum(1 for m in self.messages if m.get('sos_activated'))
        self.stats['active_users'] = len(self.user_profiles)
    
    def get_recent_messages(self, limit=50, filter_type='all'):
        """Get recent messages with optional filter."""
        messages = self.messages[:limit]
        
        if filter_type == 'high':
            messages = [m for m in messages if m['risk_level'] in ('HIGH', 'CRITICAL')]
        elif filter_type == 'sos':
            messages = [m for m in messages if m.get('sos_activated')]
        
        return messages
    
    def get_user_history(self, user_id):
        """Get complete history for a user."""
        return self.user_profiles.get(user_id, None)
    
    def get_stats(self):
        """Get dashboard statistics."""
        return self.stats
    
    def get_risk_distribution(self, hours=24):
        """Get risk score distribution for chart."""
        cutoff = time.time() - (hours * 3600)
        recent = [m for m in self.messages if m['timestamp'] > cutoff]
        
        ranges = {
            '0-20': 0, '20-40': 0, '40-60': 0, '60-80': 0, '80-100': 0
        }
        
        for msg in recent:
            score = msg['risk_score']
            if score < 20: ranges['0-20'] += 1
            elif score < 40: ranges['20-40'] += 1
            elif score < 60: ranges['40-60'] += 1
            elif score < 80: ranges['60-80'] += 1
            else: ranges['80-100'] += 1
        
        return ranges
    
    def get_timeline_data(self, hours=24):
        """Get timeline data for graphs."""
        cutoff = time.time() - (hours * 3600)
        recent = [m for m in self.messages if m['timestamp'] > cutoff]
        
        # Group by hour
        hourly_data = defaultdict(lambda: {'count': 0, 'avg_score': 0, 'scores': []})
        
        for msg in recent:
            hour = datetime.fromtimestamp(msg['timestamp']).strftime('%Y-%m-%d %H:00')
            hourly_data[hour]['count'] += 1
            hourly_data[hour]['scores'].append(msg['risk_score'])
        
        # Calculate averages
        timeline = []
        for hour, data in sorted(hourly_data.items()):
            timeline.append({
                'hour': hour,
                'count': data['count'],
                'avg_score': sum(data['scores']) / len(data['scores']) if data['scores'] else 0
            })
        
        return timeline


# Initialize data store
data_store = DashboardDataStore()


# ═══════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@dashboard_bp.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get overall dashboard statistics."""
    stats = data_store.get_stats()
    
    # Calculate average risk score
    messages = data_store.messages
    avg_score = (sum(m['risk_score'] for m in messages) / len(messages)) if messages else 0
    
    return jsonify({
        'total_messages': stats['total_messages'],
        'total_alerts': stats['total_alerts'],
        'total_sos': stats['total_sos'],
        'active_users': stats['active_users'],
        'avg_risk_score': round(avg_score, 2),
        'timestamp': time.time()
    })


@dashboard_bp.route('/api/dashboard/feed', methods=['GET'])
def get_message_feed():
    """Get recent message feed."""
    limit = int(request.args.get('limit', 50))
    filter_type = request.args.get('filter', 'all')
    
    messages = data_store.get_recent_messages(limit, filter_type)
    
    return jsonify({
        'messages': messages,
        'count': len(messages),
        'timestamp': time.time()
    })


@dashboard_bp.route('/api/dashboard/user/<user_id>', methods=['GET'])
def get_user_history(user_id):
    """Get complete history for a specific user."""
    profile = data_store.get_user_history(user_id)
    
    if not profile:
        return jsonify({'error': 'User not found'}), 404
    
    # Calculate stats
    messages = profile['messages']
    avg_score = (profile['total_score'] / len(messages)) if messages else 0
    
    days_active = 1
    if profile['first_seen'] and profile['last_seen']:
        days_active = max(1, int((profile['last_seen'] - profile['first_seen']) / 86400))
    
    return jsonify({
        'user_id': user_id,
        'total_messages': len(messages),
        'avg_risk_score': round(avg_score, 2),
        'total_alerts': profile['alerts'],
        'total_sos': profile['sos_count'],
        'days_active': days_active,
        'first_seen': profile['first_seen'],
        'last_seen': profile['last_seen'],
        'messages': messages[:50],  # Last 50 messages
        'ema_history': profile['ema_history'][-20:]  # Last 20 EMA values
    })


@dashboard_bp.route('/api/dashboard/distribution', methods=['GET'])
def get_risk_distribution():
    """Get risk score distribution for chart."""
    hours = int(request.args.get('hours', 24))
    distribution = data_store.get_risk_distribution(hours)
    
    return jsonify({
        'distribution': distribution,
        'hours': hours,
        'timestamp': time.time()
    })


@dashboard_bp.route('/api/dashboard/timeline', methods=['GET'])
def get_timeline():
    """Get timeline data for trend graphs."""
    hours = int(request.args.get('hours', 24))
    timeline = data_store.get_timeline_data(hours)
    
    return jsonify({
        'timeline': timeline,
        'hours': hours,
        'timestamp': time.time()
    })


@dashboard_bp.route('/api/dashboard/export', methods=['GET'])
def export_dashboard_data():
    """Export all dashboard data as JSON."""
    return jsonify({
        'messages': data_store.messages,
        'user_profiles': dict(data_store.user_profiles),
        'stats': data_store.stats,
        'exported_at': time.time()
    })


# ═══════════════════════════════════════════════════════════════
# PROCESS MESSAGE (Called by main analyse endpoint)
# ═══════════════════════════════════════════════════════════════

def log_to_dashboard(result, nlp_result):
    """
    Call this function after processing through Risk Engine.
    Logs the result to dashboard and broadcasts to WebSocket.
    
    Usage in api/routes.py:
        from api.dashboard_api import log_to_dashboard
        
        result = risk_engine.process(nlp_result, user_baseline)
        log_to_dashboard(result, nlp_result)
    """
    
    message_data = {
        'session_id': result.session_id,
        'user_id': result.user_id,
        'message': nlp_result.message_text,
        'risk_score': result.final_score,
        'risk_level': result.risk_level,
        'ema_score': result.ema_score,
        'deviation': result.deviation,
        'escalation_level': result.escalation_decision.level.value,
        'interaction_type': result.interaction_type,
        'authenticity_score': result.authenticity_score,
        'is_academic_only': result.is_academic_only,
        'alert': result.alert,
        'counsellor_notified': result.counsellor_notified,
        'sos_activated': result.sos_activated,
        'auto_action': result.auto_action,
        'signals': result.all_signals[:10],
        'timestamp': result.timestamp,
        'processing_time_ms': result.processing_time_ms
    }
    
    # Store in dashboard
    data_store.add_message(message_data)
    
    # Broadcast to WebSocket clients (if SocketIO is configured)
    try:
        from flask import current_app
        socketio = current_app.extensions.get('socketio')
        if socketio:
            socketio.emit('new_message', message_data, namespace='/dashboard')
    except:
        pass
    
    return message_data


# ═══════════════════════════════════════════════════════════════
# WEBSOCKET EVENTS (For real-time updates)
# ═══════════════════════════════════════════════════════════════

def init_dashboard_websocket(socketio):
    """
    Initialize WebSocket events for dashboard.
    Call this from app.py after creating SocketIO instance.
    """
    
    @socketio.on('connect', namespace='/dashboard')
    def handle_connect():
        """Client connected to dashboard."""
        print('[Dashboard] Client connected')
        emit('connected', {'message': 'Connected to RAYZA dashboard'})
    
    @socketio.on('disconnect', namespace='/dashboard')
    def handle_disconnect():
        """Client disconnected."""
        print('[Dashboard] Client disconnected')
    
    @socketio.on('request_stats', namespace='/dashboard')
    def handle_stats_request():
        """Client requested stats update."""
        stats = data_store.get_stats()
        messages = data_store.messages
        avg_score = (sum(m['risk_score'] for m in messages) / len(messages)) if messages else 0
        
        emit('stats_update', {
            'total_messages': stats['total_messages'],
            'total_alerts': stats['total_alerts'],
            'total_sos': stats['total_sos'],
            'active_users': stats['active_users'],
            'avg_risk_score': round(avg_score, 2)
        })
    
    @socketio.on('request_feed', namespace='/dashboard')
    def handle_feed_request(data):
        """Client requested feed update."""
        limit = data.get('limit', 50)
        filter_type = data.get('filter', 'all')
        
        messages = data_store.get_recent_messages(limit, filter_type)
        emit('feed_update', {'messages': messages})



__all__ = ['dashboard_bp', 'log_to_dashboard', 'init_dashboard_websocket', 'data_store']
