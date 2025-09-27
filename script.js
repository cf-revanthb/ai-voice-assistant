class CircleVoiceAgent {
    constructor() {
        this.isListening = false;
        this.isProcessing = false;
        this.isSpeaking = false;
        this.wakeWordDetected = false;
        this.recognition = null;
        this.synthesis = null;
        this.settings = {
            sambanovaApiKey: 'e12f2185-471a-4981-88ba-ea59ab1588ef',
            humeApiKey: 'NQkxPMlLFAFzL8uM3MjSZDQAdhGenVwWK9bPGGzFFBN6jwVB',
            model: 'llama-4-maverick-17b-128e-instruct',
            voice: 'default'
        };
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadSettings();
        this.initializeSpeechRecognition();
        this.initializeSpeechSynthesis();
        this.setupWakeWordDetection();
    }

    setupElements() {
        this.elements = {
            voiceCircle: document.getElementById('voiceCircle'),
            micIcon: document.getElementById('micIcon'),
            pulseRing: document.getElementById('pulseRing'),
            waveRing: document.getElementById('waveRing'),
            statusText: document.getElementById('statusText'),
            wakeWordIndicator: document.getElementById('wakeWordIndicator'),
            startBtn: document.getElementById('startBtn'),
            stopBtn: document.getElementById('stopBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            clearBtn: document.getElementById('clearBtn'),
            messages: document.getElementById('messages'),
            settingsModal: document.getElementById('settingsModal'),
            closeSettings: document.getElementById('closeSettings'),
            saveSettings: document.getElementById('saveSettings'),
            sambanovaApiKey: document.getElementById('sambanovaApiKey'),
            humeApiKey: document.getElementById('humeApiKey'),
            modelSelect: document.getElementById('modelSelect'),
            voiceSelect: document.getElementById('voiceSelect')
        };
    }

    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startListening());
        this.elements.stopBtn.addEventListener('click', () => this.stopListening());
        this.elements.settingsBtn.addEventListener('click', () => this.showSettings());
        this.elements.clearBtn.addEventListener('click', () => this.clearMessages());
        this.elements.closeSettings.addEventListener('click', () => this.hideSettings());
        this.elements.saveSettings.addEventListener('click', () => this.saveSettings());
        this.elements.voiceCircle.addEventListener('click', () => this.toggleListening());
        
        // Close modal when clicking outside
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.hideSettings();
            }
        });
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('circleAgentSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            this.elements.sambanovaApiKey.value = this.settings.sambanovaApiKey;
            this.elements.humeApiKey.value = this.settings.humeApiKey;
            this.elements.modelSelect.value = this.settings.model;
            this.elements.voiceSelect.value = this.settings.voice;
        }
    }

    saveSettings() {
        this.settings.sambanovaApiKey = this.elements.sambanovaApiKey.value;
        this.settings.humeApiKey = this.elements.humeApiKey.value;
        this.settings.model = this.elements.modelSelect.value;
        this.settings.voice = this.elements.voiceSelect.value;
        
        localStorage.setItem('circleAgentSettings', JSON.stringify(this.settings));
        this.hideSettings();
        this.showNotification('Settings saved successfully!');
    }

    showSettings() {
        this.elements.settingsModal.classList.add('show');
    }

    hideSettings() {
        this.elements.settingsModal.classList.remove('show');
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                console.log('Speech recognition started');
                this.updateStatus('Listening for "Hey Circle"...');
                this.animateListening();
            };
            
            this.recognition.onresult = (event) => {
                this.handleSpeechResult(event);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.handleRecognitionError(event.error);
            };
            
            this.recognition.onend = () => {
                console.log('Speech recognition ended');
                this.stopListening();
            };
        } else {
            console.error('Speech recognition not supported');
            this.showNotification('Speech recognition not supported in this browser', 'error');
        }
    }

    initializeSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            
            // Load available voices
            this.loadVoices();
            this.synthesis.onvoiceschanged = () => this.loadVoices();
        } else {
            console.error('Speech synthesis not supported');
            this.showNotification('Speech synthesis not supported in this browser', 'error');
        }
    }

    loadVoices() {
        const voices = this.synthesis.getVoices();
        const voiceSelect = this.elements.voiceSelect;
        voiceSelect.innerHTML = '<option value="default">Default</option>';
        
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }

    setupWakeWordDetection() {
        // Simple wake word detection using keyword matching
        this.wakeWords = ['hey circle', 'hi circle', 'hello circle'];
        this.isWakeWordListening = false;
    }

    startListening() {
        if (!this.recognition) {
            this.showNotification('Speech recognition not available', 'error');
            return;
        }

        if (this.isListening) return;

        this.isListening = true;
        this.isWakeWordListening = true;
        this.wakeWordDetected = false;
        
        this.elements.startBtn.disabled = true;
        this.elements.stopBtn.disabled = false;
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.showNotification('Error starting speech recognition', 'error');
            this.stopListening();
        }
    }

    stopListening() {
        if (!this.isListening) return;

        this.isListening = false;
        this.isWakeWordListening = false;
        this.wakeWordDetected = false;
        
        this.elements.startBtn.disabled = false;
        this.elements.stopBtn.disabled = true;
        
        if (this.recognition) {
            this.recognition.stop();
        }
        
        this.stopAnimations();
        this.updateStatus('Ready to listen');
        this.hideWakeWordIndicator();
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    handleSpeechResult(event) {
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
        
        // Check for wake word if we're in wake word listening mode
        if (this.isWakeWordListening && !this.wakeWordDetected) {
            if (this.checkForWakeWord(fullTranscript)) {
                this.wakeWordDetected = true;
                this.isWakeWordListening = false;
                this.showWakeWordIndicator();
                this.updateStatus('Wake word detected! Speak your request...');
                this.animateListening();
                return;
            }
        }
        
        // Process the user's request after wake word is detected
        if (this.wakeWordDetected && finalTranscript) {
            this.processUserInput(finalTranscript.trim());
            this.stopListening();
        }
    }

    checkForWakeWord(transcript) {
        return this.wakeWords.some(wakeWord => 
            transcript.includes(wakeWord.toLowerCase())
        );
    }

    async processUserInput(userInput) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.updateStatus('Processing your request...');
        this.animateProcessing();
        
        // Add user message to conversation
        this.addMessage('user', userInput);
        
        try {
            // Get response from SambaNova API
            const response = await this.callSambaNovaAPI(userInput);
            
            // Add assistant response to conversation
            this.addMessage('assistant', response);
            
            // Speak the response
            this.speak(response);
            
        } catch (error) {
            console.error('Error processing request:', error);
            const errorMessage = 'Sorry, I encountered an error processing your request.';
            this.addMessage('assistant', errorMessage);
            this.speak(errorMessage);
            this.showNotification('Error processing request', 'error');
        } finally {
            this.isProcessing = false;
            this.stopAnimations();
            this.updateStatus('Ready to listen');
        }
    }

    async callSambaNovaAPI(userInput) {
        if (!this.settings.sambanovaApiKey) {
            throw new Error('SambaNova API key not configured');
        }

        const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.settings.sambanovaApiKey}`
            },
            body: JSON.stringify({
                model: this.settings.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are Circle, a helpful AI voice assistant. Provide clear, concise, and friendly responses. Keep responses under 200 words for better voice interaction.'
                    },
                    {
                        role: 'user',
                        content: userInput
                    }
                ],
                max_tokens: 200,
                temperature: 0.7,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    speak(text) {
        if (!this.synthesis || this.isSpeaking) return;
        
        this.isSpeaking = true;
        this.animateSpeaking();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice if available
        const voices = this.synthesis.getVoices();
        if (voices.length > 0 && this.settings.voice !== 'default') {
            utterance.voice = voices[parseInt(this.settings.voice)];
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
            this.isSpeaking = false;
            this.stopAnimations();
            this.updateStatus('Ready to listen');
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isSpeaking = false;
            this.stopAnimations();
            this.updateStatus('Speech synthesis error');
        };
        
        this.synthesis.speak(utterance);
    }

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.textContent = content;
        messageDiv.appendChild(contentDiv);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString();
        messageDiv.appendChild(timeDiv);
        
        this.elements.messages.appendChild(messageDiv);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }

    clearMessages() {
        this.elements.messages.innerHTML = '';
    }

    updateStatus(text) {
        this.elements.statusText.textContent = text;
    }

    showWakeWordIndicator() {
        this.elements.wakeWordIndicator.classList.add('show');
        setTimeout(() => {
            this.elements.wakeWordIndicator.classList.remove('show');
        }, 2000);
    }

    hideWakeWordIndicator() {
        this.elements.wakeWordIndicator.classList.remove('show');
    }

    animateListening() {
        this.elements.voiceCircle.classList.add('listening');
        this.elements.pulseRing.classList.add('active');
        this.elements.micIcon.className = 'fas fa-microphone';
    }

    animateSpeaking() {
        this.elements.voiceCircle.classList.remove('listening');
        this.elements.voiceCircle.classList.add('speaking');
        this.elements.waveRing.classList.add('active');
        this.elements.micIcon.className = 'fas fa-volume-up';
    }

    animateProcessing() {
        this.elements.voiceCircle.classList.remove('listening', 'speaking');
        this.elements.voiceCircle.classList.add('processing');
        this.elements.micIcon.className = 'fas fa-spinner fa-spin';
    }

    stopAnimations() {
        this.elements.voiceCircle.classList.remove('listening', 'speaking', 'processing');
        this.elements.pulseRing.classList.remove('active');
        this.elements.waveRing.classList.remove('active');
        this.elements.micIcon.className = 'fas fa-microphone';
    }

    handleRecognitionError(error) {
        let errorMessage = 'Speech recognition error: ';
        
        switch (error) {
            case 'no-speech':
                errorMessage += 'No speech detected';
                break;
            case 'audio-capture':
                errorMessage += 'Audio capture failed';
                break;
            case 'not-allowed':
                errorMessage += 'Microphone access denied';
                break;
            case 'network':
                errorMessage += 'Network error';
                break;
            default:
                errorMessage += error;
        }
        
        this.showNotification(errorMessage, 'error');
        this.stopListening();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'error' ? '#ff6b6b' : '#4ecdc4',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            zIndex: '10000',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Initialize the Circle Voice Agent when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const agent = new CircleVoiceAgent();
    
    // Make agent globally available for debugging
    window.circleAgent = agent;
});
