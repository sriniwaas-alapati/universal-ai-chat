/**
 * Universal AI Chat – Step-by-Step Multi-Provider Setup
 */

/* ═══════════════════════════════════════════════════════════
   PROVIDER DEFINITIONS & WIZARD STEPS
   ═══════════════════════════════════════════════════════════ */
const PROVIDERS = {
  openai: {
    id: 'openai', name: 'OpenAI', emoji: '🟢', color: '#10a37f',
    defaultEndpoint: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1', 'o3-mini'], defaultModel: 'gpt-4o',
    wizard: [
      {
        title: 'Get your API Key',
        desc: 'Grab an API key from the <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI dashboard</a>.',
        fields: [{ id: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-proj-...' }]
      },
      {
        title: 'Configure Connection',
        desc: 'Select a model and connect. Adjust advanced settings if needed.',
        fields: [
          { id: 'modelId', label: 'Model', type: 'select' },
          { id: 'endpointUrl', label: 'Endpoint URL', type: 'url', advanced: true },
          { id: 'temperature', label: 'Temperature (0-2)', type: 'range', min: 0, max: 2, step: 0.1, val: 0.7, advanced: true },
          { id: 'systemPrompt', label: 'System Instructions', type: 'textarea', placeholder: 'You are a helpful assistant...', advanced: true }
        ]
      }
    ]
  },
  'azure-openai': {
    id: 'azure-openai', name: 'Azure OpenAI', emoji: '🔵', color: '#0078d4',
    defaultEndpoint: 'https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=2024-12-01-preview',
    models: [], defaultModel: '',
    wizard: [
      {
        title: 'Azure Configuration',
        desc: 'Find your Endpoint and Key in the <a href="https://oai.azure.com/" target="_blank">Azure AI Studio</a> under your deployment.',
        fields: [
          { id: 'endpointUrl', label: 'Full Deployment URL', type: 'url', placeholder: 'https://<resource>.openai.azure.com/...' },
          { id: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Your Azure key...' },
          { id: 'modelId', label: 'Model Name (Optional)', type: 'text', placeholder: 'gpt-4o' }
        ]
      },
      {
        title: 'Advanced Settings',
        desc: 'Tune your model parameters.',
        fields: [
          { id: 'temperature', label: 'Temperature', type: 'range', min: 0, max: 2, step: 0.1, val: 0.7, advanced: true },
          { id: 'systemPrompt', label: 'System Instructions', type: 'textarea', placeholder: 'You are a helpful assistant...', advanced: true }
        ]
      }
    ]
  },
  foundry: {
    id: 'foundry', name: 'AI Foundry', emoji: '🔷', color: '#5c2d91',
    defaultEndpoint: 'https://<resource>.services.ai.azure.com/api/projects/<project>',
    models: [], defaultModel: '',
    wizard: [
      {
        title: 'Authentication',
        desc: 'For Agents with OBO, you must use an Entra ID token. Use <code>az account get-access-token --resource https://ai.azure.com --query accessToken -o tsv</code>',
        fields: [
          { id: 'authMode', label: 'Auth Method', type: 'select', options: [{val:'bearer', text:'Entra ID Bearer Token'}, {val:'apikey', text:'Project API Key'}] },
          { id: 'apiKey', label: 'Token / Key', type: 'password', placeholder: 'Paste token or key here...' }
        ]
      },
      {
        title: 'Project Settings',
        desc: 'Enter your AI Foundry endpoint and Agent Name to route messages.',
        fields: [
          { id: 'endpointUrl', label: 'Project Endpoint', type: 'url', placeholder: 'https://...' },
          { id: 'agentName', label: 'Agent Name (Required for Tools)', type: 'text', placeholder: 'my-rag-agent' },
          { id: 'apiVersion', label: 'API Version', type: 'text', val: '2025-05-15-preview', advanced: true },
          { id: 'systemPrompt', label: 'Instructions', type: 'textarea', advanced: true }
        ]
      }
    ]
  },
  gemini: {
    id: 'gemini', name: 'Gemini', emoji: '🌈', color: '#ea4335',
    defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'], defaultModel: 'gemini-2.0-flash',
    wizard: [
      {
        title: 'Get your API Key',
        desc: 'Get your free key from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>.',
        fields: [{ id: 'apiKey', label: 'API Key', type: 'password', placeholder: 'AIzaSy...' }]
      },
      {
        title: 'Select Model',
        desc: 'Gemini 2.0 Flash is recommended for speed and capability.',
        fields: [
          { id: 'modelId', label: 'Model', type: 'select' },
          { id: 'endpointUrl', label: 'Endpoint URL', type: 'url', advanced: true },
          { id: 'temperature', label: 'Temperature', type: 'range', min: 0, max: 2, step: 0.1, val: 0.7, advanced: true },
          { id: 'systemPrompt', label: 'System Instructions', type: 'textarea', advanced: true }
        ]
      }
    ]
  },
  groq: {
    id: 'groq', name: 'Groq', emoji: '⚡', color: '#f5a623',
    defaultEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'], defaultModel: 'llama-3.3-70b-versatile',
    wizard: [
      {
        title: 'Get your API Key',
        desc: 'Get your ultra-fast Groq key from <a href="https://console.groq.com/keys" target="_blank">Groq Console</a>.',
        fields: [{ id: 'apiKey', label: 'API Key', type: 'password', placeholder: 'gsk_...' }]
      },
      {
        title: 'Model Configuration',
        desc: 'Select your preferred open-weight model.',
        fields: [
          { id: 'modelId', label: 'Model', type: 'select' },
          { id: 'endpointUrl', label: 'Endpoint URL', type: 'url', advanced: true },
          { id: 'temperature', label: 'Temperature', type: 'range', min: 0, max: 2, step: 0.1, val: 0.7, advanced: true }
        ]
      }
    ]
  },
  ollama: {
    id: 'ollama', name: 'Ollama', emoji: '🦙', color: '#7c3aed',
    defaultEndpoint: 'http://127.0.0.1:11434/api/chat',
    models: ['llama3.2', 'gemma4:12b-it-qat', 'mistral', 'phi4', 'qwen2.5'], defaultModel: 'llama3.2',
    wizard: [
      {
        title: 'Local Setup',
        desc: 'Ensure <a href="https://ollama.com" target="_blank">Ollama</a> is running locally. Make sure the model you select is already downloaded (e.g., <code>ollama run llama3.2</code>).',
        fields: [
          { id: 'endpointUrl', label: 'Endpoint URL', type: 'url' },
          { id: 'modelId', label: 'Local Model Name', type: 'text', placeholder: 'llama3.2' },
          { id: 'temperature', label: 'Temperature', type: 'range', min: 0, max: 2, step: 0.1, val: 0.7, advanced: true },
          { id: 'systemPrompt', label: 'System Instructions', type: 'textarea', advanced: true }
        ]
      }
    ]
  }
};

/* ═══════════════════════════════════════════════════════════
   STATE & DOM REFS
   ═══════════════════════════════════════════════════════════ */
const state = {
  providerId: 'openai', connected: false, loading: false,
  messages: [], estimatedTokens: 0, formData: {}
};

const PROXY_URL   = '/proxy';
const STORAGE_KEY = 'universal_ai_config_v2';
const $ = id => document.getElementById(id);

const els = {
  providerGrid: $('providerGrid'), setupWizard: $('setupWizard'),
  btnSend: $('btnSend'), userInput: $('userInput'), messagesList: $('messagesList'),
  chatContainer: $('chatContainer'), welcomeState: $('welcomeState'),
  providerShowcase: $('providerShowcase'), topbarSubtitle: $('topbarSubtitle'),
  connectionStatus: $('connectionStatus'), statusDot: $('statusDot'), statusText: $('statusText'),
  providerBadge: $('providerBadge'), tokenCount: $('tokenCount'), modelPill: $('modelPill'),
  modelPillText: $('modelPillText'), poweredBy: $('poweredBy'), charCount: $('charCount'),
  toast: $('toast'), btnClearChat: $('btnClearChat'), btnExport: $('btnExport')
};

/* ═══════════════════════════════════════════════════════════
   UI INITIALIZATION
   ═══════════════════════════════════════════════════════════ */
function init() {
  loadState();

  // Render static provider grid
  els.providerGrid.innerHTML = Object.values(PROVIDERS).map(p => `
    <button class="provider-card ${p.id === state.providerId ? 'active' : ''}"
            data-provider="${p.id}" style="--pc:${p.color}" title="${p.name}">
      <span class="provider-card-icon">${p.emoji}</span>
      <span class="provider-card-name">${p.name}</span>
    </button>`).join('');

  els.providerGrid.querySelectorAll('.provider-card').forEach(btn => {
    btn.addEventListener('click', () => switchProvider(btn.dataset.provider));
  });

  // Render showcase on welcome screen
  els.providerShowcase.innerHTML = Object.values(PROVIDERS).map(p =>
    `<div class="showcase-badge"><span>${p.emoji}</span><span>${p.name}</span></div>`
  ).join('');

  renderWizard(state.providerId);
}

function switchProvider(id) {
  if (state.providerId === id) return;
  state.providerId = id;

  els.providerGrid.querySelectorAll('.provider-card').forEach(c => {
    c.classList.toggle('active', c.dataset.provider === id);
  });

  // Reset connection state
  if (state.connected) {
    state.connected = false;
    updateConnectionUI('idle');
    els.btnSend.disabled = true;
  }

  // Load defaults for new provider if not present in saved state
  if (!state.formData[id]) {
    state.formData[id] = {
      endpointUrl: PROVIDERS[id].defaultEndpoint,
      modelId: PROVIDERS[id].defaultModel,
      temperature: 0.7,
      apiVersion: '2025-05-15-preview'
    };
  }

  renderWizard(id);
  saveState();
}

/* ═══════════════════════════════════════════════════════════
   DYNAMIC WIZARD RENDERER
   ═══════════════════════════════════════════════════════════ */
function renderWizard(id) {
  const p = PROVIDERS[id];
  let html = '';
  let stepIndex = 2; // Step 1 is "Choose Provider"

  p.wizard.forEach(step => {
    const normalFields = step.fields.filter(f => !f.advanced);
    const advFields    = step.fields.filter(f => f.advanced);

    let stepHtml = `
      <div class="wizard-step">
        <div class="wizard-step-header">
          <div class="step-number">${stepIndex++}</div>
          <div class="step-title">${step.title}</div>
        </div>
        <div class="step-desc">${step.desc}</div>
    `;

    stepHtml += renderFields(normalFields, id);

    if (advFields.length > 0) {
      stepHtml += `
        <details style="margin-top:8px;">
          <summary style="font-size:11px;color:var(--text-secondary);cursor:pointer;font-weight:600;">Advanced Settings</summary>
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:10px;">
            ${renderFields(advFields, id)}
          </div>
        </details>
      `;
    }

    stepHtml += `</div>`;
    html += stepHtml;
  });

  // Final Connection Step
  html += `
    <div class="wizard-step" style="border-color:var(--border-accent); background:rgba(59,130,246,0.05);">
      <div class="wizard-step-header">
        <div class="step-number" style="background:var(--accent-emerald);">${stepIndex}</div>
        <div class="step-title">Connect & Verify</div>
      </div>
      <button class="btn-connect" id="btnConnect">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        Verify Connection
      </button>
    </div>
  `;

  els.setupWizard.innerHTML = html;
  els.topbarSubtitle.textContent = `${p.name} · Complete setup to begin`;
  els.providerBadge.textContent = p.name;
  els.poweredBy.innerHTML = `Powered by <strong>${p.name}</strong>`;

  attachWizardListeners(id);
}

function renderFields(fields, providerId) {
  const p = PROVIDERS[providerId];
  const data = state.formData[providerId] || {};

  return fields.map(f => {
    let val = data[f.id] !== undefined ? data[f.id] : (f.val !== undefined ? f.val : '');
    if (f.id === 'endpointUrl' && !val) val = p.defaultEndpoint;
    if (f.id === 'modelId' && !val && f.type === 'select') val = p.defaultModel;

    let inputHtml = '';
    if (f.type === 'select') {
      const opts = f.options ? f.options : p.models.map(m => ({val:m, text:m}));
      const optHtml = opts.map(o => `<option value="${o.val}" ${val===o.val?'selected':''}>${o.text}</option>`).join('');
      inputHtml = `<select id="field_${f.id}">${optHtml}</select>`;
    } else if (f.type === 'range') {
      inputHtml = `
        <div class="param-group">
          <div class="param-header"><span>${f.label}</span><span class="param-value" id="val_${f.id}">${val}</span></div>
          <input type="range" class="slider" id="field_${f.id}" min="${f.min}" max="${f.max}" step="${f.step}" value="${val}">
        </div>`;
    } else if (f.type === 'textarea') {
      inputHtml = `<textarea id="field_${f.id}" placeholder="${f.placeholder||''}" rows="2">${val}</textarea>`;
    } else if (f.type === 'password') {
      inputHtml = `
        <div class="input-wrapper">
          <input type="password" id="field_${f.id}" placeholder="${f.placeholder||''}" value="${val}">
          <button type="button" class="toggle-password" onclick="togglePass('field_${f.id}')">👁️</button>
        </div>`;
    } else {
      inputHtml = `<input type="text" id="field_${f.id}" placeholder="${f.placeholder||''}" value="${val}">`;
    }

    if (f.type === 'range') return inputHtml;
    return `<div class="form-group"><label>${f.label}</label>${inputHtml}</div>`;
  }).join('');
}

window.togglePass = (id) => {
  const el = $(id);
  el.type = el.type === 'password' ? 'text' : 'password';
};

function attachWizardListeners(providerId) {
  const p = PROVIDERS[providerId];
  
  // Track input changes to save state
  p.wizard.forEach(step => {
    step.fields.forEach(f => {
      const el = $(`field_${f.id}`);
      if (!el) return;
      el.addEventListener('input', (e) => {
        if (!state.formData[providerId]) state.formData[providerId] = {};
        state.formData[providerId][f.id] = e.target.value;
        if (f.type === 'range' && $(`val_${f.id}`)) $(`val_${f.id}`).textContent = e.target.value;
        saveState();
      });
    });
  });

  $('btnConnect').addEventListener('click', handleConnect);
}

/* ═══════════════════════════════════════════════════════════
   STATE MANAGEMENT
   ═══════════════════════════════════════════════════════════ */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      providerId: state.providerId,
      formData: state.formData
    }));
  } catch(e) {}
}

