import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Popup from "./Popup.jsx";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/popup/calendarioPopupDetalhesUnico.css"

moment.locale("pt-br");
const localizer = momentLocalizer(moment);
const usuario = JSON.parse(localStorage.getItem("usuario"));

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  const [popupAberto, setPopupAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

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

  const messagesPT = {
    date: "Data",
    time: "Hora",
    event: "Evento",
    allDay: "Dia inteiro",
    week: "Semana",
    work_week: "Dias úteis",
    day: "Dia",
    month: "Mês",
    previous: "Anterior",
    next: "Próximo",
    yesterday: "Ontem",
    tomorrow: "Amanhã",
    today: "Hoje",
    agenda: "Agenda",
    noEventsInRange: "Nenhum evento neste período.",
    showMore: (total) => `+ ver mais (${total})`
  };

  const formats = {
    dayFormat: (date, culture, localizer) =>
      moment(date).format("dd DD/MM"), // exemplo: Seg 14/10
    weekdayFormat: (date, culture, localizer) =>
      moment(date).format("dddd"), // segunda, terça, etc.
    timeGutterFormat: (date, culture, localizer) =>
      moment(date).format("HH:mm"), // 24h: 13:00
    agendaTimeFormat: (date, culture, localizer) =>
      moment(date).format("HH:mm"),
    agendaDateFormat: (date, culture, localizer) =>
      moment(date).format("DD/MM (ddd)"),
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      `${moment(start).format("D MMMM")} – ${moment(end).format("D MMMM")}`,
    dayHeaderFormat: (date, culture, localizer) =>
      moment(date).format("dddd, D [de] MMMM"),
    monthHeaderFormat: (date, culture, localizer) =>
      moment(date).format("MMMM YYYY"),
  };


  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: "#9e9e9eff", // 🎨 Altere para a cor que quiser
      color: "white",
      borderRadius: "5px",
      border: "none",
      padding: "4px 8px",
      fontWeight: "500",
    };
    return {
      style,
    };
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
  }, [usuario]);

  return (
    <div style={{ width: "100%", height: "100vh", padding: 20 }} className="card">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day", "agenda"]}
        view={view}
        onView={(novaView) => setView(novaView)}
        date={date}
        onNavigate={(novaData) => setDate(novaData)}
        style={{ height: "100%" }}
        messages={messagesPT}
        formats={formats}
        onSelectEvent={(event) => {
          setEventoSelecionado(event);
          setPopupAberto(true);
        }}
        eventPropGetter={eventStyleGetter}
      />


      {/* Popup com detalhes do evento */}
      {popupAberto && eventoSelecionado && (
        <Popup>
          <div className="calendario_popup_detalhes_unico_evento_box">
            <h1 className="paragrafo-1">Detalhes</h1>
            <p><strong>Servico:</strong> {eventoSelecionado.title}</p>
            <p><strong>Início:</strong> {eventoSelecionado.start.toLocaleString()}</p>
            <p><strong>Fim:</strong> {eventoSelecionado.end.toLocaleString()}</p>
            <button className="btn-branco" onClick={() => setPopupAberto(false)}>Voltar</button>
          </div>
        </Popup>
      )}
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
