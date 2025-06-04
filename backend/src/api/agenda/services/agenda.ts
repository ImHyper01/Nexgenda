// src/api/agenda/services/agenda.ts

import { parseISO } from 'date-fns';

interface AppointmentInput {
  start: string;
  end: string;
}

export default {
  async getSmartSuggestions(appointments: AppointmentInput[]) {
    // precies dezelfde logica als in controller.suggest
    const formattedAppointments = appointments
      .map((a) => {
        const start = parseISO(a.start);
        const end   = parseISO(a.end);
        return `- ${start.toLocaleDateString('nl-NL')} ${start.toLocaleTimeString('nl-NL')} tot ${end.toLocaleTimeString('nl-NL')}`;
      })
      .join('\n');

    const prompt = `
Je bent een slimme agenda‐assistent. Hieronder staan de huidige afspraken in de komende week:

${formattedAppointments}

Geef 3 voorstellen voor vrije blokken van 1 uur binnen de komende 7 dagen (maandag t/m zondag).
- Formaat per regel: "DD-MM-YYYY HH:00 - HH+1:00"
- De blokken mogen niet overlappen met de bestaande afspraken.
- Sorteer op “meest wenselijk” (bijv. spreiding door de week).
- Geef exact 3 regels, één voorstel per regel.
    `.trim();

    const { choices } = await strapi
      .plugin('openai')
      .service('openaiService')
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Je bent een agenda assistent.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

    const aiText = choices?.[0]?.message?.content;
    if (!aiText) {
      throw new Error('Geen respons van AI ontvangen.');
    }

    const lines = aiText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const suggestions = lines.slice(0, 3).map((line) => {
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

    return suggestions;
  }
};
