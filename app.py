from flask import Flask, jsonify, request
from flask_cors import CORS
import time


app = Flask(__name__)
CORS(app)

print("=" * 60)
print("  🧠 RAYZA Mental Health Crisis Detection API")
print("  Version: 2.0.0")
print("  Team: NEMESIS")
print("=" * 60)


risk_engine = None
SessionLayer = None
NLPResult = None
UserBaseline = None

try:
    print("[app] Loading Risk Engine...")
    from services import SessionLayer, NLPResult, UserBaseline
    risk_engine = SessionLayer()
    print("[app] ✓ Risk Engine loaded successfully!")
except Exception as e:
    print(f"[app] ⚠️  Risk Engine not available: {e}")
    print("[app] Running in DEMO mode (mock responses)")

@app.route('/')
def index():
    """Root endpoint"""
    return jsonify({
        'service': 'RAYZA Mental Health Crisis Detection API',
        'version': '2.0.0',
        'team': 'NEMESIS',
        'status': 'running',
        'endpoints': {
            'health': '/api/health [GET]',
            'analyse': '/api/analyse [POST]'
        }
    })


@app.route('/api/health')
def health():
    """Health check"""
    return jsonify({
        'status': 'ok',
        'service': 'RAYZA',
        'version': '2.0.0',
        'risk_engine': 'loaded' if risk_engine else 'demo_mode',
        'timestamp': time.time()
    })


@app.route('/api/analyse', methods=['POST'])
def analyse():
    """Main endpoint - analyse message"""
    
    # Get request data
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    user_id = data.get('user_id', 'test_user')
    message = data.get('message', '')
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400
    
    # If Risk Engine is available, use it
    if risk_engine and NLPResult and UserBaseline:
        try:
            # Create mock NLP result
            nlp_result = NLPResult(
                raw_score=60.0,
                confidence=0.85,
                keywords=['test'],
                sentiment=-0.5,
                message_text=message,
                user_id=user_id,
                timestamp=time.time()
            )
            
            # Create mock user baseline
            user_baseline = UserBaseline(
                user_id=user_id,
                ema_value=50.0,
                message_count=10,
                known_keywords=[],
                last_updated=time.time(),
                session_day_count=1
            )
            
            # Process through Risk Engine
            result = risk_engine.process(nlp_result, user_baseline)
            
            # Return result
            return jsonify({
                'session_id': result.session_id,
                'user_id': result.user_id,
                'risk_score': round(result.final_score, 2),
                'risk_level': result.risk_level,
                'alert': result.alert,
                'sos_activated': result.sos_activated,
                'counsellor_notified': result.counsellor_notified,
                'auto_action': result.auto_action,
                'message': 'Analysis complete',
                'timestamp': result.timestamp
            })
            
        except Exception as e:
            return jsonify({
                'error': 'Risk Engine error',
                'details': str(e)
            }), 500
    
    # Demo mode (if Risk Engine not loaded)
    else:
        return jsonify({
            'session_id': 'demo-123',
            'user_id': user_id,
            'risk_score': 45.0,
            'risk_level': 'MEDIUM',
            'alert': False,
            'sos_activated': False,
            'counsellor_notified': False,
            'auto_action': 'No action - demo mode',
            'message': 'Demo response (Risk Engine not loaded)',
            'timestamp': time.time()
        })


@app.route('/api/user/<user_id>')
def get_user(user_id):
    """Get user info"""
    return jsonify({
        'user_id': user_id,
        'ema_value': 50.0,
        'message_count': 10,
        'status': 'active'
    })


# ═══════════════════════════════════════════════════════════════════
# Error Handlers
# ═══════════════════════════════════════════════════════════════════

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'available_endpoints': [
            '/',
            '/api/health',
            '/api/analyse [POST]',
            '/api/user/<user_id>'
        ]
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': str(error)
    }), 500


# ═══════════════════════════════════════════════════════════════════
# Run
# ═══════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    print()
    print("  Starting server...")
    print("  API: http://localhost:5000/api")
    print("  Health: http://localhost:5000/api/health")
    print("=" * 60)
    print()
    
    app.run(host='0.0.0.0', port=5000, debug=True)
