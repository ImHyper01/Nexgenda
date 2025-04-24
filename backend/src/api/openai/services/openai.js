'use strict';

import { post } from 'axios';

export async function getAnswer(question) {
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
}
