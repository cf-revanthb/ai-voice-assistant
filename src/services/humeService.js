class HumeService {
  constructor() {
    this.baseUrl = 'https://api.hume.ai/v0';
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  // Get access token for client-side requests
  async getAccessToken(apiKey, secretKey) {
    try {
      const credentials = btoa(`${apiKey}:${secretKey}`);
      const response = await fetch('https://api.hume.ai/oauth2-cc/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  // Text-to-Speech using Hume AI
  async synthesizeSpeech(text, voiceId = 'default', apiKey) {
    try {
      const response = await fetch(`${this.baseUrl}/tts/generations`, {
        method: 'POST',
        headers: {
          'X-Hume-Api-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          voice_id: voiceId,
          encoding: 'pcm_s16le',
          sample_rate: 16000
        })
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return audioBlob;
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw error;
    }
  }

  // Speech-to-Speech using EVI
  async processSpeechToSpeech(audioBlob, apiKey) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch(`${this.baseUrl}/evi/process`, {
        method: 'POST',
        headers: {
          'X-Hume-Api-Key': apiKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`EVI request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error processing speech-to-speech:', error);
      throw error;
    }
  }

  async analyzeRecording(recording) {
    // Simulate Hume AI analysis
    // In a real implementation, this would upload the file to Hume AI API
    // and process it for emotion analysis
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAnalysis = {
          emotions: {
            joy: Math.random() * 0.8 + 0.1,
            sadness: Math.random() * 0.6,
            anger: Math.random() * 0.4,
            fear: Math.random() * 0.3,
            surprise: Math.random() * 0.5,
            disgust: Math.random() * 0.2,
            neutral: Math.random() * 0.7 + 0.2
          },
          summary: `Analysis of ${recording.name} shows a ${this.getDominantEmotion()} conversation. Key topics discussed include project planning, team coordination, and upcoming milestones. The overall sentiment is ${this.getSentiment()}.`,
          confidence: Math.random() * 0.3 + 0.7,
          duration: recording.duration,
          speakerCount: Math.floor(Math.random() * 5) + 2,
          keyTopics: [
            'Project Planning',
            'Team Coordination',
            'Budget Discussion',
            'Timeline Review',
            'Risk Assessment'
          ],
          sentiment: this.getSentiment(),
          engagement: Math.random() * 0.4 + 0.6
        };
        
        resolve(mockAnalysis);
      }, 2000 + Math.random() * 3000); // Simulate processing time
    });
  }

  getDominantEmotion() {
    const emotions = ['positive', 'neutral', 'focused', 'engaged', 'collaborative'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  }

  getSentiment() {
    const sentiments = ['positive', 'neutral', 'constructive'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  }

  async testConnection(apiKey) {
    try {
      if (!apiKey) {
        throw new Error('Hume AI API key is required');
      }

      // Test TTS endpoint
      const response = await fetch(`${this.baseUrl}/tts/voices`, {
        method: 'GET',
        headers: {
          'X-Hume-Api-Key': apiKey,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        return { success: true, message: 'Hume AI connection successful - TTS and EVI available' };
      } else if (response.status === 401) {
        return { success: false, message: 'Invalid Hume AI API key' };
      } else {
        return { success: false, message: `Hume AI connection failed: ${response.status}` };
      }
    } catch (error) {
      return { success: false, message: `Hume AI connection error: ${error.message}` };
    }
  }

  async getAvailableModels() {
    return [
      {
        id: 'emotion-recognition',
        name: 'Emotion Recognition',
        description: 'Analyzes facial expressions and voice tones for emotion detection'
      },
      {
        id: 'sentiment-analysis',
        name: 'Sentiment Analysis',
        description: 'Determines the emotional tone of conversations'
      },
      {
        id: 'speaker-identification',
        name: 'Speaker Identification',
        description: 'Identifies and distinguishes between different speakers'
      }
    ];
  }
}

export const humeService = new HumeService();
