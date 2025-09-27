// Circle AI Voice Agent Configuration Template
// Copy this file to config.js and fill in your API keys

window.CIRCLE_CONFIG = {
    // SambaNova API Configuration
    sambanova: {
        apiKey: 'YOUR_SAMBA_NOVA_API_KEY_HERE',
        baseUrl: 'https://api.sambanova.ai/v1',
        model: 'llama-4-maverick-17b-128e-instruct',
        maxTokens: 200,
        temperature: 0.7
    },
    
    // Hume AI Configuration (Optional)
    hume: {
        apiKey: 'YOUR_HUME_AI_API_KEY_HERE',
        enabled: false // Set to true if you want to use Hume AI features
    },
    
    // Wake Word Configuration
    wakeWords: [
        'hey circle',
        'hi circle', 
        'hello circle'
    ],
    
    // Voice Configuration
    voice: {
        rate: 0.9,
        pitch: 1.0,
        volume: 1.0,
        language: 'en-US'
    },
    
    // UI Configuration
    ui: {
        showDebugInfo: false,
        autoStartListening: false,
        conversationHistoryLimit: 50
    },
    
    // Development Configuration
    development: {
        enableConsoleLogging: true,
        mockApiResponses: false,
        debugMode: false
    }
};

// Instructions:
// 1. Get your SambaNova API key from: https://docs.sambanova.ai/docs/en/get-started/api-keys-urls
// 2. Optionally get your Hume AI API key from: https://hume.ai
// 3. Copy this file to config.js
// 4. Replace the placeholder values with your actual API keys
// 5. Save and restart the application
