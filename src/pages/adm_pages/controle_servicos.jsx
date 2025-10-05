import { useEffect } from "react";
import MenuDash from "../../components/MenuDash";
import ControleMensal from "../../components/NavControleMensal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Registrar módulos do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Controle_servicos() {
  // Mock dos dados (depois você pode substituir por API/backend)
  const diasMes = Array.from({ length: 31 }, (_, i) =>
    `${(i + 1).toString().padStart(2, "0")}/01`
  );

  const mesAtual = [
    250, 280, 320, 350, 380, 400, 370, 330, 340, 360, 470, 480, 450, 430, 390,
    410, 600, 620, 590, 570, 530, 510, 500, 480, 450, 400, 420, 550, 600, 700,
    750,
  ];

  const mesAnterior = [
    200, 350, 400, 450, 500, 520, 510, 530, 550, 500, 520, 560, 540, 530, 520,
    580, 600, 610, 590, 570, 550, 540, 500, 490, 460, 420, 580, 620, 700, 800,
    null,
  ];

  const atendimentosData = {
    labels: diasMes,
    datasets: [
      {
        label: "Mês selecionado",
        data: mesAtual,
        borderColor: "black",
        backgroundColor: "#211F1E",
        fill: false,
        pointBackgroundColor: "black",
        tension: 0.3,
      },
      {
        label: "Mês anterior",
        data: mesAnterior,
        borderColor: "lightgray",
        backgroundColor: "lightgray",
        fill: false,
        pointBackgroundColor: "lightgray",
        tension: 0.3,
      },
    ],
  };

  const atendimentosOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dia do mês",
        },
        ticks: {
          maxRotation: 30,
          minRotation: 30,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Número de atendimentos",
        },
      },
    },
  };

  const servicosData = {
    labels: ["Serviço A", "Serviço B", "Serviço C", "Serviço D"],
    datasets: [
      {
        label: "Mês selecionado",
        data: [80, 75, 70, 65],
        backgroundColor: "black",
      },
      {
        label: "Mês anterior",
        data: [95, 90, 88, 92],
        backgroundColor: "lightgray",
      },
    ],
  };

  const servicosOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantidade",
        },
      },
    },
  };

  return (
    <MenuDash>
     
        {/* Título + Select */}
        <div className="section_controle_servico_title">
          <p className="titulo-1">Mês Selecionado</p>
          <select className="paragrafo-1 select semibold" name="mes" id="mes_select">
            <option value="fev">Fevereiro</option>
          </select>
        </div>

        {/* Mini Nav */}
       <ControleMensal />

        {/* KPIs */}
        <div className="section_controle_servico_kpis_pai">
          <div className="section_controle_servico_kpis card">
            <p className="paragrafo-2 italic">Total de Atendimentos</p>
            <div className="section_controle_servico_kpis_card_column">
              <p className="paragrafo-1 semibold">110</p>
              <p className="paragrafo-2 section_controle_servico_kpis_card_value">+2,5%</p>
            </div>
          </div>

          <div className="section_controle_servico_kpis card">
            <p className="paragrafo-2 italic">Atendimentos Cancelados</p>
            <div className="section_controle_servico_kpis_card_column">
              <p className="paragrafo-1 semibold">75</p>
              <p
                className="paragrafo-2 section_controle_servico_kpis_card_value"
                style={{ backgroundColor: "var(--vermelho)" }}
              >
                +1%
              </p>
            </div>
          </div>

          <div className="section_controle_servico_kpis card">
            <p className="paragrafo-2 italic">Clientes Cadastrados</p>
            <div className="section_controle_servico_kpis_card_column">
              <p className="paragrafo-1 semibold">2</p>
              <p className="paragrafo-2 section_controle_servico_kpis_card_value">+21%</p>
            </div>
          </div>

          <div className="section_controle_servico_kpis card">
            <p className="paragrafo-2 italic">Faturamento Total</p>
            <div className="section_controle_servico_kpis_card_column">
              <p className="paragrafo-1 semibold">R$10.000,00</p>
              <p className="paragrafo-2 section_controle_servico_kpis_card_value">+5%</p>
            </div>
          </div>
        </div>

        {/* Gráfico de Atendimentos por Dia */}
        <div className="section_controle_servico_grafico card">
          <p className="paragrafo-2 semibold">Atendimentos por Dia</p>
          <Line data={atendimentosData} options={atendimentosOptions} />
        </div>

        {/* Linha com gráfico e análise IA */}
        <div className="section_controle_servico_line2">
          <div className="section_controle_servico_column_pai card">
            <p className="paragrafo-2 semibold">Atendimentos por Serviço</p>
            <Bar data={servicosData} options={servicosOptions} />
          </div>

          <div className="section_controle_servico_column_pai card" style={{ gap: "16px" }}>
            <p className="paragrafo-2 semibold" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="../../assets/svg/icon_ia.svg" alt="icon-ia" />
              Análise de Desempenho
            </p>
            <p className="paragrafo-2">
              Análise gerada por inteligência artificial generativa.  
              Aqui você pode integrar futuramente uma API que explique os dados automaticamente.
            </p>
          </div>
        </div>
      
    </MenuDash>
  );
}

