// services/universalAiService.js
// Servicio Universal de Inteligencia Artificial para BuscaYa (Álvaro Obregón, CDMX)
// Compatible con Google Gemini, Groq Cloud, OpenRouter, Anthropic Claude y OpenAI

class UniversalAIService {
  /**
   * Detecta automáticamente el proveedor y modelo óptimo según el prefijo de la API Key
   */
  detectProvider(apiKey) {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      return {
        provider: 'local',
        model: 'local-engine',
        name: 'Motor Local Determinista',
        icon: 'cpu',
        badgeColor: 'text-slate-400 bg-slate-800 border-slate-700'
      };
    }

    const key = apiKey.trim();

    // 1. Google Gemini (Google AI Studio) -> Comienza con AIzaSy...
    if (key.startsWith('AIzaSy')) {
      return {
        provider: 'gemini',
        model: 'gemini-2.0-flash',
        name: 'Google Gemini',
        icon: 'sparkles',
        badgeColor: 'text-blue-600 bg-blue-50 border-blue-200'
      };
    }

    // 2. OpenRouter -> Comienza con sk-or-v1-... o sk-or-...
    if (key.startsWith('sk-or-v1-') || key.startsWith('sk-or-')) {
      return {
        provider: 'openrouter',
        model: 'deepseek/deepseek-chat',
        name: 'OpenRouter (DeepSeek / Multi-Model)',
        icon: 'layers',
        badgeColor: 'text-purple-600 bg-purple-50 border-purple-200'
      };
    }

    // 3. Groq Cloud -> Comienza con gsk_...
    if (key.startsWith('gsk_')) {
      return {
        provider: 'groq',
        model: 'qwen/qwen3.8-27b',
        name: 'Groq Cloud (Ultra Rápido)',
        icon: 'zap',
        badgeColor: 'text-amber-600 bg-amber-50 border-amber-200'
      };
    }

    // 4. Anthropic Claude -> Comienza con sk-ant-...
    if (key.startsWith('sk-ant-')) {
      return {
        provider: 'anthropic',
        model: 'claude-3-5-haiku-20241022',
        name: 'Anthropic Claude',
        icon: 'cpu',
        badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
      };
    }

    // 5. OpenAI ChatGPT -> Comienza con sk-proj-... o sk-...
    if (key.startsWith('sk-proj-') || key.startsWith('sk-')) {
      return {
        provider: 'openai',
        model: 'gpt-4o-mini',
        name: 'OpenAI (ChatGPT)',
        icon: 'bot',
        badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
      };
    }