function loadState() {
  try {
    const c = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (c.providerId && PROVIDERS[c.providerId]) state.providerId = c.providerId;
    if (c.formData) state.formData = c.formData;
  } catch(e) {}
}

/* ═══════════════════════════════════════════════════════════
   PROXY REQUEST BUILDER
   ═══════════════════════════════════════════════════════════ */
function buildProxyPayload(messages) {
  const p    = state.providerId;
  const data = state.formData[p] || {};
  const prov = PROVIDERS[p];
  
  const apiKey    = (data.apiKey || '').trim();
  const model     = (data.modelId || prov.defaultModel || '').trim();
  const sysPrompt = (data.systemPrompt || '').trim();
  const temp      = parseFloat(data.temperature || 0.7);
  const targetUrl = (data.endpointUrl || prov.defaultEndpoint || '').trim();

  let bodyData = {}, headers = { 'Content-Type': 'application/json' };

  if (['openai', 'azure-openai', 'groq'].includes(p)) {
    const msgs = sysPrompt ? [{ role: 'system', content: sysPrompt }, ...messages] : messages;
    bodyData = { model, messages: msgs, temperature: temp, stream: false };
    if (p === 'azure-openai') headers['api-key'] = apiKey;
    else headers['Authorization'] = `Bearer ${apiKey}`;
  } 
  else if (p === 'gemini') {
    const url = targetUrl.replace('{model}', model) + `?key=${encodeURIComponent(apiKey)}`;
    const contents = messages.map(m => ({ role: m.role==='assistant'?'model':'user', parts: [{text: m.content}] }));
    bodyData = { contents, generationConfig: { temperature: temp } };
    if (sysPrompt) bodyData.systemInstruction = { parts: [{text: sysPrompt}] };
    return { endpoint: PROXY_URL, headers: {'Content-Type':'application/json'}, body: { targetUrl: url, headers, body: bodyData } };
  }
  else if (p === 'ollama') {
    const msgs = sysPrompt ? [{ role: 'system', content: sysPrompt }, ...messages] : messages;
    bodyData = { model, messages: msgs, stream: false, options: { temperature: temp } };
  }
  else if (p === 'foundry') {
    const base = targetUrl.replace(/\/+$/, '');
    const url = `${base.endsWith('/openai')?base:base+'/openai'}/responses?api-version=${data.apiVersion||'2025-05-15-preview'}`;
    headers = data.authMode === 'bearer' ? { 'Authorization': `Bearer ${apiKey}` } : { 'api-key': apiKey };
    
    const inputItems = messages.map(m => ({ type: 'message', role: m.role, content: [{ type: 'input_text', text: m.content }] }));
    bodyData = data.agentName ? { input: inputItems, agent_reference: { type: 'agent_reference', name: data.agentName } } : { input: inputItems, temperature: temp, stream: false };
    if (sysPrompt) bodyData.instructions = sysPrompt;
    return { endpoint: PROXY_URL, headers: {'Content-Type':'application/json'}, body: { targetUrl: url, headers, body: bodyData } };
  }

  return { endpoint: PROXY_URL, headers: {'Content-Type':'application/json'}, body: { targetUrl, headers, body: bodyData } };
}

