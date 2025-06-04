// src/api/agenda/controllers/agenda.js

import { openai } from '../../../utils/openai';
import { parseISO } from 'date-fns';

export default {
  // Handler voor POST /api/agenda/slimme-voorstel
  async suggest(ctx) {
    try {
      const body = ctx.request.body;

      if (!body.appointments || !Array.isArray(body.appointments)) {
        return ctx.badRequest('Body moet een array "appointments" bevatten.');
      }

      // 1) Format alle binnenkomende afspraken
      const formattedAppointments = body.appointments
        .map((a) => {
          const start = parseISO(a.start);
          const end = parseISO(a.end);
          return `- ${start.toLocaleDateString('nl-NL')} ${start.toLocaleTimeString('nl-NL')} tot ${end.toLocaleTimeString('nl-NL')}`;
        })
        .join('\n');

      // 2) Bouw het prompt voor OpenAI
      const prompt = `
Je bent een slimme agenda-assistent. Hieronder staan de huidige afspraken in de komende week:

${formattedAppointments}

Geef een lijst van 3 voorgestelde vrije blokken van 1 uur binnen de komende 7 dagen (maandag tot zondag).
- Formaat: "DD-MM-YYYY HH:00 - HH+1:00"
- Zorg dat de blokken niet overlappen met de bestaande afspraken.
- Sorteer op “meest wenselijk” (bijv. spreiding door de week).
- Geef precies 3 regels, één voorstel per regel.
      `.trim();

      // 3) Roep OpenAI v4 API aan
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Je bent een agenda assistent.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const aiText = completion.choices?.[0]?.message?.content;
      if (!aiText) {
        return ctx.internalServerError('Geen respons van AI ontvangen.');
      }

      // 4) Parse de AI-uitvoer naar een array met objecten
      const lines = aiText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const suggestions = lines.slice(0, 3).map((line) => {
        // Verwacht: "DD-MM-YYYY HH:MM - HH:MM"
        const match = line.match(/(\d{2}-\d{2}-\d{4}) (\d{2}:\d{2}) - (\d{2}:\d{2})/);
        if (!match) return null;
        const [_, datePart, startTime, endTime] = match;
        const [day, month, year] = datePart.split('-').map(Number);
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const startDate = new Date(year, month - 1, day, startHour, startMin);
        const endDate = new Date(year, month - 1, day, endHour, endMin);

        return {
          id: startDate.toISOString(),
          title: 'Voorstel',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          color: 'blue',
        };
      }).filter((s) => s !== null);

      // 5) Return de suggesties naar de frontend
      ctx.body = { data: suggestions };
    } catch (err) {
      console.error('Error in agenda.suggest:', err);
      ctx.internalServerError('Er is iets misgegaan in de AI-aanroep.');
    }
  },
};
