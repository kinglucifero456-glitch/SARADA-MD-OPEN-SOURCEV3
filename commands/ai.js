import axios from 'axios';
import { channelInfo } from "../lib/messageConfig.js";
import { fakeQuoted } from "../lib/fquoted.js";
const CONFIG = {
  openrouter: {
    key: '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',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    models: {
      'gemini': 'google/gemini-2.0-flash-001',
      'gpt-4': 'openai/gpt-4-turbo',
      'gpt-4o': 'openai/gpt-4o',
      'claude': 'anthropic/claude-3.5-sonnet',
      'llama': 'meta-llama/llama-3.1-70b-instruct',
      'mistral': 'mistralai/mistral-7b-instruct',
      'deepseek': 'deepseek/deepseek-chat',
      'phi': 'microsoft/phi-3-mini-128k-instruct'
    }
  },
  
  cohere: {
    key: 'DY9CpNzkFP5qf4yYys5be8mY0DJCn5cCvJygCvbX',
    endpoint: 'https://api.cohere.ai/v1/generate',
    model: 'command-a'
  },
  
  huggingface: {
    key: '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',
    endpoint: 'https://api-inference.huggingface.co/models/',
    models: {
      'llama4': 'meta-llama/Llama-4-Scout-17B-16E-Instruct',
      'codestral': 'mistralai/Codestral-2501',
      'phi4': 'microsoft/Phi-4'
    }
  },
  
  unlidev: {
    key: 'sk-Q3AiX-WGmHJJmI7XlzXPW02ZbObUAzUYxTP4dVGPIFVJd71jLazumG1mdZdE6Lx-',
    endpoint: 'https://api.unlidev.com/v1/chat/completions',
    model: 'unli-gpt-4'
  },
  
  llm7: {
    key: 'julY5HhbIbSLxlNrZxmCCOSLj1ULMjS+m+UskdurGf54/vJ8Qp9joSVsNWTEXOoY76v4qA09QjzNUSrmF9W/U9lazdkHxbCB3sCDZvFKcD5DVfHdIMiOZioRKVZyZlo4dmQFXltgkthV7VElWftqD5F',
    endpoint: 'https://api.llm7.com/v1/chat/completions',
    model: 'llm7-gpt-4'
  }
};