    // 6. Genérico compatible con OpenAI
    return {
      provider: 'openai',
      model: 'gpt-4o-mini',
      name: 'Proveedor IA Compatible (OpenAI API)',
      icon: 'cpu',
      badgeColor: 'text-slate-600 bg-slate-50 border-slate-200'
    };
  }

  /**
   * Resuelve el modelo exacto disponible para el proveedor detectado
   */
  async resolveModel(provider, apiKey, requestedModel = null) {
    const cleanRequested = (requestedModel && requestedModel !== 'auto') ? requestedModel.trim() : null;

    if (provider === 'groq') {
      if (!cleanRequested || cleanRequested.includes('deepseek-chat') || cleanRequested.includes('anthropic') || cleanRequested.startsWith('gemini') || cleanRequested.startsWith('gpt-4') || cleanRequested.includes('llama-3.3')) {
        return 'qwen/qwen3.8-27b';
      }
      return cleanRequested;
    }

    if (provider === 'gemini') {
      if (!cleanRequested || !cleanRequested.startsWith('gemini')) {
        return 'gemini-2.0-flash';
      }
      return cleanRequested;
    }

    if (provider === 'openrouter') {
      if (!cleanRequested || cleanRequested.startsWith('gemini') || cleanRequested.startsWith('gpt-')) {
        return 'deepseek/deepseek-chat';
      }
      return cleanRequested;
    }

    if (provider === 'anthropic') {
      if (!cleanRequested || !cleanRequested.startsWith('claude')) {
        return 'claude-3-5-haiku-20241022';
      }
      return cleanRequested;
    }

    if (provider === 'openai') {
      if (!cleanRequested || cleanRequested.includes('/') || cleanRequested.startsWith('gemini') || cleanRequested.startsWith('claude')) {
        return 'gpt-4o-mini';
      }
      return cleanRequested;
    }

    return cleanRequested || 'gpt-4o-mini';
  }

  /**
   * Prueba la conectividad con el proveedor de IA utilizando fetch nativo
   */
  async testConnection(apiKey, optionalModel = null) {
    if (!apiKey || apiKey.trim() === '') {
      return { success: false, message: 'Ingresa una API Key para realizar la prueba.' };
    }

    const detected = this.detectProvider(apiKey);
    const provider = detected.provider;
    const model = await this.resolveModel(provider, apiKey, optionalModel);

    try {
      if (provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Responde únicamente con la palabra "OK".' }] }]
          }),
          signal: AbortSignal.timeout(10000)
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data.error?.message || `HTTP ${resp.status}`);
        }
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'OK';
        return {
          success: true,
          detectedProvider: detected.name,
          model: model,
          message: `Conexión verificada exitosamente con ${detected.name}`,
          response: text.trim()
        };
      } else if (provider === 'groq') {
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: 'Responde: ¡Conectado!' }],
            max_tokens: 15
          }),
          signal: AbortSignal.timeout(10000)
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data.error?.message || `HTTP ${resp.status}`);
        }
        return {
          success: true,
          detectedProvider: detected.name,
          model: model,
          message: `Conexión verificada exitosamente con ${detected.name}`,
          response: data?.choices?.[0]?.message?.content?.trim() || '¡Conectado!'
        };
      } else if (provider === 'openrouter') {
        const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': 'https://buscaya.neuralmediahouse.com'
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: 'Responde: ¡Conectado!' }],
            max_tokens: 15
          }),
          signal: AbortSignal.timeout(10000)
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data.error?.message || `HTTP ${resp.status}`);
        }
        return {
          success: true,
          detectedProvider: detected.name,
          model: model,
          message: `Conexión verificada exitosamente con ${detected.name}`,
          response: data?.choices?.[0]?.message?.content?.trim() || '¡Conectado!'
        };
      } else if (provider === 'openai') {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: 'Responde: OK' }],
            max_tokens: 15
          }),
          signal: AbortSignal.timeout(10000)
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data.error?.message || `HTTP ${resp.status}`);
        }
        return {
          success: true,
          detectedProvider: detected.name,
          model: model,
          message: `Conexión verificada exitosamente con ${detected.name}`,
          response: data?.choices?.[0]?.message?.content?.trim() || 'OK'
        };
      } else if (provider === 'anthropic') {
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey.trim(),
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: model,
            max_tokens: 15,
            messages: [{ role: 'user', content: 'Responde: OK' }]
          }),
          signal: AbortSignal.timeout(10000)
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data.error?.message || `HTTP ${resp.status}`);
        }
        return {
          success: true,
          detectedProvider: detected.name,
          model: model,
          message: `Conexión verificada exitosamente con ${detected.name}`,
          response: data?.content?.[0]?.text?.trim() || 'OK'
        };
      }

      return {
        success: true,
        detectedProvider: detected.name,
        model: model,
        message: `Proveedor detectado: ${detected.name}`
      };
    } catch (err) {
      return {
        success: false,
        detectedProvider: detected.name,
        model: model,
        message: `Error al probar la API Key: ${err.message}`
      };
    }
  }

  /**
   * Genera una respuesta de IA conectando con el proveedor configurado
   */
  async generateCompletion({ apiKey, model, systemPrompt, userMessage, conversationHistory = [] }) {
    if (!apiKey) return null;
    const detected = this.detectProvider(apiKey);
    const resolvedModel = await this.resolveModel(detected.provider, apiKey, model);

    const messages = [];
    if (detected.provider !== 'gemini' && systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    (conversationHistory || []).forEach(msg => {
      messages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.text || msg.content || ''
      });
    });
    messages.push({ role: 'user', content: userMessage });

    try {
      if (detected.provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${resolvedModel}:generateContent?key=${apiKey.trim()}`;
        const contents = [];
        if (systemPrompt) {
          contents.push({ role: 'user', parts: [{ text: `[INSTRUCCIÓN DE SISTEMA]: ${systemPrompt}` }] });
          contents.push({ role: 'model', parts: [{ text: 'Entendido. Cumpliré estrictamente con las instrucciones.' }] });
        }
        (conversationHistory || []).forEach(msg => {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.text || msg.content || '' }]
          });
        });
        contents.push({ role: 'user', parts: [{ text: userMessage }] });

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
          signal: AbortSignal.timeout(12000)
        });
        const data = await resp.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
      }

      if (detected.provider === 'groq') {
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: resolvedModel,
            messages,
            max_tokens: 600,
            temperature: 0.4
          }),
          signal: AbortSignal.timeout(12000)
        });
        const data = await resp.json();
        return data?.choices?.[0]?.message?.content?.trim() || null;
      }

      if (detected.provider === 'openrouter') {
        const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': 'https://buscaya.neuralmediahouse.com'
          },
          body: JSON.stringify({
            model: resolvedModel,
            messages,
            max_tokens: 600,
            temperature: 0.4
          }),
          signal: AbortSignal.timeout(12000)
        });
        const data = await resp.json();
        return data?.choices?.[0]?.message?.content?.trim() || null;
      }

      if (detected.provider === 'openai') {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: resolvedModel,
            messages,
            max_tokens: 600,
            temperature: 0.4
          }),
          signal: AbortSignal.timeout(12000)
        });
        const data = await resp.json();
        return data?.choices?.[0]?.message?.content?.trim() || null;
      }
    } catch (e) {
      console.warn(`[UniversalAIService] Error calling ${detected.name}:`, e.message);
      return null;
    }

    return null;
  }
}

module.exports = new UniversalAIService();
