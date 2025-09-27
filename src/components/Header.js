import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';

const Header = ({ onSettingsClick, onAnalysisClick }) => {
  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-content">
        <motion.div 
          className="logo-section"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="logo-icon"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <i className="fas fa-circle"></i>
          </motion.div>
          <div className="logo-text">
            <h1 className="title">Circle AI</h1>
            <p className="subtitle">Voice Agent</p>
          </div>
        </motion.div>

        <div className="header-actions">
          <motion.button
            className="header-btn analysis-btn"
            onClick={onAnalysisClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Analyze Recordings"
          >
            <i className="fas fa-video"></i>
            <span>Recordings</span>
          </motion.button>
          
          <motion.button
            className="header-btn settings-btn"
            onClick={onSettingsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Settings"
          >
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </motion.button>
        </div>
      </div>
      
      <motion.div 
        className="header-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p>Say "Hey Circle" to start a conversation with your AI assistant</p>
      </motion.div>
    </motion.header>
  );
};

export default Header;
