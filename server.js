/**
 * server.js – Local CORS proxy for Universal AI Chat
 *
 * Forwards browser requests to any supported LLM provider server-side,
 * bypassing CORS entirely. Supports:
 *   OpenAI · Azure OpenAI · Azure AI Foundry · Google Gemini · Groq · Ollama
 */

const express = require('express');
const fetch   = require('node-fetch');
const path    = require('path');

const app  = express();
const PORT = 3001;

/* ── Middleware ───────────────────────────────────────────── */
app.use(express.json({ limit: '8mb' }));
app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, api-key, Authorization, x-api-key');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ── Allowed host patterns ────────────────────────────────── */
const ALLOWED_HOSTS = [
  // Azure / Microsoft
  '.openai.azure.com',
  '.services.ai.azure.com',
  '.azure.com',
  '.microsoft.com',
  '.cognitiveservices.azure.com',
  // OpenAI
  '.openai.com',
  // Google Gemini
  '.googleapis.com',
  // Groq
  '.groq.com',
  // Local tunneling for Ollama
  '.ngrok.app',
  '.ngrok-free.app',
  '.ngrok.io',
  // Ollama (local)
  'localhost',
  '127.0.0.1',
  '::1',
];

function isHostAllowed(hostname) {
  return ALLOWED_HOSTS.some(h => hostname === h || hostname.endsWith(h));
}

/* ── /api/relay endpoint ──────────────────────────────────────── */
app.post('/api/relay', async (req, res) => {
  const { targetUrl, headers: fwdHeaders, body: fwdBody } = req.body;

  if (!targetUrl) return res.status(400).json({ error: 'targetUrl is required' });

  let parsedUrl;
  try { parsedUrl = new URL(targetUrl); }
  catch { return res.status(400).json({ error: 'Invalid targetUrl' }); }

  const label = `${parsedUrl.hostname}${parsedUrl.pathname.slice(0, 60)}`;
  console.log(`[relay] → POST ${label}`);

  // Send 200 OK immediately and start a heartbeat to bypass Safari 60s timeout
  res.status(200);
  res.setHeader('Content-Type', 'application/json');
  const heartbeat = setInterval(() => res.write(' '), 15000);

  try {
    const upstream = await fetch(targetUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...(fwdHeaders || {}) },
      body:    JSON.stringify(fwdBody),
    });

    const rawText = await upstream.text();
    clearInterval(heartbeat);

    console.log(`[proxy] ← ${upstream.status} ${upstream.statusText}`);
    if (!upstream.ok) console.error('[proxy] error:', rawText.slice(0, 500));

    res.write(rawText);
    res.end();

  } catch (err) {
    clearInterval(heartbeat);
    console.error('[proxy] upstream error:', err.message);
    res.write(JSON.stringify({ error: `Upstream request failed: ${err.message}` }));
    res.end();
  }
});

/* ── Health check ─────────────────────────────────────────── */
app.get('/health', (_, res) => res.json({ status: 'ok', port: PORT }));

/* ── Catch-all → index.html ───────────────────────────────── */
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'index.html')));

/* ── Start ────────────────────────────────────────────────── */
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('  ┌────────────────────────────────────────────────┐');
    console.log('  │   Universal AI Chat – Proxy Server             │');
    console.log(`  │   http://localhost:${PORT}                         │`);
    console.log('  │   OpenAI · Azure OpenAI · Azure AI Foundry     │');
    console.log('  │   Google Gemini · Groq · Ollama                │');
    console.log('  │   Press Ctrl+C to stop                         │');
    console.log('  └────────────────────────────────────────────────┘');
    console.log('');
  });

  // Disable timeout for long-running local LLMs
  server.setTimeout(0);
}

module.exports = app;
