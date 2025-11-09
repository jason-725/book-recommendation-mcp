Book Recommendation MCP Server
An MCP (Model Context Protocol) server that provides personalized book recommendations using OpenRouter and ChatGPT.

Features
MCP server architecture for book recommendations
OpenRouter integration with ChatGPT
Beautiful web interface
Easy deployment on Render
Personalized recommendations based on:
Genre preferences
Book length
Topics of interest
Setup Instructions
1. Install Dependencies
bash
npm install
2. Configure Environment Variables
Create a .env file in the root directory:

bash
cp .env.example .env
Edit .env and add your OpenRouter API key:

OPENROUTER_API_KEY=your_actual_api_key_here
YOUR_SITE_URL=http://localhost:3000
PORT=3000
3. Run Locally
bash
npm start
# or for development with auto-reload
npm run dev
Visit http://localhost:3000 to use the application.

Project Structure
book-recommendation-mcp/
├── server.js              # MCP server with Express
├── package.json          
├── .env                   # Environment variables (not in git)
├── .env.example          # Example env file
├── public/
│   └── index.html        # Frontend interface
└── README.md
API Endpoints
POST /api/recommend
Get book recommendations.

Request Body:

json
{
  "genres": ["Science Fiction", "Mystery"],
  "length": "medium",
  "topics": ["Space exploration", "Detective stories"]
}
Response:

json
{
  "recommendations": "Detailed book recommendations...",
  "model": "openai/gpt-4o-mini",
  "usage": { ... }
}
GET /api/mcp-info
Get MCP server information and available tools.

GET /health
Health check endpoint.

Deploying to Render
1. Push to GitHub
Create a new repository and push your code:

bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
2. Deploy on Render
Go to render.com and sign in
Click "New +" → "Web Service"
Connect your GitHub repository
Configure:
Name: book-recommendation-mcp
Environment: Node
Build Command: npm install
Start Command: npm start
Add environment variables:
OPENROUTER_API_KEY: Your OpenRouter API key
YOUR_SITE_URL: Your Render URL (e.g., https://your-app.onrender.com)
Click "Create Web Service"
Your app will be live at https://your-app-name.onrender.com

Getting an OpenRouter API Key
Go to openrouter.ai
Sign up or log in
Go to Keys section
Create a new API key
Add credits to your account
Technologies Used
Node.js - Runtime environment
Express - Web framework
OpenRouter - AI API gateway
ChatGPT (GPT-4o-mini) - AI model for recommendations
MCP - Model Context Protocol architecture
License
MIT

