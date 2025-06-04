// backend/src/api/agenda/controllers/agenda.ts

import { parseISO } from 'date-fns';
import { factories } from '@strapi/strapi';

interface AppointmentInput {
  start: string; // ISO-string, bijv. "2025-06-05T10:00:00.000Z"
  end: string;   // ISO-string, bijv. "2025-06-05T11:00:00.000Z"
}

export default factories.createCoreController('api::agenda.agenda', ({ strapi }) => ({
  // Dit is de extra “slimme voorstel”-actie
  async suggest(ctx) {
    try {
      const body = ctx.request.body as { appointments?: AppointmentInput[] };
      if (!body.appointments || !Array.isArray(body.appointments)) {
        return ctx.badRequest('Body moet een array "appointments" bevatten.');
      }

      // 1) Format de afspraken voor in het prompt
      const formattedAppointments = body.appointments
        .map((a) => {
          const start = parseISO(a.start);
          const end = parseISO(a.end);
          return `- ${start.toLocaleDateString('nl-NL')} ${start.toLocaleTimeString('nl-NL')} tot ${end.toLocaleTimeString('nl-NL')}`;
        })
        .join('\n');

      // 2) Bouw het prompt
      const prompt = `
Je bent een slimme agenda-assistent. Hieronder staan de huidige afspraken in de komende week:

${formattedAppointments}

Geef een lijst van 3 voorgestelde vrije blokken van 1 uur binnen de komende 7 dagen (maandag tot zondag).
- Formaat: "DD-MM-YYYY HH:00 - HH+1:00"
- Zorg dat de blokken niet overlappen met de bestaande afspraken.
- Sorteer op “meest wenselijk” (bijv. spreiding door de week).
- Geef precies 3 regels, één voorstel per regel.
      `.trim();

      // 3) Roep OpenAI aan (vervang door jouw werkende service)
      const completion = await strapi
        .plugin('openai')              // zorg dat je in Strapi-plugin “openai” hebt geregistreerd
        .service('openaiService')      // service‐naam in je Strapi-plugin
        .createChatCompletion({
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

      // 4) Parse AI-antwoord
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
          id:    startDate.toISOString(),
          title: 'Voorstel',
          start: startDate.toISOString(),
          end:   endDate.toISOString(),
          color: 'blue',
        };
      }).filter((s) => s !== null);

      // 5) Return de suggesties
      ctx.body = { data: suggestions };
    } catch (err) {
      console.error('Error in agenda.suggest:', err);
      ctx.internalServerError('Er is iets misgegaan in de AI-aanroep.');
    }
  }
}));
