import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);
const usuario = JSON.parse(localStorage.getItem("usuario"));

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date()); // 👈 controla a data atual

  const converterEventos = (eventos) => {
    return eventos.map(evento => {
      const [ano, mes, dia] = evento.data.split("-").map(Number);
      const [horaInicio, minutoInicio] = evento.inicio.split(":").map(Number);
      const [horaFim, minutoFim] = evento.fim.split(":").map(Number);

      return {
        title: evento.titulo,
        start: new Date(ano, mes - 1, dia, horaInicio, minutoInicio),
        end: new Date(ano, mes - 1, dia, horaFim, minutoFim),
      };
    });
  };

  useEffect(() => {
    fetch(`http://localhost:8080/agendamento/calendario/${Number(usuario.id)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro na resposta da API: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const eventosConvertidos = converterEventos(data);
        setEvents(eventosConvertidos);
      })
      .catch((err) => {
        console.error("Erro ao buscar eventos:", err);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", padding: 20 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day", "agenda"]}
        view={view}
        onView={(novaView) => setView(novaView)}
        date={date}                            // 👈 controla a data atual
        onNavigate={(novaData) => setDate(novaData)} // 👈 navegação funciona!
        style={{ height: "100%" }}
        onSelectEvent={(event) =>
          alert(`Evento: ${event.title}\nInício: ${event.start.toLocaleString()}\nFim: ${event.end.toLocaleString()}`)
        }
      />
    </div>
  );
};

export default Calendario;

// import React, { useState, useEffect } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "moment/locale/pt-br"; // Adicionado para tradução
// import "react-big-calendar/lib/css/react-big-calendar.css";

// moment.locale("pt-br"); // Define o idioma global
// const localizer = momentLocalizer(moment);
// const usuario = JSON.parse(localStorage.getItem("usuario"));
// const Calendario = () => {
//   const [events, setEvents] = useState([]);
//   const [view, setView] = useState("month");
//    const [date, setDate] = useState(new Date());
//   // Converte os dados da API para o formato do calendário
//   const converterEventos = (eventos) => {
//     return eventos.map(evento => {
//       const [ano, mes, dia] = evento.data.split("-").map(Number);
//       const [horaInicio, minutoInicio] = evento.inicio.split(":").map(Number);
//       const [horaFim, minutoFim] = evento.fim.split(":").map(Number);

//       return {
//         title: evento.titulo,
//         start: new Date(ano, mes - 1, dia, horaInicio, minutoInicio),
//         end: new Date(ano, mes - 1, dia, horaFim, minutoFim),
//       };
//     });
//   };

//   useEffect(() => {
//     fetch(`http://localhost:8080/agendamento/calendario/${Number(usuario.id)}`)
//       .then((res) => {
//         if (!res.ok) throw new Error(`Erro na resposta da API: ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         const eventosConvertidos = converterEventos(data);
//         setEvents(eventosConvertidos);
//       })
//       .catch((err) => {
//         console.error("Erro ao buscar eventos:", err);
//       });
//   }, []);

//   return (
//      <div style={{ width: "100%", height: "100vh", padding: 20 }}>
//     <Calendar
//       localizer={localizer}
//       events={events}
//       startAccessor="start"
//       endAccessor="end"
//       views={["month", "week", "day", "agenda"]}
//       view={view}
//       onView={(novaView) => setView(novaView)}
//       defaultDate={new Date()}
//       style={{ height: "100%" }}  // Faz o calendário ocupar toda a altura do container
//       onSelectEvent={(event) =>
//         alert(`Evento: ${event.title}\nInício: ${event.start.toLocaleString()}\nFim: ${event.end.toLocaleString()}`)
//       }
//     />
//   </div>
//   );
// };

// export default Calendario;
