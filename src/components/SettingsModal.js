import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sambanovaService } from '../services/sambanovaService';
import { voiceService } from '../services/voiceService';
import { configService } from '../services/configService';
import './SettingsModal.css';

const SettingsModal = ({ settings, onUpdateSettings, onClose }) => {
  const [formData, setFormData] = useState(settings);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  useEffect(() => {
    // Load available voices when component mounts
    const voices = voiceService.getAvailableVoices();
    setAvailableVoices(voices);
  }, []);

  const handleTestConnection = async () => {
    if (!formData.sambanovaApiKey.trim()) {
      setErrors({ sambanovaApiKey: 'API key is required for testing' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await sambanovaService.testConnection(formData.sambanovaApiKey);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test failed: ${error.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    
    try {
      const result = await voiceService.testVoice();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Voice test failed: ${error.message}`
      });
    } finally {
      setIsTestingVoice(false);
    }
  };

  const handleSave = () => {
    const newErrors = {};
    
    // Only validate if API key is provided but invalid
    if (formData.sambanovaApiKey && formData.sambanovaApiKey.trim() && formData.sambanovaApiKey.length < 10) {
      newErrors.sambanovaApiKey = 'API key appears to be too short';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Saving settings:', formData);
    onUpdateSettings(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      sambanovaApiKey: '',
      humeApiKey: '',
      model: 'llama-4-maverick-17b-128e-instruct',
      voice: 'default',
      language: 'en-US',
      wakeWordSensitivity: 0.8,
      autoStartListening: false,
      conversationMemory: true,
      emotionAnalysis: true
    });
    setErrors({});
    setTestResult(null);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content settings-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>
              <i className="fas fa-cog"></i>
              Settings
            </h3>
            <button className="close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="modal-body">
            <div className="settings-sections">
              {/* API Configuration */}
              <div className="settings-section">
                <h4>
                  <i className="fas fa-key"></i>
                  API Configuration
                </h4>
                
                <div className="form-group">
                  <label htmlFor="sambanovaApiKey">
                    SambaNova API Key *
                    <a 
                      href="https://docs.sambanova.ai/docs/en/get-started/api-keys-urls" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="help-link"
                    >
                      <i className="fas fa-external-link-alt"></i>
                      Get API Key
                    </a>
                  </label>
                  <div className="input-with-button">
                    <input
                      type="password"
                      id="sambanovaApiKey"
                      value={formData.sambanovaApiKey}
                      onChange={(e) => handleInputChange('sambanovaApiKey', e.target.value)}
                      className={errors.sambanovaApiKey ? 'error' : ''}
                      placeholder="Enter your SambaNova API key"
                    />
                    <button 
                      className="test-btn"
                      onClick={handleTestConnection}
                      disabled={isTesting || !formData.sambanovaApiKey.trim()}
                    >
                      {isTesting ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-plug"></i>
                      )}
                      Test
                    </button>
                  </div>
                  {errors.sambanovaApiKey && (
                    <div className="error-message">{errors.sambanovaApiKey}</div>
                  )}
                  {testResult && (
                    <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
                      <i className={`fas ${testResult.success ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                      {testResult.message}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="humeApiKey">
                    Hume AI API Key
                    <a 
                      href="https://dev.hume.ai/docs/introduction/api-key" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="help-link"
                      title="Get your Hume AI API key"
                    >
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  </label>
                  <input
                    type="password"
                    id="humeApiKey"
                    value={formData.humeApiKey}
                    onChange={(e) => handleInputChange('humeApiKey', e.target.value)}
                    placeholder="Enter your Hume AI API key for TTS and emotion analysis"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="humeSecretKey">
                    Hume AI Secret Key
                  </label>
                  <input
                    type="password"
                    id="humeSecretKey"
                    value={formData.humeSecretKey}
                    onChange={(e) => handleInputChange('humeSecretKey', e.target.value)}
                    placeholder="Enter your Hume AI secret key for token authentication"
                  />
                </div>
              </div>

              {/* Voice Configuration */}
              <div className="settings-section">
                <h4>
                  <i className="fas fa-microphone"></i>
                  Voice Configuration
                </h4>
                
                <div className="form-group">
                  <label htmlFor="model">AI Model</label>
                  <select
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                  >
                    {sambanovaService.getAvailableModels().map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="voice">
                    Voice
                    <button 
                      type="button"
                      className="test-voice-btn"
                      onClick={handleTestVoice}
                      disabled={isTestingVoice}
                      title="Test current voice"
                    >
                      {isTestingVoice ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-volume-up"></i>
                      )}
                      Test Voice
                    </button>
                  </label>
                  <select
                    id="voice"
                    value={formData.voice}
                    onChange={(e) => handleInputChange('voice', e.target.value)}
                  >
                    <option value="default">Auto-select Best Voice</option>
                    {availableVoices.map((voice, index) => (
                      <option key={index} value={index}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                  <div className="voice-info">
                    <small>
                      <i className="fas fa-info-circle"></i>
                      The system will automatically select the best natural-sounding voice for human-like speech.
                    </small>
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.useHumeTTS}
                      onChange={(e) => handleInputChange('useHumeTTS', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Use Hume AI Text-to-Speech
                  </label>
                  <div className="checkbox-info">
                    <small>
                      <i className="fas fa-info-circle"></i>
                      Enable Hume AI's advanced TTS for more natural and emotional speech synthesis. Requires Hume AI API key.
                    </small>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="wakeWordSensitivity">
                    Wake Word Sensitivity: {formData.wakeWordSensitivity}
                  </label>
                  <input
                    type="range"
                    id="wakeWordSensitivity"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.wakeWordSensitivity}
                    onChange={(e) => handleInputChange('wakeWordSensitivity', parseFloat(e.target.value))}
                  />
                  <div className="range-labels">
                    <span>Less Sensitive</span>
                    <span>More Sensitive</span>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="settings-section">
                <h4>
                  <i className="fas fa-sliders-h"></i>
                  Preferences
                </h4>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.autoStartListening}
                      onChange={(e) => handleInputChange('autoStartListening', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Auto-start listening when page loads
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.conversationMemory}
                      onChange={(e) => handleInputChange('conversationMemory', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Remember conversation history
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.emotionAnalysis}
                      onChange={(e) => handleInputChange('emotionAnalysis', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Enable emotion analysis (requires Hume AI)
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={handleReset}>
              <i className="fas fa-undo"></i>
              Reset
            </button>
            <button className="btn-primary" onClick={handleSave}>
              <i className="fas fa-save"></i>
              Save Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;