// <!DOCTYPE html>
// <html lang="pt-br">

// <head> <!-- UTILIZAR ESSSA HEAD COMO PADRAO PARA AS OUTRAS TELAS -->
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <link rel="stylesheet" href="../../css/main.css" />
//   <script src="../../js/utils/utils_cliente_pages.js"></script>
//   <script src="../../js/api/cliente/cliente.js"></script>
//   <link rel="shortcut icon" href="../../assets/svg/logo_rosa.svg" type="image/x-icon" />
//   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

//   <title>Salon Time | Controle Mensal</title>
// </head>

// <body>
//   <div class="dash_section_pai">
//     <!-- COMPONENTE - NAVBAR LATERAL -->
//     <div class="dash_navbar_pai">
//       <div class="dash_navbar_filho">
//         <img src="../../assets/svg/logo_black.svg" alt="icone" style="max-width: 169px;">
//         <p class="paragrafo-e bold">Bem vinda Marina!</p>
//         <div class="dash_navbar_column">
//           <button class="btn-navbar" onclick="navegar('./calendario_visao_geral.html')"><img style="max-width: 24px;"
//               src="../../assets/svg/nav_dash/icon_house_outline.svg" alt="">Calendário</button>
//           <button class="btn-navbar" onclick="navegar('./servicos_servicos.html')"><img style="max-width: 24px;"
//               src="../../assets/svg/nav_dash/icon_tesoura_outline.svg" alt="">Serviços</button>
//           <button class="btn-navbar" onclick="navegar('./usuarios_clientes.html')"><img style="max-width: 24px;"
//               src="../../assets/svg/nav_dash/icon_user_outline.svg" alt="">Usuários</button>
//           <button class="btn-navbar-ativo" onclick="navegar('./controlem_servicos.html')"><img style="max-width: 24px;"
//               src="../../assets/svg/nav_dash/icon_doc_filled.svg" alt="">Controle Mensal</button>
//           <button class="btn-navbar" onclick="navegar('./perfil.html')"><img style="max-width: 24px;"
//               src="../../assets/svg/nav_dash/icon_smile_outline.svg" alt="">Perfil</button>
//         </div>
//         <button onclick="logout()" class="btn-sair"><img style="max-width: 24px;"
//             src="../../assets/svg/nav_config/icon_exit.svg" alt="">Sair</button>
//       </div>
//     </div>
//     <div class="dash_section_filho">
//       <div class="section_controle_servico_title">
//         <p class="titulo-1">Mês Selecionado</p>

//         <!-- COMPONENTE - SELECT MÊS -->
//         <select class="paragrafo-1 select semibold" name="mes" id="mes_select">
//           <option value="fev">Fevereiro</option>
//         </select>
//       </div>

//       <!-- COMPONENTE - MINI -->
//       <div class="mini_nav_pai">
//         <p class="paragrafo-2 mini_nav_filho_ativo" onclick="navegar('./controlem_servicos.html')">Serviços</p>
//         <p class="paragrafo-2 mini_nav_filho" onclick="navegar('./controlem_cancelamentos.html')">Cancelamentos</p>
//         <p class="paragrafo-2 mini_nav_filho" onclick="navegar('./controlem_avaliacoes.html')">Avaliações</p>
//       </div>

//       <div class="section_controle_servico_kpis_pai">
//         <div class="section_controle_servico_kpis card">
//           <p class="paragrafo-2 italic">Total de Atendimentos</p>
//           <div class="section_controle_servico_kpis_card_column">
//             <p class="paragrafo-1 semibold">110</p>
//             <p class="paragrafo-2 section_controle_servico_kpis_card_value">+2,5%</p>
//           </div>
//         </div>

//         <div class="section_controle_servico_kpis card">
//           <p class="paragrafo-2 italic">Atendimentos Cancelados</p>
//           <div class="section_controle_servico_kpis_card_column">
//             <p class="paragrafo-1 semibold">75</p>
//             <p class="paragrafo-2 section_controle_servico_kpis_card_value" style="background-color: var(--vermelho);">
//               +1%</p>
//           </div>
//         </div>

//         <div class="section_controle_servico_kpis card">
//           <p class="paragrafo-2 italic">Clientes Cadastrados</p>
//           <div class="section_controle_servico_kpis_card_column">
//             <p class="paragrafo-1 semibold">2</p>
//             <p class="paragrafo-2 section_controle_servico_kpis_card_value">+21%</p>
//           </div>
//         </div>

//         <div class="section_controle_servico_kpis card">
//           <p class="paragrafo-2 italic">Faturamento Total</p>
//           <div class="section_controle_servico_kpis_card_column">
//             <p class="paragrafo-1 semibold">R$10.000,00</p>
//             <p class="paragrafo-2 section_controle_servico_kpis_card_value">+5%</p>
//           </div>
//         </div>
//       </div>