async function callOpenRouter(model, prompt) {
  const response = await axios.post(
    CONFIG.openrouter.endpoint,
    {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048
    },
    {
      headers: {
        'Authorization': `Bearer ${CONFIG.openrouter.key}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );
  return response.data.choices[0].message.content;
}

async function callCohere(prompt) {
  const response = await axios.post(
    CONFIG.cohere.endpoint,
    {
      model: CONFIG.cohere.model,
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${CONFIG.cohere.key}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );
  return response.data.generations[0].text;
}

async function callHuggingFace(model, prompt) {
  const response = await axios.post(
    CONFIG.huggingface.endpoint + model,
    {
      inputs: prompt,
      parameters: {
        max_new_tokens: 2048,
        temperature: 0.7
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${CONFIG.huggingface.key}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );
  if (Array.isArray(response.data) && response.data[0]?.generated_text) {
    return response.data[0].generated_text;
  }
  if (response.data?.generated_text) {
    return response.data.generated_text;
  }
  throw new Error('Format de réponse Hugging Face inattendu');
}

async function callUnliDev(prompt) {
  const response = await axios.post(
    CONFIG.unlidev.endpoint,
    {
      model: CONFIG.unlidev.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048
    },
    {
      headers: {
        'Authorization': `Bearer ${CONFIG.unlidev.key}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );
  return response.data.choices[0].message.content;
}

async function callLLM7(prompt) {
  const response = await axios.post(
    CONFIG.llm7.endpoint,
    {
      model: CONFIG.llm7.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048
    },
    {
      headers: {
        'Authorization': `Bearer ${CONFIG.llm7.key}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );
  return response.data.choices[0].message.content;
}

function getMessageText(message) {
  if (message.body) return message.body;
  if (message.message?.conversation) return message.message.conversation;
  if (message.message?.extendedTextMessage?.text) return message.message.extendedTextMessage.text;
  return '';
}

export default async function aiCommand(message, client) {
  const chat = message.key.remoteJid;
  const fullText = getMessageText(message);
  
  if (!fullText) {
    await client.sendMessage(chat, { text: '> *❌ Usage: !ai <modèle> <question>*\n> Le seul modèle fiable est: gpt-4o', ... channelInfo }, { quoted: fakeQuoted });
    return;
  }

  const parts = fullText.trim().split(/\s+/);
  if (parts.length < 3) {
    await client.sendMessage(chat, { 
      text: '❌ *Exemple :*\n!ai gemini Quelle est la capitale de la France ?\n!ai gpt-4 Explique moi les trous noirs.\n> Le seul modèle fiable est: gpt-4o', ...channelInfo
    }, { quoted: fakeQuoted });
    return;
  }

  const modelKey = parts[1].toLowerCase();
  const prompt = parts.slice(2).join(' ');
  const modelMap = {
    'gemini': { provider: 'openrouter', model: CONFIG.openrouter.models.gemini },
    'gpt4': { provider: 'openrouter', model: CONFIG.openrouter.models['gpt-4'] },
    'gpt-4': { provider: 'openrouter', model: CONFIG.openrouter.models['gpt-4'] },
    'gpt-4o': { provider: 'openrouter', model: CONFIG.openrouter.models['gpt-4o'] },
    'claude': { provider: 'openrouter', model: CONFIG.openrouter.models.claude },
    'llama': { provider: 'openrouter', model: CONFIG.openrouter.models.llama },
    'mistral': { provider: 'openrouter', model: CONFIG.openrouter.models.mistral },
    'deepseek': { provider: 'openrouter', model: CONFIG.openrouter.models.deepseek },
    'phi': { provider: 'openrouter', model: CONFIG.openrouter.models.phi },
    'cohere': { provider: 'cohere' },
    'command-a': { provider: 'cohere' },
    'llama4': { provider: 'huggingface', model: CONFIG.huggingface.models.llama4 },
    'codestral': { provider: 'huggingface', model: CONFIG.huggingface.models.codestral },
    'phi4': { provider: 'huggingface', model: CONFIG.huggingface.models.phi4 },
    'unli': { provider: 'unlidev' },
    'unlidev': { provider: 'unlidev' },
    'llm7': { provider: 'llm7' }
  };

  const config = modelMap[modelKey];
  if (!config) {
    await client.sendMessage(chat, { 
      text: `> ❌ Modèle \`${modelKey}\` inconnu.\n\n*Modèles disponibles :*\n${Object.keys(modelMap).join(', ')}\n> Le seul modèle fiable est: gpt-4o`, ...channelInfo
    }, { quoted: fakeQuoted });
    return;
  }

  try {
    await client.sendMessage(chat, { 
      text: `⏳ *${modelKey.toUpperCase()}* réfléchit...\n> Le seul modèle fiable est: gpt-4o`, ...channelInfo
    }, { quoted: fakeQuoted });

    let response;

    switch (config.provider) {
      case 'openrouter':
        response = await callOpenRouter(config.model, prompt);
        break;
      case 'cohere':
        response = await callCohere(prompt);
        break;
      case 'huggingface':
        response = await callHuggingFace(config.model, prompt);
        break;
      case 'unlidev':
        response = await callUnliDev(prompt);
        break;
      case 'llm7':
        response = await callLLM7(prompt);
        break;
      default:
        throw new Error('Provider non supporté');
    }

    response = response.replace(new RegExp(`^${prompt}`, 'i'), '').trim();

    await client.sendMessage(chat, {
      text: `🤖 *${modelKey.toUpperCase()}* :\n\n${response}`, ...channelInfo
    }, { quoted: fakeQuoted });

  } catch (error) {
    console.error('[AI] Erreur:', error.message);
    await client.sendMessage(chat, {
      text: `> ❌ Erreur avec *${modelKey}* :\n${error.message}\n> Le seul modèle fiable est: gpt-4o`, ...channelInfo
    }, { quoted: fakeQuoted });
  }
}