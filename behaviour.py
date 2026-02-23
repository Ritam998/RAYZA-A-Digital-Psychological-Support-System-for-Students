import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field
from collections import deque

from configparser import RiskEngineConfig

logger = logging.getLogger(__name__)


@dataclass
class MessagePattern:
    """Represents a message pattern for comparison"""
    message_id: str
    timestamp: datetime
    risk_score: float
    risk_category: str  # 'low', 'medium', 'high'
    normalized_score: float  # Normalized to 0-1 range


class BehaviorRepetitionDetector:
    
    def __init__(self, config: Optional[RiskEngineConfig] = None):
       
        self.config = config or RiskEngineConfig()
        self.config.validate()
        
        # user_id -> deque of MessagePattern
        self.message_windows: Dict[str, deque] = {}
        
        logger.info("BehaviorRepetitionDetector initialized")
    
    def _categorize_risk(self, risk_score: float) -> str:
        """Categorize risk score into low/medium/high"""
        if risk_score >= self.config.alert_threshold_high:
            return 'high'
        elif risk_score >= self.config.alert_threshold_medium:
            return 'medium'
        else:
            return 'low'
    
    def _normalize_score(self, risk_score: float) -> float:
        """Normalize risk score to 0-1 range"""
        return max(0.0, min(1.0, risk_score / 100.0))
    
    def add_message(
        self,
        user_id: str,
        message_id: str,
        risk_score: float,
        timestamp: Optional[datetime] = None
    ) -> None:
        """
        Add a message to the user's message window
        
        Args:
            user_id: Unique identifier for the user
            message_id: Unique message identifier
            risk_score: Risk score for the message (0-100)
            timestamp: Message timestamp. If None, uses current time
        """
        if timestamp is None:
            timestamp = datetime.now()
        
        if user_id not in self.message_windows:
            self.message_windows[user_id] = deque(maxlen=self.config.repetition_window_size)
        
        pattern = MessagePattern(
            message_id=message_id,
            timestamp=timestamp,
            risk_score=risk_score,
            risk_category=self._categorize_risk(risk_score),
            normalized_score=self._normalize_score(risk_score)
        )
        
        self.message_windows[user_id].append(pattern)
        logger.debug(
            f"Added message {message_id} to window for user {user_id}. "
            f"Risk: {risk_score:.2f}, Category: {pattern.risk_category}"
        )
    
    def _calculate_similarity(
        self,
        pattern1: MessagePattern,
        pattern2: MessagePattern
    ) -> float:
        """
        Calculate similarity between two message patterns
        
        Args:
            pattern1: First message pattern
            pattern2: Second message pattern
            
        Returns:
            Similarity score (0-1), where 1 is identical
        """
        # Similarity based on risk category match
        category_match = 1.0 if pattern1.risk_category == pattern2.risk_category else 0.5
        
        # Similarity based on normalized score difference
        score_diff = abs(pattern1.normalized_score - pattern2.normalized_score)
        score_similarity = 1.0 - min(1.0, score_diff)
        
        # Combined similarity (weighted average)
        similarity = 0.6 * category_match + 0.4 * score_similarity
        
        return similarity
    
    def _detect_repetitive_sequences(self, patterns: List[MessagePattern]) -> List[Tuple[int, int, float]]:
        """
        Detect repetitive sequences in a list of patterns
        
        Args:
            patterns: List of MessagePattern objects
            
        Returns:
            List of tuples (start_idx, length, similarity) for repetitive sequences
        """
        if len(patterns) < 2:
            return []
        
        repetitive_sequences = []
        
        # Check for sequences of length 2 to len(patterns)//2
        max_sequence_length = min(len(patterns) // 2, 5)
        
        for seq_len in range(2, max_sequence_length + 1):
            for start_idx in range(len(patterns) - seq_len * 2 + 1):
                # Get the sequence
                sequence = patterns[start_idx:start_idx + seq_len]
                
                # Check if this sequence repeats
                for check_start in range(start_idx + seq_len, len(patterns) - seq_len + 1):
                    check_sequence = patterns[check_start:check_start + seq_len]
                    
                    # Calculate average similarity between sequences
                    similarities = [
                        self._calculate_similarity(seq[i], check_seq[i])
                        for i, (seq, check_seq) in enumerate(zip([sequence], [check_sequence]))
                        for seq, check_seq in [(sequence, check_sequence)]
                    ]
                    
                    # Calculate pairwise similarities
                    pairwise_sims = []
                    for i in range(seq_len):
                        sim = self._calculate_similarity(sequence[i], check_sequence[i])
                        pairwise_sims.append(sim)
                    
                    avg_similarity = sum(pairwise_sims) / len(pairwise_sims) if pairwise_sims else 0.0
                    
                    if avg_similarity >= self.config.repetition_threshold:
                        repetitive_sequences.append((start_idx, seq_len, avg_similarity))
        
        return repetitive_sequences
    
    def detect_repetition(self, user_id: str) -> Dict[str, any]:
        
        if user_id not in self.message_windows:
            return {
                'has_repetition': False,
                'repetition_score': 0.0,
                'pattern_count': 0,
                'average_similarity': 0.0,
                'repetition_level': 'none',
                'details': []
            }
        
        patterns = list(self.message_windows[user_id])
        
        if len(patterns) < self.config.repetition_min_count:
            return {
                'has_repetition': False,
                'repetition_score': 0.0,
                'pattern_count': 0,
                'average_similarity': 0.0,
                'repetition_level': 'none',
                'details': []
            }
        
        # Detect repetitive sequences
        repetitive_sequences = self._detect_repetitive_sequences(patterns)
        
        if not repetitive_sequences:
            return {
                'has_repetition': False,
                'repetition_score': 0.0,
                'pattern_count': 0,
                'average_similarity': 0.0,
                'repetition_level': 'none',
                'details': []
            }
        
        # Calculate metrics
        pattern_count = len(repetitive_sequences)
        similarities = [seq[2] for seq in repetitive_sequences]
        average_similarity = sum(similarities) / len(similarities) if similarities else 0.0
        
        # Calculate repetition score (0-100)
        # Based on pattern count and similarity
        base_score = min(100.0, pattern_count * 20.0)  # Each pattern adds up to 20 points
        similarity_multiplier = average_similarity  # Scale by similarity
        repetition_score = base_score * similarity_multiplier
        
        # Determine repetition level
        if pattern_count >= 5 or repetition_score >= 80:
            repetition_level = 'high'
        elif pattern_count >= 3 or repetition_score >= 50:
            repetition_level = 'medium'
        else:
            repetition_level = 'low'
        
        # Format details
        details = [
            {
                'start_index': seq[0],
                'length': seq[1],
                'similarity': round(seq[2], 3)
            }
            for seq in repetitive_sequences
        ]
        
        logger.debug(
            f"Detected repetition for user {user_id}: "
            f"{pattern_count} patterns, score={repetition_score:.2f}"
        )
        
        return {
            'has_repetition': True,
            'repetition_score': round(repetition_score, 2),
            'pattern_count': pattern_count,
            'average_similarity': round(average_similarity, 3),
            'repetition_level': repetition_level,
            'details': details
        }
    
    def get_repetition_score(self, user_id: str) -> float:
      
        detection_result = self.detect_repetition(user_id)
        return detection_result['repetition_score']
    
    def clear_user_history(self, user_id: str) -> bool:
        
        if user_id in self.message_windows:
            del self.message_windows[user_id]
            logger.info(f"Cleared behavior history for user {user_id}")
            return True
        return False
    
    def get_user_window_size(self, user_id: str) -> int:
        """Get current window size for a user"""
        if user_id not in self.message_windows:
            return 0
        return len(self.message_windows[user_id])
