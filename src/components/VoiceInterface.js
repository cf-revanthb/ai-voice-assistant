import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './VoiceInterface.css';

const VoiceInterface = ({ 
  isListening, 
  isProcessing, 
  isSpeaking, 
  wakeWordDetected, 
  isAlwaysListening,
  onStartListening, 
  onStopListening, 
  onToggleListening,
  onToggleAlwaysListening,
  onStopSpeaking,
  onPauseSpeaking,
  onResumeSpeaking
}) => {
  // Audio level state for future visual feedback
  // const [audioLevel, setAudioLevel] = useState(0);
  const [statusText, setStatusText] = useState('Ready to listen');

  useEffect(() => {
    if (isListening && isAlwaysListening) {
      setStatusText('Recording continuously... Speak naturally');
    } else if (isListening) {
      setStatusText('Recording... Speak naturally');
    } else if (isProcessing) {
      setStatusText('Processing your request...');
    } else if (isSpeaking) {
      setStatusText('Speaking response...');
    } else if (isAlwaysListening) {
      setStatusText('Continuous recording mode - click to start');
    } else {
      setStatusText('Click to start recording');
    }
  }, [isListening, isProcessing, isSpeaking, isAlwaysListening]);

  // Audio level effect for future visual feedback
  // useEffect(() => {
  //   let interval;
  //   if (isListening || isSpeaking) {
  //     interval = setInterval(() => {
  //       setAudioLevel(Math.random() * 100);
  //     }, 100);
  //   } else {
  //     setAudioLevel(0);
  //   }
  //   return () => clearInterval(interval);
  // }, [isListening, isSpeaking]);

  const getCircleState = () => {
    if (isListening && isAlwaysListening) return 'always-listening';
    if (isListening) return 'listening';
    if (isProcessing) return 'processing';
    if (isSpeaking) return 'speaking';
    return 'idle';
  };

  const getIcon = () => {
    if (isProcessing) return 'fas fa-spinner';
    if (isSpeaking) return 'fas fa-volume-up';
    return 'fas fa-microphone';
  };

  return (
    <motion.div 
      className="voice-interface glass-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="voice-container">
        {/* Main Voice Circle */}
        <div className="voice-circle-container">
          <motion.div
            className={`voice-circle ${getCircleState()}`}
            onClick={onToggleListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: isListening ? [1, 1.1, 1] : 1,
              rotate: isProcessing ? 360 : 0
            }}
            transition={{
              scale: { duration: 1, repeat: isListening ? Infinity : 0 },
              rotate: { duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }
            }}
          >
            <div className="circle-inner">
              <motion.i 
                className={getIcon()}
                animate={{ 
                  scale: isSpeaking ? [1, 1.2, 1] : 1,
                  rotate: isProcessing ? 360 : 0
                }}
                transition={{
                  scale: { duration: 0.8, repeat: isSpeaking ? Infinity : 0 },
                  rotate: { duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }
                }}
              />
            </div>
            
            {/* Animated Rings */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  className="pulse-ring"
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  className="wave-ring"
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Audio Visualization */}
        <AnimatePresence>
          {(isListening || isSpeaking) && (
            <motion.div
              className="audio-visualizer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="audio-bar"
                  animate={{
                    height: isListening || isSpeaking ? `${Math.random() * 60 + 20}px` : '20px',
                    backgroundColor: isSpeaking ? '#4ecdc4' : '#667eea'
                  }}
                  transition={{
                    duration: 0.1,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  style={{
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Display */}
        <div className="status-section">
          <motion.div 
            className="status-text"
            key={statusText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {statusText}
          </motion.div>
          
          <AnimatePresence>
            {wakeWordDetected && (
              <motion.div
                className="wake-word-indicator"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="wake-text">HEY CIRCLE</span>
                <motion.div
                  className="wake-pulse"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Control Buttons */}
        <div className="controls">
          <motion.button
            className={`control-btn ${isListening ? 'active' : ''}`}
            onClick={onStartListening}
            disabled={isListening || isProcessing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-play"></i>
            <span>Start Recording</span>
          </motion.button>
          
          <motion.button
            className="control-btn stop"
            onClick={onStopListening}
            disabled={!isListening && !isProcessing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-stop"></i>
            <span>Stop Recording</span>
          </motion.button>

          {isSpeaking && (
            <>
              <motion.button
                className="control-btn pause"
                onClick={onPauseSpeaking}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-pause"></i>
                <span>Pause</span>
              </motion.button>
              
              <motion.button
                className="control-btn stop-speak"
                onClick={onStopSpeaking}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-stop"></i>
                <span>Stop Speaking</span>
              </motion.button>
            </>
          )}
        </div>

        {/* Voice Commands Hint */}
        <motion.div 
          className="voice-hints"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p>Try saying:</p>
          <div className="hint-examples">
            <span>"Hey Circle, what's the weather?"</span>
            <span>"Hey Circle, tell me a joke"</span>
            <span>"Hey Circle, help me plan my day"</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VoiceInterface;
