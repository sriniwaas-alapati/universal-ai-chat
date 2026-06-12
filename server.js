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

/* ── /proxy endpoint ──────────────────────────────────────── */
app.post('/proxy', async (req, res) => {
  const { targetUrl, headers: fwdHeaders, body: fwdBody } = req.body;

  if (!targetUrl) return res.status(400).json({ error: 'targetUrl is required' });

  let parsedUrl;
  try { parsedUrl = new URL(targetUrl); }
  catch { return res.status(400).json({ error: 'Invalid targetUrl' }); }

  if (!isHostAllowed(parsedUrl.hostname)) {
    return res.status(403).json({ error: `Host not allowed: ${parsedUrl.hostname}` });
  }

  const label = `${parsedUrl.hostname}${parsedUrl.pathname.slice(0, 60)}`;
  console.log(`[proxy] → POST ${label}`);

  try {
    const upstream = await fetch(targetUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...(fwdHeaders || {}) },
      body:    JSON.stringify(fwdBody),
    });

    const contentType = upstream.headers.get('content-type') || '';
    const rawText     = await upstream.text();

    console.log(`[proxy] ← ${upstream.status} ${upstream.statusText}`);
    if (!upstream.ok) console.error('[proxy] error:', rawText.slice(0, 500));

    res.status(upstream.status);
    res.setHeader('Content-Type', contentType || 'application/json');
    res.send(rawText);

  } catch (err) {
    console.error('[proxy] upstream error:', err.message);
    res.status(502).json({ error: `Upstream request failed: ${err.message}` });
  }
});

/* ── Health check ─────────────────────────────────────────── */
app.get('/health', (_, res) => res.json({ status: 'ok', port: PORT }));

/* ── Catch-all → index.html ───────────────────────────────── */
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'index.html')));

/* ── Start ────────────────────────────────────────────────── */
app.listen(PORT, () => {
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
