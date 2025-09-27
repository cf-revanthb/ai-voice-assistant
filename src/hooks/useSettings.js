import { useState, useEffect } from 'react';
import { configService } from '../services/configService';

export const useSettings = () => {
  const [settings, setSettings] = useState({
    sambanovaApiKey: process.env.REACT_APP_SAMBANOVA_API_KEY || '',
    humeApiKey: process.env.REACT_APP_HUME_API_KEY || '',
    humeSecretKey: process.env.REACT_APP_HUME_SECRET_KEY || '',
    model: process.env.REACT_APP_SAMBANOVA_MODEL || 'meta-llama/Llama-3.1-8B-Instruct',
    voice: 'default',
    language: 'en-US',
    wakeWordSensitivity: 0.8,
    autoStartListening: false,
    conversationMemory: true,
    emotionAnalysis: true,
    useHumeTTS: process.env.REACT_APP_USE_HUME_TTS === 'true' || true
  });

  // Load settings from localStorage on mount, merging with environment variables
  useEffect(() => {
    const savedSettings = localStorage.getItem('theBalmAgentSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => {
          // Merge environment variables with localStorage settings
          // Environment variables take precedence
          const mergedSettings = {
            ...prevSettings,
            ...parsedSettings,
            // Override with environment variables if they exist
            sambanovaApiKey: process.env.REACT_APP_SAMBANOVA_API_KEY || parsedSettings.sambanovaApiKey || '',
            humeApiKey: process.env.REACT_APP_HUME_API_KEY || parsedSettings.humeApiKey || '',
            humeSecretKey: process.env.REACT_APP_HUME_SECRET_KEY || parsedSettings.humeSecretKey || '',
            model: process.env.REACT_APP_SAMBANOVA_MODEL || parsedSettings.model || 'meta-llama/Llama-3.1-8B-Instruct',
            useHumeTTS: process.env.REACT_APP_USE_HUME_TTS ? process.env.REACT_APP_USE_HUME_TTS === 'true' : parsedSettings.useHumeTTS
          };
          return mergedSettings;
        });
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('theBalmAgentSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    console.log('Updating settings with:', newSettings);
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings
      };
      console.log('Updated settings:', updatedSettings);
      return updatedSettings;
    });
  };

  const resetSettings = () => {
    setSettings({
      sambanovaApiKey: '',
      humeApiKey: '',
      humeSecretKey: '',
      model: 'meta-llama/Llama-3.1-8B-Instruct',
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
