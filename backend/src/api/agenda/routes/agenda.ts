// src/api/agenda/routes/agenda.ts

export default [
    // ————————— Strapi’s standaard CRUD routes voor /api/agendas —————————
    {
      method: "GET",
      path: "/api/agendas",
      handler: "api::agenda.agenda.find",
      config: { auth: false }
    },
    {
      method: "GET",
      path: "/api/agendas/:id",
      handler: "api::agenda.agenda.findOne",
      config: { auth: false }
    },
    {
      method: "POST",
      path: "/api/agendas",
      handler: "api::agenda.agenda.create",
      config: { auth: { scope: ["authenticated"] } }
    },
    {
      method: "PUT",
      path: "/api/agendas/:id",
      handler: "api::agenda.agenda.update",
      config: { auth: { scope: ["authenticated"] } }
    },
    {
      method: "DELETE",
      path: "/api/agendas/:id",
      handler: "api::agenda.agenda.delete",
      config: { auth: { scope: ["authenticated"] } }
    },
  
    // —————— JOUW extra “slimme-voorstel” endpoint ——————
    {
        method: 'POST',
        path: '/agenda/slimme-voorstel',
        handler: 'api::agenda.agenda.suggest', // ← precies deze string
        config: {
          auth: { scope: ['authenticated'] },   // enkel ingelogde gebruikers mogen dit oproepen
          pluginOptions: {
            'users-permissions': {
              enabled: true                     // ← zorg dat deze route onder “Agenda → Suggest” verschijnt in Roles
            }
          }
        }
      }
  ];
  