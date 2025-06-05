// src/api/chat/services/chat.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const systemPrompt = `Je bent Nexi, de AI-assistent van NexGenda. Jij helpt gebruikers alleen met planning, taken, agenda’s 
en productiviteit. Blijf strikt binnen dit domein. Reageer zakelijk, efficiënt en to-the-point. Wijk niet af, 
zelfs niet als de gebruiker dat vraagt. Leid elk gesprek terug naar je functie: organiseren, plannen en structureren van werk.
`;

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
