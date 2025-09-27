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

  const wakeWords = useMemo(() => ['hey circle', 'hi circle', 'hello circle'], []);

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
      
      // Check for wake word if we're in wake word listening mode
      if (isWakeWordListeningRef.current && !wakeWordDetected) {
        if (checkForWakeWord(fullTranscript)) {
          console.log('Wake word detected!', fullTranscript);
          setWakeWordDetected(true);
          isWakeWordListeningRef.current = false;
          return;
        }
      }
      
      // Process the user's request after wake word is detected
      if (wakeWordDetected && finalTranscript) {
        console.log('Processing user input after wake word:', finalTranscript);
        processUserInput(finalTranscript.trim());
        stopListening();
      }
    };

    const checkForWakeWord = (transcript) => {
      return wakeWords.some(wakeWord => 
        transcript.includes(wakeWord.toLowerCase())
      );
    };

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
        if (isAlwaysListening && !isSpeaking) {
          setTimeout(() => {
            if (isAlwaysListening && !isSpeaking) {
              startContinuousListening();
            }
          }, 1000);
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
      isWakeWordListeningRef.current = true;
      setWakeWordDetected(false);
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
      
      let errorMessage = 'Sorry, I encountered an error processing your request.';
      
      // Provide specific error messages for common issues
      if (error.message.includes('API key')) {
        errorMessage = 'Please configure your SambaNova API key in the settings to use Circle.';
      } else if (error.message.includes('Rate limit')) {
        errorMessage = 'I\'m getting too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'I\'m having trouble connecting to the internet. Please check your connection.';
      }
      
      const errorMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        content: errorMessage,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMsg]);
      speak(errorMessage, userInput, {
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
    
    try {
      // Create conversational response with natural speech patterns
      const conversationalText = voiceService.createConversationalResponse(text, userInput);
      
      await voiceService.speak(conversationalText, {
        context: voiceService.getSpeechContext(text),
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        interrupt: true
      });
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

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
