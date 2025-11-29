# Groq API Setup Guide

## Getting Your Free Groq API Key

Montify uses Groq's fast and free AI API for dataset quality analysis. Here's how to set it up:

### Step 1: Get Your API Key

1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up for a free account (if you haven't already)
3. Click "Create API Key"
4. Copy your new API key

### Step 2: Configure Your Environment

1. In the project root, copy `.env.local.example` to `.env.local`:

   ```bash
   copy .env.local.example .env.local
   ```

2. Open `.env.local` and replace `your_groq_api_key_here` with your actual API key:
   ```
   GROQ_API_KEY=gsk_your_actual_api_key_here
   ```

### Step 3: Restart Development Server

Stop the dev server (Ctrl+C) and restart it:

```bash
npm run dev
```

## Features

- **Free Tier**: Generous free tier with high rate limits
- **Fast**: Uses `llama-3.3-70b-versatile` model for quick analysis
- **Secure**: API key is stored server-side only (never exposed to client)
- **Mock Mode**: Works without API key (uses mock analysis for testing)

## Troubleshooting

### "Invalid API Key" Error

- Make sure you've created `.env.local` file
- Verify your API key is correct (starts with `gsk_`)
- Restart the development server after adding the key

### "API Key Not Configured" Warning

- The app will work with mock analysis
- You'll see sample quality scores (not real AI analysis)
- Configure the API key to enable real AI-powered analysis

## Why Groq?

- ⚡ **10-100x faster** than other LLM APIs
- 💰 **Free tier** with generous limits
- 🎯 **Accurate** quality analysis with llama-3.3-70b
- 🔒 **Secure** server-side API integration

## Need Help?

- [Groq Documentation](https://console.groq.com/docs)
- [Groq Discord Community](https://discord.gg/groq)
