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
      temperature: 0.7,
      max_tokens: 1500  // Limit response length for faster completion
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

    const prompt = `Based on the following preferences, recommend 3 books:

Genres: ${genres.join(', ')}
Book Length: ${lengthMap[length]}
Topics: ${topics.join(', ')}

For each book (numbered 1, 2, and 3), provide:
- Title and Author
- Page count (approximate)
- A brief summary (2-3 sentences)
- Why it matches their preferences

Write in a warm, conversational tone as if speaking directly to a reader. Use clear paragraphs with line breaks between books. Number each recommendation (1, 2, 3) but avoid using other markdown formatting symbols (**, ###, emojis). Write naturally and professionally, like a knowledgeable librarian having a friendly conversation.`;

    const messages = [
      { 
        role: 'system', 
        content: 'You are an experienced librarian with decades of knowledge about books across all genres. You speak in a warm, professional, conversational tone - friendly but not overly casual. You write in clear prose with simple numbering (1, 2, 3) but without markdown formatting, emojis, or special symbols like ** or ###. Your recommendations are thoughtful, well-reasoned, and tailored to each reader. You write as if having a one-on-one conversation with a book lover who trusts your expertise.' 
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