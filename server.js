import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MCP Server Tools
const mcpTools = {
  get_book_recommendation: {
    name: 'get_book_recommendation',
    description: 'Get personalized book recommendations based on user preferences',
    parameters: {
      type: 'object',
      properties: {
        genres: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of preferred genres'
        },
        length: {
          type: 'string',
          enum: ['short', 'medium', 'long'],
          description: 'Preferred book length'
        },
        topics: {
          type: 'array',
          items: { type: 'string' },
          description: 'Topics of interest'
        }
      },
      required: ['genres', 'length', 'topics']
    }
  }
};

// OpenRouter API call
async function callOpenRouter(messages) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Book Recommendation MCP'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: messages,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  return await response.json();
}

// MCP endpoint - get book recommendations
app.post('/api/recommend', async (req, res) => {
  try {
    const { genres, length, topics } = req.body;

    if (!genres || !length || !topics) {
      return res.status(400).json({ 
        error: 'Missing required parameters: genres, length, topics' 
      });
    }

    const lengthMap = {
      short: 'under 250 pages',
      medium: '250-400 pages',
      long: 'over 400 pages'
    };

    const prompt = `You are a knowledgeable book recommendation assistant. Based on the following preferences, recommend 3 books with detailed explanations:

Genres: ${genres.join(', ')}
Book Length: ${lengthMap[length]}
Topics: ${topics.join(', ')}

For each book, provide:
1. Title and Author
2. Page count (approximate)
3. A brief summary (2-3 sentences)
4. Why it matches their preferences

Format your response clearly and engagingly.`;

    const messages = [
      { 
        role: 'system', 
        content: 'You are an expert librarian and book recommendation specialist with deep knowledge of literature across all genres.' 
      },
      { 
        role: 'user', 
        content: prompt 
      }
    ];

    const result = await callOpenRouter(messages);
    
    res.json({
      recommendations: result.choices[0].message.content,
      model: result.model,
      usage: result.usage
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to get recommendations', 
      details: error.message 
    });
  }
});

// MCP info endpoint
app.get('/api/mcp-info', (req, res) => {
  res.json({
    name: 'Book Recommendation MCP Server',
    version: '1.0.0',
    tools: Object.values(mcpTools)
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/recommend`);
});