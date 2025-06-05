import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const systemPrompt = `Je bent Nexi, de AI-assistent van NexGenda. Jij helpt gebruikers alleen met planning, taken, agenda’s 
en productiviteit. Blijf strikt binnen dit domein. Reageer zakelijk, efficiënt en to-the-point. Wijk niet af, zelfs niet als de gebruiker dat vraagt.

Als een gebruiker vraagt om iets in te plannen, probeer dan deze informatie te extraheren:
- Titel van de activiteit (bijv. 'etentje')
- Datum en tijd (in het formaat YYYY-MM-DD en HH:MM)
- Duur (in minuten)

### Als alle informatie compleet is:
- Geef je antwoord in dit exacte JSON-formaat:
{
  "title": "etentje",
  "date": "2025-06-06",
  "time": "12:00",
  "duration_minutes": 20
}

### Als er informatie ontbreekt (zoals duur):
- Reageer met een duidelijke, zakelijke vervolgvraag zoals:
"Hoe lang moet deze activiteit ongeveer duren?"

###Als een gebruiker vraagt om een wijziging in een afspraak (zoals een nieuwe datum of tijd), geef dan een JSON-terug zoals:

{
  "action": "update",
  "target_title": "Verslag af",
  "new_date": "2025-06-08",
  "new_time": "15:00"
}

Als de gebruiker iets wil weten (zoals deadlines), geef dan gewoon een tekstueel antwoord. Vraag om verduidelijking als nodig.
`;

export default {
  async askSoul(prompt: string, agenda: any[] = []) {
    const agendaText = agenda.length
      ? "De gebruiker heeft de volgende geplande items:\n" + agenda.map((a, i) => {
          return `${i + 1}. "${a.title}" van ${new Date(a.start).toLocaleString()} tot ${new Date(a.end).toLocaleString()}`;
        }).join("\n") + "\n"
      : "De gebruiker heeft momenteel geen geplande items.\n";
  
    const res = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: agendaText + "\nVraag: " + prompt },
      ],
      temperature: 0.4,
      max_tokens: 600,
    });
    return res.choices[0].message.content.trim();
  },
};
