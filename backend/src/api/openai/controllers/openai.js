'use strict';

import { getAnswer } from '../services/openai';

export async function ask(ctx) {
  const { question } = ctx.request.body;

  if (!question) {
    return ctx.badRequest('Vraag ontbreekt');
  }

  try {
    const answer = await getAnswer(question);
    ctx.send({ answer });
  } catch (error) {
    console.error('OpenAI Fout:', error);
    ctx.internalServerError('AI antwoord ophalen mislukt.');
  }
}  
