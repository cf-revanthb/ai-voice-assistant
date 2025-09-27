class SambaNovaService {
  constructor() {
    this.baseUrl = 'https://api.sambanova.ai/v1';
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  async getResponse(userInput, settings) {
    if (!settings.sambanovaApiKey) {
      throw new Error('SambaNova API key not configured');
    }

    const requestBody = {
      model: settings.model,
      messages: [
        {
          role: 'system',
          content: `You are Circle, a helpful AI voice assistant. Provide clear, concise, and friendly responses. Keep responses under 200 words for better voice interaction. Be conversational and engaging.`
        },
        {
          role: 'user',
          content: userInput
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
      stream: false
    };

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.sambanovaApiKey}`
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid API key. Please check your SambaNova API key.');
          } else if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
          }
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid response format from API');
        }

        return data.choices[0].message.content.trim();

      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (attempt === this.maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  async testConnection(apiKey) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-4-maverick-17b-128e-instruct',
          messages: [
            {
              role: 'user',
              content: 'Hello, this is a test message.'
            }
          ],
          max_tokens: 10
        })
      });

      if (response.ok) {
        return { success: true, message: 'Connection successful' };
      } else {
        return { success: false, message: `Connection failed: ${response.status}` };
      }
    } catch (error) {
      return { success: false, message: `Connection error: ${error.message}` };
    }
  }

  getAvailableModels() {
    return [
      {
        id: 'llama-4-maverick-17b-128e-instruct',
        name: 'Llama-4-Maverick-17B-128E-Instruct',
        description: 'Latest Llama model with enhanced instruction following'
      }
    ];
  }
}

export const sambanovaService = new SambaNovaService();
