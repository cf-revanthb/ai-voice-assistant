class VoiceService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.voices = [];
    this.currentVoice = null;
    this.isSpeaking = false;
    this.voiceQueue = [];
    this.isProcessingQueue = false;
    
    this.loadVoices();
    this.setupVoiceEvents();
  }

  setupVoiceEvents() {
    this.synthesis.onvoiceschanged = () => {
      this.loadVoices();
    };
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();
    this.selectBestVoice();
  }

  selectBestVoice() {
    // Prioritize high-quality, natural-sounding voices
    const preferredVoices = [
      'Google US English', // Chrome
      'Microsoft Zira Desktop', // Edge
      'Alex', // macOS
      'Samantha', // macOS
      'Victoria', // macOS
      'Daniel', // macOS
      'Karen', // macOS
      'Moira', // macOS
      'Tessa', // macOS
      'Google UK English Female',
      'Google UK English Male',
      'Microsoft Hazel Desktop',
      'Microsoft Susan Desktop'
    ];

    // Try to find a preferred voice
    for (const preferredName of preferredVoices) {
      const voice = this.voices.find(v => 
        v.name.includes(preferredName) || 
        v.name.toLowerCase().includes(preferredName.toLowerCase())
      );
      if (voice) {
        this.currentVoice = voice;
        return;
      }
    }

    // Fallback to any English voice
    const englishVoice = this.voices.find(v => 
      v.lang.startsWith('en') && v.localService
    );
    if (englishVoice) {
      this.currentVoice = englishVoice;
    }
  }

  getVoiceSettings(context = 'neutral') {
    const baseSettings = {
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      lang: 'en-US'
    };

    // Adjust settings based on context for more natural speech
    switch (context) {
      case 'excited':
        return {
          ...baseSettings,
          rate: 1.05,
          pitch: 1.1,
          volume: 1.0
        };
      case 'calm':
        return {
          ...baseSettings,
          rate: 0.85,
          pitch: 0.95,
          volume: 0.95
        };
      case 'question':
        return {
          ...baseSettings,
          rate: 0.9,
          pitch: 1.05, // Slight upward inflection for questions
          volume: 1.0
        };
      case 'explanation':
        return {
          ...baseSettings,
          rate: 0.85, // Slower for explanations
          pitch: 1.0,
          volume: 1.0
        };
      case 'error':
        return {
          ...baseSettings,
          rate: 0.8,
          pitch: 0.9,
          volume: 0.9
        };
      default:
        return baseSettings;
    }
  }

  // Enhanced text preprocessing for more natural speech
  preprocessText(text) {
    // Add natural pauses and emphasis
    let processedText = text
      // Add pauses after sentences
      .replace(/\. /g, '. ')
      .replace(/! /g, '! ')
      .replace(/\? /g, '? ')
      // Add emphasis to important words
      .replace(/\*\*(.*?)\*\*/g, '<emphasis level="strong">$1</emphasis>')
      .replace(/\*(.*?)\*/g, '<emphasis level="moderate">$1</emphasis>')
      // Handle numbers more naturally
      .replace(/\b(\d+)\b/g, (match) => {
        const num = parseInt(match);
        if (num < 100) {
          return this.numberToWords(num);
        }
        return match;
      })
      // Handle common abbreviations
      .replace(/\b(etc\.|vs\.|e\.g\.|i\.e\.)\b/g, (match) => {
        const expansions = {
          'etc.': 'etcetera',
          'vs.': 'versus',
          'e.g.': 'for example',
          'i.e.': 'that is'
        };
        return expansions[match] || match;
      })
      // Add natural breathing points
      .replace(/([,;:])\s+/g, '$1 ')
      // Handle quotes more naturally
      .replace(/"([^"]*)"/g, 'quote $1 end quote')
      .replace(/'([^']*)'/g, 'quote $1 end quote');

    return processedText;
  }

  numberToWords(num) {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if (num === 0) return 'zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one ? ' ' + ones[one] : '');
    }
    return num.toString(); // Fallback for larger numbers
  }

  // Determine speech context from text content
  getSpeechContext(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('!') || lowerText.includes('amazing') || lowerText.includes('wonderful')) {
      return 'excited';
    }
    if (lowerText.includes('?') || lowerText.includes('what') || lowerText.includes('how') || lowerText.includes('why')) {
      return 'question';
    }
    if (lowerText.includes('sorry') || lowerText.includes('error') || lowerText.includes('problem')) {
      return 'error';
    }
    if (lowerText.includes('explain') || lowerText.includes('because') || lowerText.includes('therefore')) {
      return 'explanation';
    }
    if (lowerText.includes('relax') || lowerText.includes('calm') || lowerText.includes('peaceful')) {
      return 'calm';
    }
    
    return 'neutral';
  }

  // Add natural conversational elements
  addConversationalElements(text, context) {
    let enhancedText = text;
    
    // Add natural interjections based on context
    if (context === 'excited') {
      const interjections = ['Great!', 'Wonderful!', 'Excellent!'];
      if (Math.random() < 0.3) {
        enhancedText = interjections[Math.floor(Math.random() * interjections.length)] + ' ' + enhancedText;
      }
    }
    
    if (context === 'question') {
      const starters = ['Let me think about that.', 'That\'s an interesting question.', 'I\'d be happy to help with that.'];
      if (Math.random() < 0.4) {
        enhancedText = starters[Math.floor(Math.random() * starters.length)] + ' ' + enhancedText;
      }
    }
    
    if (context === 'error') {
      const apologies = ['I apologize, but', 'I\'m sorry,', 'Unfortunately,'];
      if (Math.random() < 0.5) {
        enhancedText = apologies[Math.floor(Math.random() * apologies.length)] + ' ' + enhancedText;
      }
    }
    
    return enhancedText;
  }

  async speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (this.isSpeaking && !options.interrupt) {
        this.voiceQueue.push({ text, options, resolve, reject });
        this.processQueue();
        return;
      }

      if (options.interrupt) {
        this.stopSpeaking();
      }

      const context = options.context || this.getSpeechContext(text);
      const processedText = this.preprocessText(text);
      const enhancedText = this.addConversationalElements(processedText, context);
      const voiceSettings = this.getVoiceSettings(context);

      const utterance = new SpeechSynthesisUtterance(enhancedText);
      
      // Apply voice settings
      utterance.voice = this.currentVoice;
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = voiceSettings.volume;
      utterance.lang = voiceSettings.lang;

      // Add natural speech patterns
      this.addNaturalPatterns(utterance, context);

      // Event handlers
      utterance.onstart = () => {
        this.isSpeaking = true;
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (options.onEnd) options.onEnd();
        resolve();
        this.processQueue();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        console.error('Speech synthesis error:', event.error);
        reject(new Error(event.error));
        this.processQueue();
      };

      utterance.onpause = () => {
        if (options.onPause) options.onPause();
      };

      utterance.onresume = () => {
        if (options.onResume) options.onResume();
      };

      // Start speaking
      this.synthesis.speak(utterance);
    });
  }

  addNaturalPatterns(utterance, context) {
    // Add subtle variations for more natural speech
    const variations = {
      rate: 0.05, // ±5% variation
      pitch: 0.03, // ±3% variation
      volume: 0.02  // ±2% variation
    };

    // Apply random variations
    utterance.rate += (Math.random() - 0.5) * variations.rate;
    utterance.pitch += (Math.random() - 0.5) * variations.pitch;
    utterance.volume += (Math.random() - 0.5) * variations.volume;

    // Ensure values stay within valid ranges
    utterance.rate = Math.max(0.1, Math.min(10, utterance.rate));
    utterance.pitch = Math.max(0, Math.min(2, utterance.pitch));
    utterance.volume = Math.max(0, Math.min(1, utterance.volume));
  }

  async processQueue() {
    if (this.isProcessingQueue || this.voiceQueue.length === 0 || this.isSpeaking) {
      return;
    }

    this.isProcessingQueue = true;
    const next = this.voiceQueue.shift();

    try {
      await this.speak(next.text, next.options);
      next.resolve();
    } catch (error) {
      next.reject(error);
    } finally {
      this.isProcessingQueue = false;
      if (this.voiceQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  stopSpeaking() {
    this.synthesis.cancel();
    this.isSpeaking = false;
    this.voiceQueue = [];
    this.isProcessingQueue = false;
  }

  pauseSpeaking() {
    if (this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  resumeSpeaking() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  getAvailableVoices() {
    return this.voices.filter(voice => voice.lang.startsWith('en'));
  }

  setVoice(voiceName) {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.currentVoice = voice;
      return true;
    }
    return false;
  }

  // Create a conversational response with natural speech patterns
  createConversationalResponse(aiResponse, userInput) {
    // Add natural conversation flow
    let response = aiResponse;
    
    // Add acknowledgment for questions
    if (userInput.toLowerCase().includes('?')) {
      const acknowledgments = [
        'That\'s a great question!',
        'I\'d be happy to help with that.',
        'Let me help you with that.',
        'That\'s an interesting question.'
      ];
      
      if (Math.random() < 0.4) {
        response = acknowledgments[Math.floor(Math.random() * acknowledgments.length)] + ' ' + response;
      }
    }
    
    // Add natural conclusions
    const conclusions = [
      'I hope that helps!',
      'Let me know if you need anything else!',
      'Is there anything else I can help you with?',
      'Feel free to ask if you have more questions!'
    ];
    
    if (Math.random() < 0.3) {
      response += ' ' + conclusions[Math.floor(Math.random() * conclusions.length)];
    }
    
    return response;
  }

  // Test voice quality and availability
  async testVoice() {
    try {
      await this.speak('Hello! I am Circle, your AI voice assistant. How can I help you today?', {
        context: 'neutral',
        onStart: () => console.log('Voice test started'),
        onEnd: () => console.log('Voice test completed')
      });
      return { success: true, message: 'Voice synthesis working correctly' };
    } catch (error) {
      return { success: false, message: `Voice test failed: ${error.message}` };
    }
  }
}

export const voiceService = new VoiceService();
