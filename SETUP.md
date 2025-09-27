# The Balm Voice Agent - Setup Instructions

## Quick Setup with Environment Variables

### 1. Create your .env.local file

Copy the example file and add your API keys:

```bash
cp env.example .env.local
```

### 2. Edit .env.local with your actual API keys

Open `.env.local` and replace the placeholder values:

```env
# SambaNova API Configuration
REACT_APP_SAMBANOVA_API_KEY=your_actual_sambanova_api_key_here
REACT_APP_SAMBANOVA_MODEL=meta-llama/Llama-3.1-8B-Instruct

# Hume AI API Configuration
REACT_APP_HUME_API_KEY=your_actual_hume_api_key_here
REACT_APP_HUME_SECRET_KEY=your_actual_hume_secret_key_here

# Application Settings
REACT_APP_USE_HUME_TTS=true
REACT_APP_APP_NAME=The Balm
REACT_APP_APP_VERSION=1.0.0
```

### 3. Restart the development server

After adding your API keys to `.env.local`, you MUST restart the React development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

### 4. Verify configuration

1. Open the app in your browser
2. Open the browser console (F12)
3. Look for the "Environment Variables Debug" section
4. You should see "Set" next to your configured API keys

### 5. Test the voice agent

1. Click "Start Recording"
2. Say something like "Tell me a joke"
3. The agent should respond using your SambaNova API

## Troubleshooting

### If the agent still says "configure API key":

1. **Check the console** - Look for the debug output to see if environment variables are loaded
2. **Restart the server** - Environment variables are only loaded when the server starts
3. **Check file name** - Make sure your file is named `.env.local` (not `.env`)
4. **Check variable names** - All React environment variables must start with `REACT_APP_`

### If you see "Not set" in the console:

- The `.env.local` file might not exist
- The server wasn't restarted after adding the file
- The variable names are incorrect

### Alternative: Use Settings Panel

If environment variables don't work, you can still configure API keys through the Settings panel (gear icon), but the `.env.local` method is recommended for security.
