import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { sambanovaService } from '../services/sambanovaService';
import { voiceService } from '../services/voiceService';

export const useVoiceAgent = (settings) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isAlwaysListening, setIsAlwaysListening] = useState(true);
  
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const isWakeWordListeningRef = useRef(false);

  const wakeWords = useMemo(() => ['hey balm', 'hi balm', 'hello balm'], []);

  // Fallback response system for when API is unavailable
  const getFallbackResponse = useCallback((userInput) => {
    const input = userInput.toLowerCase();
    
    // Greeting responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return 'Hello! I\'m The Balm, your AI voice assistant. I\'m currently running in offline mode, but I\'m still here to help!';
    }
    
    // Availability questions
    if (input.includes('available') || input.includes('working') || input.includes('function')) {
      return 'Yes, I\'m available and working! I can hear you clearly. While my advanced AI features need proper API configuration, I can still respond to your questions in basic mode.';
    }
    
    // Help questions
    if (input.includes('help') || input.includes('what can you do')) {
      return 'I can help you with basic conversations and respond to your questions. To unlock my full AI capabilities, please configure your API keys in the settings.';
    }
    
    // Status questions
    if (input.includes('status') || input.includes('how are you')) {
      return 'I\'m doing well! My voice recognition is working perfectly, and I can hear you clearly. I\'m running in basic mode until the AI services are properly configured.';
    }
    
    // Weather (common question)
    if (input.includes('weather')) {
      return 'I\'d love to help with weather information, but I need my AI services to be properly configured for that. Please check your API keys in settings.';
    }
    
    // Time questions
    if (input.includes('time') || input.includes('what time')) {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      return `The current time is ${timeString}. I can help with time-related questions in basic mode!`;
    }
    
    // Default response
    return `I heard you say "${userInput}". While I'm running in basic mode, I can still have conversations with you. To unlock my full AI capabilities, please configure your API keys in the settings.`;
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const handleSpeechResult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase().trim();
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      const fullTranscript = (finalTranscript + interimTranscript).trim();
      
      console.log('Speech result:', { fullTranscript, finalTranscript, wakeWordDetected, isWakeWordListening: isWakeWordListeningRef.current });
      
      // Process any final transcript directly (no wake word required)
      if (finalTranscript && finalTranscript.trim()) {
        console.log('Processing user input:', finalTranscript);
        processUserInput(finalTranscript.trim());
        // Don't stop listening - keep continuous recording
        // stopListening();
      }
    };

    // Wake word function removed - no longer needed for continuous recording

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        isWakeWordListeningRef.current = true;
        setWakeWordDetected(false);
      };
      
      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        isWakeWordListeningRef.current = false;
      };
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        isWakeWordListeningRef.current = false;
        
        // Auto-restart listening if always listening is enabled and not speaking
        // Add delay to prevent hearing the assistant's own voice
        if (isAlwaysListening && !isSpeaking) {
          setTimeout(() => {
            if (isAlwaysListening && !isSpeaking) {
              startContinuousListening();
            }
          }, 3000); // Increased delay to avoid hearing assistant's voice
        }
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    // Start continuous listening if enabled
    if (isAlwaysListening) {
      startContinuousListening();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wakeWordDetected, wakeWords, isAlwaysListening]);

  const startContinuousListening = useCallback(() => {
    if (!recognitionRef.current || isListening || isSpeaking) return;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      isWakeWordListeningRef.current = false; // No wake word needed
      setWakeWordDetected(false);
      console.log('Started continuous listening (no wake word required)');
    } catch (error) {
      console.error('Error starting continuous listening:', error);
      // Retry after a short delay
      setTimeout(() => {
        if (isAlwaysListening && !isSpeaking) {
          startContinuousListening();
        }
      }, 2000);
    }
  }, [isListening, isSpeaking, isAlwaysListening]);


  const processUserInput = useCallback(async (userInput) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    // Add user message to conversation
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: userInput,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Check if API key is configured
      console.log('Current settings:', settings);
      console.log('API Key value:', settings.sambanovaApiKey);
      console.log('API Key length:', settings.sambanovaApiKey ? settings.sambanovaApiKey.length : 0);
      console.log('Environment variables:');
      console.log('REACT_APP_SAMBANOVA_API_KEY:', process.env.REACT_APP_SAMBANOVA_API_KEY ? 'Set' : 'Not set');
      console.log('REACT_APP_HUME_API_KEY:', process.env.REACT_APP_HUME_API_KEY ? 'Set' : 'Not set');
      
      if (!settings.sambanovaApiKey || settings.sambanovaApiKey.trim() === '') {
        throw new Error('SambaNova API key not configured. Please add your API key in settings.');
      }

      console.log('Processing user input:', userInput);
      console.log('Using API key:', settings.sambanovaApiKey ? 'Configured' : 'Not configured');
      
      // Get response from SambaNova API
      const response = await sambanovaService.getResponse(userInput, settings);
      
      console.log('Received response from SambaNova:', response);
      
      // Add assistant response to conversation
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response with natural voice (try Hume AI TTS if available)
      speak(response, userInput, {
        useHumeTTS: settings.useHumeTTS,
        humeApiKey: settings.humeApiKey,
        voiceId: settings.voice
      });
      
    } catch (error) {
      console.error('Error processing request:', error);
      
      // Try to provide a helpful fallback response
      let responseMessage = getFallbackResponse(userInput);
      
      // Provide specific error messages for common issues
      if (error.message.includes('API key')) {
        responseMessage = 'Please configure your SambaNova API key in the settings to use The Balm.';
      } else if (error.message.includes('404')) {
        responseMessage = getFallbackResponse(userInput);
      } else if (error.message.includes('Rate limit')) {
        responseMessage = 'I\'m getting too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('Network')) {
        responseMessage = 'I\'m having trouble connecting to the internet. Please check your connection.';
      }
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: responseMessage,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      speak(responseMessage, userInput, {
        useHumeTTS: settings.useHumeTTS,
        humeApiKey: settings.humeApiKey,
        voiceId: settings.voice
      });
    } finally {
      setIsProcessing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing, settings]);

  const speak = useCallback(async (text, userInput = '') => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    
    // Stop speech recognition while speaking to prevent feedback
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      console.log('Stopped speech recognition while speaking');
    }
    
    try {
      // Create conversational response with natural speech patterns
      const conversationalText = voiceService.createConversationalResponse(text, userInput);
      
      await voiceService.speak(conversationalText, {
        context: voiceService.getSpeechContext(text),
        onStart: () => {
          setIsSpeaking(true);
          // Ensure speech recognition is stopped when speaking starts
          if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
          }
        },
        onEnd: () => {
          setIsSpeaking(false);
          // Restart speech recognition after speaking ends
          if (isAlwaysListening) {
            setTimeout(() => {
              if (isAlwaysListening && !isSpeaking) {
                startContinuousListening();
              }
            }, 2000); // Wait 2 seconds before restarting
          }
        },
        interrupt: true
      });
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      // Restart speech recognition if speaking fails
      if (isAlwaysListening) {
        setTimeout(() => {
          if (isAlwaysListening && !isSpeaking) {
            startContinuousListening();
          }
        }, 1000);
      }
    }
  }, [isSpeaking, isListening, isAlwaysListening, startContinuousListening]);

  const startListening = useCallback(() => {
    setIsAlwaysListening(true);
    startContinuousListening();
  }, [startContinuousListening]);

  const stopListening = useCallback(() => {
    setIsAlwaysListening(false);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    isWakeWordListeningRef.current = false;
    setWakeWordDetected(false);
  }, [isListening]);

  const toggleAlwaysListening = useCallback(() => {
    if (isAlwaysListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isAlwaysListening, startListening, stopListening]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const stopSpeaking = useCallback(() => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  const pauseSpeaking = useCallback(() => {
    voiceService.pauseSpeaking();
  }, []);

  const resumeSpeaking = useCallback(() => {
    voiceService.resumeSpeaking();
  }, []);

  const testVoice = useCallback(async () => {
    return await voiceService.testVoice();
  }, []);

  const getAvailableVoices = useCallback(() => {
    return voiceService.getAvailableVoices();
  }, []);

  return {
    isListening,
    isProcessing,
    isSpeaking,
    wakeWordDetected,
    messages,
    isAlwaysListening,
    startListening,
    stopListening,
    toggleAlwaysListening,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    clearMessages,
    processUserInput,
    testVoice,
    getAvailableVoices
  };
};