//       <div class="section_controle_servico_grafico card">
//         <p class="paragrafo-2 semibold">Atendimentos por Dia</p>
//         <canvas id="atendimentosChart" style=" display: flex; width: 100%; height: 100%;"></canvas>
//       </div>

//       <div class="section_controle_servico_line2">
//         <div class="section_controle_servico_column_pai card">
//           <p class="paragrafo-2 semibold">Atendimentos por Serviço</p>
//           <canvas id="servicosChart"></canvas>
//         </div>
//         <div class="section_controle_servico_column_pai card" style="gap: 16px;">
//           <p class="paragrafo-2 semibold" style="display: flex; align-items: center; gap: 8px;">
//             <img src="../../assets/svg/icon_ia.svg" alt="icon-ia">
//             Análise de Desempenho
//           </p>
//           <p class="paragrafo-2">
//             Análise gerada por inteligência artificial generativa
//             Análise gerada por inteligência artificial generativa
//             Análise gerada por inteligência artificial generativa
//             Análise gerada por inteligência artificial generativa
//             Análise gerada por inteligência artificial generativa
//             Análise gerada por inteligência artificial generativa
//             Análise gerada por inteligência artificial generativa
//             Análise gerada por inteligência artificial generativa
//           </p>
//         </div>
//       </div>
//     </div>

//   </div>
// </body>

// <script>

//   function gerarAtendimentosPorDia() {
//     // Função para gerar labels de todos os dias do mês atual (mock: 31 dias)
//     const diasMes = Array.from({ length: 31 }, (_, i) => `${(i + 1).toString().padStart(2, '0')}/01`);

//     // Mock: atendimentos mês atual
//     const mesAtual = [
//       250, 280, 320, 350, 380, 400, 370,
//       330, 340, 360, 470, 480, 450, 430,
//       390, 410, 600, 620, 590, 570, 530,
//       510, 500, 480, 450, 400, 420, 550,
//       600, 700, 750
//     ];

//     // Mock: atendimentos mês anterior (30 dias, note que no label temos 31)
//     const mesAnterior = [
//       200, 350, 400, 450, 500, 520, 510,
//       530, 550, 500, 520, 560, 540, 530,
//       520, 580, 600, 610, 590, 570, 550,
//       540, 500, 490, 460, 420, 580, 620,
//       700, 800, null // último dia null para alinhar
//     ];

//     const ctx = document.getElementById('atendimentosChart').getContext('2d');
//     const atendimentosChart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: diasMes,
//         datasets: [
//           {
//             label: 'Mês selecionado',
//             data: mesAtual,
//             borderColor: 'black',
//             backgroundColor: '#211F1E',
//             fill: false,
//             pointBackgroundColor: 'black',
//             tension: 0.3
//           },
//           {
//             label: 'Mês anterior',
//             data: mesAnterior,
//             borderColor: 'lightgray',
//             backgroundColor: 'D7D7D7',
//             fill: false,
//             pointBackgroundColor: 'lightgray',
//             tension: 0.3
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           //   title: {
//           //     display: true,
//           //     text: 'Atendimentos por Dia'
//           //   },
//           legend: {
//             labels: {
//               usePointStyle: true,
//               pointStyle: 'circle'
//             }
//           }
//         },
//         scales: {
//           x: {
//             title: {
//               display: true,
//               text: 'Dia do mês'
//             },
//             ticks: {
//               maxRotation: 30, // ângulo máximo
//               minRotation: 30  // ângulo mínimo
//             }
//           },
//           y: {
//             beginAtZero: true,
//             title: {
//               display: true,
//               text: 'Número de atendimentos'
//             }
//           }
//         }
//       }
//     });
//   }
//   function gerarAtendimentosPorServico() {
//     const ctx = document.getElementById('servicosChart').getContext('2d');

//     const servicosChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: ['Serviço A', 'Serviço B', 'Serviço C', 'Serviço D'],
//         datasets: [
//           {
//             label: 'Mês selecionado',
//             data: [80, 75, 70, 65], // mock valores
//             backgroundColor: 'black'
//           },
//           {
//             label: 'Mês anterior',
//             data: [95, 90, 88, 92], // mock valores
//             backgroundColor: 'lightgray'
//           }
//         ]
//       },
//       options: {
//         indexAxis: 'y', // <-- deixa as barras na horizontal
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'top',
//             labels: {
//               usePointStyle: true,
//               pointStyle: 'circle'
//             }
//           },
//           // title: {
//           //   display: true,
//           //   text: 'Comparativo de Serviços'
//           // }
//         },
//         scales: {
//           x: {
//             beginAtZero: true,
//             title: {
//               display: true,
//               text: 'Quantidade'
//             }
//           },
//           y: {
//             // title: {
//             //   display: true,
//             //   text: 'Serviços'
//             // }
//           }
//         }
//       }
//     });
//   }

//   gerarAtendimentosPorDia();
//   gerarAtendimentosPorServico();
// </script>

// </html>