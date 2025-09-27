import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConversationPanel.css';

const ConversationPanel = ({ messages, onClearMessages, onAnalyzeRecordings }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageAnimation = (index) => ({
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.9 },
    transition: { 
      duration: 0.4, 
      delay: index * 0.1,
      type: "spring",
      stiffness: 100
    }
  });

  return (
    <motion.div 
      className="conversation-panel glass-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="conversation-header">
        <div className="header-left">
          <h3 className="conversation-title">
            <i className="fas fa-comments"></i>
            Conversation
          </h3>
          <div className="message-count">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="header-actions">
          <motion.button
            className="action-btn analyze-btn"
            onClick={onAnalyzeRecordings}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Analyze Meeting Recordings"
          >
            <i className="fas fa-video"></i>
            <span>Analyze</span>
          </motion.button>
          
          <motion.button
            className="action-btn clear-btn"
            onClick={onClearMessages}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Clear Conversation"
          >
            <i className="fas fa-trash"></i>
            <span>Clear</span>
          </motion.button>
        </div>
      </div>

      <div className="messages-container">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="empty-icon">
                <i className="fas fa-comment-dots"></i>
              </div>
              <h4>Start a Conversation</h4>
              <p>Say "Hey Circle" to begin talking with your AI assistant</p>
              <div className="example-prompts">
                <div className="prompt-item">
                  <i className="fas fa-lightbulb"></i>
                  <span>"Hey Circle, what's the weather like?"</span>
                </div>
                <div className="prompt-item">
                  <i className="fas fa-smile"></i>
                  <span>"Hey Circle, tell me a joke"</span>
                </div>
                <div className="prompt-item">
                  <i className="fas fa-tasks"></i>
                  <span>"Hey Circle, help me plan my day"</span>
                </div>
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`message ${message.type}`}
                {...getMessageAnimation(index)}
                layout
              >
                <div className="message-content">
                  <div className="message-text">
                    {message.content}
                  </div>
                  <div className="message-meta">
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.type === 'assistant' && (
                      <span className="message-type">
                        <i className="fas fa-robot"></i>
                        The Balm
                      </span>
                    )}
                    {message.type === 'user' && (
                      <span className="message-type">
                        <i className="fas fa-user"></i>
                        You
                      </span>
                    )}
                  </div>
                </div>
                
                {message.type === 'assistant' && (
                  <motion.div 
                    className="message-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      className="action-icon"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Copy message"
                      onClick={() => navigator.clipboard.writeText(message.content)}
                    >
                      <i className="fas fa-copy"></i>
                    </motion.button>
                    <motion.button
                      className="action-icon"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Speak message"
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(message.content);
                        speechSynthesis.speak(utterance);
                      }}
                    >
                      <i className="fas fa-volume-up"></i>
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="conversation-footer">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>The Balm is ready</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationPanel;
