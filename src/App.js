import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceInterface from './components/VoiceInterface';
import ConversationPanel from './components/ConversationPanel';
import SettingsModal from './components/SettingsModal';
import AnalysisModal from './components/AnalysisModal';
import Header from './components/Header';
import { useVoiceAgent } from './hooks/useVoiceAgent';
import { useSettings } from './hooks/useSettings';
import './App.css';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { settings, updateSettings } = useSettings();
  const {
    isListening,
    isProcessing,
    isSpeaking,
    wakeWordDetected,
    messages,
    startListening,
    stopListening,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    clearMessages
  } = useVoiceAgent(settings);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-content"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="loading-circle"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <i className="fas fa-circle"></i>
          </motion.div>
          <h1 className="loading-title">Circle AI Voice Agent</h1>
          <p className="loading-subtitle">Initializing your personal AI assistant...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAnalysisClick={() => setIsAnalysisOpen(true)}
      />
      
      <main className="main-content">
        <motion.div
          className="content-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VoiceInterface
            isListening={isListening}
            isProcessing={isProcessing}
            isSpeaking={isSpeaking}
            wakeWordDetected={wakeWordDetected}
            onStartListening={startListening}
            onStopListening={stopListening}
            onToggleListening={() => isListening ? stopListening() : startListening()}
            onStopSpeaking={stopSpeaking}
            onPauseSpeaking={pauseSpeaking}
            onResumeSpeaking={resumeSpeaking}
          />
          
          <ConversationPanel
            messages={messages}
            onClearMessages={clearMessages}
            onAnalyzeRecordings={() => setIsAnalysisOpen(true)}
          />
        </motion.div>
      </main>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={updateSettings}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
        
        {isAnalysisOpen && (
          <AnalysisModal
            onClose={() => setIsAnalysisOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
