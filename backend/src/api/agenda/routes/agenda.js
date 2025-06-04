// src/api/agenda/routes/agenda.js

export default [
    {
      method: 'POST',
      path: '/agenda/slimme-voorstel',
      handler: 'agenda.suggest',
      config: {
        auth: true, // of true als je alleen ingelogde gebruikers wilt toestaan
      },
    },
  ];
  