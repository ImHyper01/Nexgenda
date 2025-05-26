// src/api/chat/services/chat.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const systemPrompt = `Geef antwoord op alles behalven recepten`;

export default {
  async askSoul(prompt: string) {
    const res = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 600,
    });
    return res.choices[0].message.content.trim();
  },
};
