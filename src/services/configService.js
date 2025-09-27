/**
 * Configuration Service for The Balm Voice Agent
 * Handles API keys and settings from environment variables and localStorage
 */

class ConfigService {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    return {
      // SambaNova Configuration
      sambanovaApiKey: process.env.REACT_APP_SAMBANOVA_API_KEY || '',
      sambanovaModel: process.env.REACT_APP_SAMBANOVA_MODEL || 'meta-llama/Llama-3.1-8B-Instruct',
      
      // Hume AI Configuration
      humeApiKey: process.env.REACT_APP_HUME_API_KEY || '',
      humeSecretKey: process.env.REACT_APP_HUME_SECRET_KEY || '',
      
      // Application Settings
      useHumeTTS: process.env.REACT_APP_USE_HUME_TTS === 'true' || true,
      appName: process.env.REACT_APP_APP_NAME || 'The Balm',
      appVersion: process.env.REACT_APP_APP_VERSION || '1.0.0'
    };
  }

  /**
   * Get configuration with fallback to localStorage settings
   */
  getConfig(localStorageSettings = {}) {
    return {
      sambanovaApiKey: this.config.sambanovaApiKey || localStorageSettings.sambanovaApiKey || '',
      sambanovaModel: this.config.sambanovaModel || localStorageSettings.model || 'meta-llama/Llama-3.1-8B-Instruct',
      humeApiKey: this.config.humeApiKey || localStorageSettings.humeApiKey || '',
      humeSecretKey: this.config.humeSecretKey || localStorageSettings.humeSecretKey || '',
      useHumeTTS: this.config.useHumeTTS || localStorageSettings.useHumeTTS || true,
      appName: this.config.appName,
      appVersion: this.config.appVersion
    };
  }

  /**
   * Check if API keys are configured via environment variables
   */
  hasEnvConfig() {
    return {
      sambanova: !!this.config.sambanovaApiKey,
      hume: !!(this.config.humeApiKey && this.config.humeSecretKey),
      any: !!(this.config.sambanovaApiKey || this.config.humeApiKey)
    };
  }

  /**
   * Get configuration status for UI display
   */
  getConfigStatus() {
    const envConfig = this.hasEnvConfig();
    
    return {
      sambanova: {
        configured: envConfig.sambanova,
        source: envConfig.sambanova ? 'Environment Variables' : 'Settings Panel',
        message: envConfig.sambanova ? '✅ Configured via .env' : '⚠️ Configure in Settings'
      },
      hume: {
        configured: envConfig.hume,
        source: envConfig.hume ? 'Environment Variables' : 'Settings Panel',
        message: envConfig.hume ? '✅ Configured via .env' : '⚠️ Configure in Settings'
      }
    };
  }

  /**
   * Create a simple .env file content for user reference
   */
  generateEnvTemplate() {
    return `# The Balm Voice Agent - API Configuration
# Copy this to .env.local and fill in your actual API keys

# SambaNova API Configuration
REACT_APP_SAMBANOVA_API_KEY=your_sambanova_api_key_here
REACT_APP_SAMBANOVA_MODEL=meta-llama/Llama-3.1-8B-Instruct

# Hume AI API Configuration
REACT_APP_HUME_API_KEY=your_hume_api_key_here
REACT_APP_HUME_SECRET_KEY=your_hume_secret_key_here

# Application Settings
REACT_APP_USE_HUME_TTS=true
REACT_APP_APP_NAME=The Balm
REACT_APP_APP_VERSION=1.0.0`;
  }
}

export const configService = new ConfigService();
