import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [settings, setSettings] = useState({
    sambanovaApiKey: '',
    humeApiKey: '',
    humeSecretKey: '',
    model: 'llama-4-maverick-17b-128e-instruct',
    voice: 'default',
    language: 'en-US',
    wakeWordSensitivity: 0.8,
    autoStartListening: false,
    conversationMemory: true,
    emotionAnalysis: true,
    useHumeTTS: true
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('circleAgentSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings
        }));
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('circleAgentSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const resetSettings = () => {
    setSettings({
      sambanovaApiKey: '',
      humeApiKey: '',
      humeSecretKey: '',
      model: 'llama-4-maverick-17b-128e-instruct',
      voice: 'default',
      language: 'en-US',
      wakeWordSensitivity: 0.8,
      autoStartListening: false,
      conversationMemory: true,
      emotionAnalysis: true,
      useHumeTTS: true
    });
  };

  const validateSettings = () => {
    const errors = [];
    
    if (!settings.sambanovaApiKey.trim()) {
      errors.push('SambaNova API key is required');
    }
    
    if (settings.wakeWordSensitivity < 0 || settings.wakeWordSensitivity > 1) {
      errors.push('Wake word sensitivity must be between 0 and 1');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    validateSettings
  };
};
