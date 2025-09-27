# 🎤 The Balm Voice Agent - React Edition

A modern, interactive React-based AI voice agent with a Siri/Alexa-like interface, powered by SambaNova's Llama models and enhanced with Hume AI emotion analysis.

![The Balm Voice Agent](https://img.shields.io/badge/React-18.2.0-blue) ![SambaNova](https://img.shields.io/badge/SambaNova-Llama--3.1--8B-green) ![Hume AI](https://img.shields.io/badge/Hume%20AI-Emotion%20Analysis-purple)

## ✨ Features

### 🎯 **Core Voice Features**
- **Continuous Recording**: Click "Start Recording" to begin continuous voice interaction
- **Real-time Speech Recognition**: Continuous listening with Web Speech API
- **Natural Text-to-Speech**: High-quality voice responses
- **Conversation Memory**: Persistent chat history with timestamps

### 🤖 **AI Integration**
- **SambaNova API**: Powered by Llama-4-Maverick-17B-128E-Instruct
- **Hume AI**: Emotion analysis for meeting recordings
- **Smart Context**: Maintains conversation context and personality

### 🎨 **Modern UI/UX**
- **Siri/Alexa-like Interface**: Beautiful animated voice circle with visual feedback
- **Glass Morphism Design**: Modern, translucent UI elements
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Smooth Animations**: Framer Motion powered transitions

### 📊 **Meeting Analysis**
- **Video/Audio Upload**: Drag & drop support for meeting recordings
- **Emotion Detection**: Analyze speaker emotions and sentiment
- **Semantic Analysis**: Extract key topics and insights
- **Batch Processing**: Analyze multiple recordings simultaneously

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern browser with Web Speech API support
- SambaNova API key
- (Optional) Hume AI API key for emotion analysis

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd circle-ai-voice-agent
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Browser**
   - Navigate to `http://localhost:3000`
   - Allow microphone permissions when prompted

4. **Configure Settings**
   - Click the Settings button
   - Enter your SambaNova API key
   - Optionally add Hume AI API key
   - Save settings

5. **Start Talking**
   - Say "Hey Circle" to activate
   - Ask questions or give commands
   - Enjoy the conversation!

## 🔧 Configuration

### API Keys Setup

#### SambaNova API Key
1. Visit [SambaNova Cloud Portal](https://docs.sambanova.ai/docs/en/get-started/api-keys-urls)
2. Generate your API key
3. Enter it in the Settings modal

#### Hume AI API Key (Optional)
1. Sign up at [Hume AI](https://hume.ai)
2. Get your API key
3. Enable emotion analysis in settings

### Settings Options

- **AI Model**: Llama-4-Maverick-17B-128E-Instruct
- **Voice Selection**: Choose from available system voices
- **Language**: English (US/UK), Spanish, French, German
- **Wake Word Sensitivity**: Adjust detection threshold
- **Auto-start Listening**: Begin listening automatically
- **Conversation Memory**: Remember chat history
- **Emotion Analysis**: Enable Hume AI features

## 🎮 Usage

### Voice Commands
- **"Hey Circle, what's the weather?"** - Get weather information
- **"Hey Circle, tell me a joke"** - Entertainment and humor
- **"Hey Circle, help me plan my day"** - Task planning assistance
- **"Hey Circle, explain quantum computing"** - Educational content
- **"Hey Circle, analyze my meeting"** - Upload and analyze recordings

### Meeting Analysis
1. Click "Analyze Recordings" button
2. Upload MP4, WebM, WAV, or MP3 files
3. Select recordings to analyze
4. View emotion analysis and key insights
5. Export results for further review

### Conversation Features
- **Copy Messages**: Click copy icon on assistant responses
- **Re-speak**: Click speaker icon to replay messages
- **Clear History**: Remove conversation history
- **Export Chat**: Save conversation transcripts

## 🏗️ Architecture

### React Components
```
src/
├── components/
│   ├── VoiceInterface.js      # Main voice interaction UI
│   ├── ConversationPanel.js   # Chat history and controls
│   ├── Header.js             # Navigation and branding
│   ├── SettingsModal.js      # Configuration interface
│   └── AnalysisModal.js      # Meeting analysis tools
├── hooks/
│   ├── useVoiceAgent.js      # Voice recognition logic
│   └── useSettings.js        # Settings management
├── services/
│   ├── sambanovaService.js   # SambaNova API integration
│   └── humeService.js        # Hume AI integration
└── App.js                    # Main application component
```

### Key Technologies
- **React 18**: Modern functional components with hooks
- **Framer Motion**: Smooth animations and transitions
- **Web Speech API**: Browser-based speech recognition
- **SambaNova API**: Llama-4-Maverick model integration
- **Hume AI**: Emotion and sentiment analysis
- **CSS Grid/Flexbox**: Responsive layout design

## 🔌 API Integration

### SambaNova Configuration
```javascript
{
  "baseUrl": "https://api.sambanova.ai/v1",
  "model": "llama-4-maverick-17b-128e-instruct",
  "maxTokens": 200,
  "temperature": 0.7
}
```

### Hume AI Features
- **Emotion Recognition**: Facial expressions and voice tones
- **Sentiment Analysis**: Conversation emotional tone
- **Speaker Identification**: Multi-speaker recognition
- **Key Topic Extraction**: Important discussion points

## 🎨 UI Components

### Voice Interface
- **Animated Circle**: Visual feedback for listening states
- **Audio Visualization**: Real-time audio level indicators
- **Status Messages**: Clear feedback on current state
- **Wake Word Indicator**: Confirmation of activation

### Conversation Panel
- **Message Bubbles**: User and assistant messages
- **Action Buttons**: Copy, replay, and manage messages
- **Empty State**: Helpful prompts for first-time users
- **Scroll Behavior**: Auto-scroll to latest messages

### Settings Modal
- **API Configuration**: Secure key management
- **Voice Settings**: Language and voice selection
- **Preferences**: Customizable behavior options
- **Connection Testing**: Validate API credentials

## 🌐 Browser Compatibility

- ✅ **Chrome 25+**: Full feature support
- ✅ **Edge 79+**: Complete functionality
- ✅ **Safari 14.1+**: Full compatibility
- ❌ **Firefox**: Limited Web Speech API support

## 📱 Responsive Design

### Desktop (1024px+)
- Two-column layout with side-by-side panels
- Full feature set with hover effects
- Large voice circle with detailed animations

### Tablet (768px - 1024px)
- Stacked layout with optimized spacing
- Touch-friendly controls
- Reduced animation complexity

### Mobile (320px - 768px)
- Single-column layout
- Large touch targets
- Simplified interface elements
- Voice-optimized interactions

## 🔒 Security & Privacy

- **Local Storage**: Settings stored securely in browser
- **HTTPS Only**: All API communications encrypted
- **No Data Logging**: Conversations not stored externally
- **API Key Security**: Keys stored locally with encryption

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: `vercel --prod`
- **Netlify**: `npm run build && netlify deploy --prod --dir=build`
- **GitHub Pages**: `npm run build && gh-pages -d build`
- **Docker**: Use included Dockerfile

### Environment Variables
```bash
REACT_APP_SAMBA_NOVA_API_URL=https://api.sambanova.ai/v1
REACT_APP_HUME_AI_API_URL=https://api.hume.ai/v0
```

## 🐛 Troubleshooting

### Common Issues

**Microphone Not Working**
- Check browser permissions
- Ensure HTTPS connection
- Try refreshing the page
- Test in Chrome or Edge

**Speech Recognition Errors**
- Verify internet connection
- Check API key configuration
- Ensure stable network connection
- Try different browser

**No Voice Output**
- Check system volume
- Verify browser supports speech synthesis
- Select different voice in settings
- Test with different browsers

### Debug Mode
Open browser developer tools and check console for detailed error messages. The voice agent instance is available as `window.circleAgent` for debugging.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SambaNova](https://sambanova.ai) for the powerful LLM API
- [Hume AI](https://hume.ai) for emotion analysis capabilities
- [Framer Motion](https://framer.com/motion/) for smooth animations
- [React](https://reactjs.org/) for the amazing framework
- Web Speech API for browser-based voice features

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/circle-ai-voice-agent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/circle-ai-voice-agent/discussions)
- **Email**: support@circle-ai.com

---

**Built with ❤️ for the future of voice AI interaction**