/* ═══════════════════════════════════════════════════════════
   CONNECTION & MESSAGING
   ═══════════════════════════════════════════════════════════ */
async function handleConnect() {
  const btn = $('btnConnect');
  btn.innerHTML = 'Verifying...'; btn.disabled = true;
  updateConnectionUI('connecting');

  try {
    const payload = buildProxyPayload([{role:'user', content:'hi'}]);
    // Limit tokens for test request
    if (payload.body.body) {
      if (payload.body.body.generationConfig) payload.body.body.generationConfig.maxOutputTokens = 1;
      else if (!payload.body.body.agent_reference) payload.body.body.max_tokens = 1;
    }

    const res = await fetch(payload.endpoint, { method:'POST', headers:payload.headers, body:JSON.stringify(payload.body) });
    
    if (res.ok || res.status === 400) { // 400 means hit azure successfully but schema failed
      state.connected = true;
      updateConnectionUI('connected');
      els.btnSend.disabled = false;
      const m = state.formData[state.providerId]?.modelId;
      els.topbarSubtitle.textContent = `${PROVIDERS[state.providerId].name}${m ? ' · '+m : ''}`;
      showToast('Connected successfully!', 'success');
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    updateConnectionUI('error');
    showToast('Connection failed: ' + err.message, 'error');
  } finally {
    btn.innerHTML = 'Verify Connection'; btn.disabled = false;
  }
}

function updateConnectionUI(s) {
  els.connectionStatus.className = `connection-status ${s==='idle'?'':s}`;
  const labels = { connected: 'Ready to Chat', error: 'Connection Error', connecting: 'Connecting…', idle: 'Not Connected' };
  els.statusText.textContent = labels[s];
}

els.btnSend.addEventListener('click', sendMessage);
els.userInput.addEventListener('keydown', e => { if(e.key==='Enter' && !e.shiftKey){e.preventDefault();sendMessage();} });
els.userInput.addEventListener('input', () => {
  els.userInput.style.height='auto'; els.userInput.style.height = Math.min(els.userInput.scrollHeight,200)+'px';
  const len = els.userInput.value.length;
  els.charCount.textContent = `${len} / 32000`;
  els.btnSend.disabled = !(state.connected && els.userInput.value.trim());
});

async function sendMessage() {
  const text = els.userInput.value.trim();
  if (!text || state.loading || !state.connected) return;

  els.welcomeState.style.display = 'none';
  const userMsg = { role: 'user', content: text };
  state.messages.push(userMsg); appendMessage(userMsg);
  
  els.userInput.value = ''; els.btnSend.disabled = true; state.loading = true;
  const thinking = showThinking();

  try {
    const payload = buildProxyPayload(state.messages);
    const res = await fetch(payload.endpoint, { method:'POST', headers:payload.headers, body:JSON.stringify(payload.body) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    const content = parseResponse(data, state.providerId);
    
    const astMsg = { role: 'assistant', content };
    state.messages.push(astMsg); appendMessage(astMsg);
    
  } catch (err) {
    appendMessage({role:'assistant', content:`**Error:** ${err.message}`});
  } finally {
    thinking.remove(); state.loading = false; els.btnSend.disabled = false; els.userInput.focus();
    els.chatContainer.scrollTo({ top: els.chatContainer.scrollHeight, behavior: 'smooth' });
  }
}

function parseResponse(data, providerId) {
  try {
    if (['openai','azure-openai','groq'].includes(providerId)) return data.choices[0]?.message?.content || '';
    if (providerId === 'gemini') return data.candidates[0]?.content?.parts.map(p=>p.text).join('') || '';
    if (providerId === 'ollama') return data.message?.content || '';
    if (providerId === 'foundry') {
      if (Array.isArray(data.output)) {
        const msg = data.output.find(o=>o.type==='message'&&o.role==='assistant');
        if (msg) return Array.isArray(msg.content) ? msg.content.filter(c=>c.type==='output_text'||c.type==='text').map(c=>c.text||c.output_text).join('') : msg.content;
      }
      return data.choices?.[0]?.message?.content || JSON.stringify(data);
    }
  } catch(e) { return JSON.stringify(data); }
}

function appendMessage(msg) {
  const div = document.createElement('div');
  div.className = `message ${msg.role}`;
  div.innerHTML = `
    <div class="message-avatar">${msg.role==='user'?'You':PROVIDERS[state.providerId].emoji}</div>
    <div class="message-body"><div class="message-bubble">${msg.content.replace(/\n/g,'<br>')}</div></div>
  `;
  els.messagesList.appendChild(div);
}

function showThinking() {
  const div = document.createElement('div'); div.className = 'thinking-indicator';
  div.innerHTML = `<div class="message-avatar">${PROVIDERS[state.providerId].emoji}</div><div class="thinking-dots"><span></span><span></span><span></span></div>`;
  els.messagesList.appendChild(div); els.chatContainer.scrollTo({ top: els.chatContainer.scrollHeight, behavior: 'smooth' });
  return div;
}

function showToast(msg, type='info') {
  els.toast.textContent = msg; els.toast.className = `toast ${type} show`;
  setTimeout(()=>els.toast.classList.remove('show'), 3000);
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR & EXAMPLES
   ═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.example-chip').forEach(b => {
  b.addEventListener('click', () => { els.userInput.value = b.dataset.query; els.btnSend.disabled = !state.connected; });
});
$('btnClearChat').addEventListener('click', () => {
  state.messages = []; els.messagesList.innerHTML = ''; els.welcomeState.style.display = 'flex';
});

// Start
init();
