import { useEffect, useState } from "react";
import MenuDash from "../../components/MenuDash";
import ControleMensal from "../../components/NavControleMensal";
import {
  buscarKPI,
  buscarKPIUsuarios,
  buscarAtendimentoGrafico,
  buscarAtendimentoServico,
  buscarKPIPersonalizado,
  buscarKPIUsuariosPersonalizado,
  buscarAtendimentoGraficoPersonalizado,
  buscarAtendimentoServicoPersonalizado
} from "../../js/api/elerson";
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
import { perguntarIA } from "../../js/api/ai";

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
  // Helper: formata Date -> YYYY-MM-DD para inputs `type=date` e chamadas à API
  const toISODate = (d) => {
    const date = d instanceof Date ? d : new Date(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [isPersonalizado, setIsPersonalizado] = useState(false);
  // mês/ano selecionados (modo mensal)
  const now = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(now.getMonth() + 1); // 1-12
  const [anoSelecionado, setAnoSelecionado] = useState(now.getFullYear());
  // padrão: intervalo dos últimos 7 dias
  const hoje = new Date();
  const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [dataInicio, setDataInicio] = useState(toISODate(seteDiasAtras));
  const [dataFim, setDataFim] = useState(toISODate(hoje));
  const [kpiData, setKpiData] = useState(null);
  const [kpiUsuariosData, setKpiUsuariosData] = useState(null);
  const [atendimentoGraficoData, setAtendimentoGraficoData] = useState(null);
  const [atendimentoServicoData, setAtendimentoServicoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaResposta, setIaResposta] = useState("");
  const [iaErro, setIaErro] = useState("");

  // Função que carrega todos os dados do dashboard para o intervalo selecionado
  const carregarDados = async () => {
    setLoading(true);
    setErro(null);
    const errors = [];

    // Executa requisições em paralelo; trata cada resultado individualmente
    // para que um endpoint com erro não impeça os demais de renderizarem.
    let promises;
    if (isPersonalizado) {
      const pKpi = buscarKPIPersonalizado(dataInicio, dataFim);
      const pKpiUsuarios = buscarKPIUsuariosPersonalizado(dataInicio, dataFim);
      const pGrafico = buscarAtendimentoGraficoPersonalizado(dataInicio, dataFim);
      const pServico = buscarAtendimentoServicoPersonalizado(dataInicio, dataFim);
      promises = [pKpi, pKpiUsuarios, pGrafico, pServico];
    } else {
      // Garante mês com dois dígitos (ex: '01'..'12') para o backend
      const mesParam = String(mesSelecionado).padStart(2, "0");
      const pKpi = buscarKPI(mesParam, anoSelecionado);
      const pKpiUsuarios = buscarKPIUsuarios(mesParam, anoSelecionado);
      const pGrafico = buscarAtendimentoGrafico(mesParam, anoSelecionado);
      const pServico = buscarAtendimentoServico(mesParam, anoSelecionado);
      promises = [pKpi, pKpiUsuarios, pGrafico, pServico];
    }

    const results = await Promise.allSettled(promises);

    // KPI geral
    if (results[0].status === "fulfilled") {
      const dados = results[0].value;
      if (dados && dados.length > 0) setKpiData(dados[0]);
      else setKpiData(null);
    } else {
      console.error("buscarKPI failed:", results[0].reason);
      setKpiData(null);
      errors.push("KPI geral");
    }

    // KPI usuários
    if (results[1].status === "fulfilled") {
      setKpiUsuariosData(results[1].value || null);
    } else {
      console.error("buscarKPIUsuarios failed:", results[1].reason);
      setKpiUsuariosData(null);
      errors.push("KPI usuários");
    }

    // Gráfico de atendimentos
    if (results[2].status === "fulfilled") {
      const dadosGrafico = results[2].value;
      setAtendimentoGraficoData(dadosGrafico && dadosGrafico.length > 0 ? dadosGrafico : null);
    } else {
      console.error("buscarAtendimentoGrafico failed:", results[2].reason);
      setAtendimentoGraficoData(null);
      errors.push("Atendimentos (gráfico)");
    }

    // Atendimentos por serviço
    if (results[3].status === "fulfilled") {
      const dadosServico = results[3].value;
      if (dadosServico && dadosServico.length > 0) {
        setAtendimentoServicoData(dadosServico);
      } else if (!isPersonalizado) {
        // Se o mês atual estiver vazio, tentar buscar os dados do mês anterior
        try {
          const mesNum = Number(mesSelecionado);
          const prevMonthNum = mesNum === 1 ? 12 : mesNum - 1;
          const prevYear = mesNum === 1 ? Number(anoSelecionado) - 1 : Number(anoSelecionado);
          const prevMonthParam = String(prevMonthNum).padStart(2, '0');
          const prevData = await buscarAtendimentoServico(prevMonthParam, prevYear);

          if (prevData && prevData.length > 0) {
            // sintetiza objetos no formato esperado pelo gráfico: nomeServico, qtdAtual, qtdAnterior
            const synthesized = prevData.map(item => ({
              nomeServico: item.nomeServico ?? item.nome ?? 'Serviço',
              qtdAtual: 0,
              qtdAnterior: item.qtdAtual ?? item.qtdAnterior ?? 0,
            }));
            setAtendimentoServicoData(synthesized);
          } else {
            setAtendimentoServicoData(null);
          }
        } catch (e) {
          console.error('Erro ao buscar atendimentos do mês anterior:', e);
          setAtendimentoServicoData(null);
          errors.push("Atendimentos por serviço");
        }
      } else {
        setAtendimentoServicoData(null);
      }
    } else {
      console.error("buscarAtendimentoServico failed:", results[3].reason);
      setAtendimentoServicoData(null);
      errors.push("Atendimentos por serviço");
    }

    if (errors.length > 0) {
      setErro(`Falha ao carregar: ${errors.join(", ")}.`);
    } else {
      setErro(null);
    }

    setLoading(false);
  };

  // Parser ISO -> Date no horário local para evitar shifts de timezone
  // Recebe string no formato YYYY-MM-DD e retorna Date corresondente no horário local (00:00)
  const parseISODateLocal = (iso) => {
    if (!iso) return null;
    // aceita formatos como '2025-11-30' ou '2025-11-30T00:00:00'
    const datePart = iso.split('T')[0];
    const parts = datePart.split('-').map(p => Number(p));
    if (parts.length < 3 || parts.some(isNaN)) return new Date(iso);
    const [y, m, d] = parts;
    return new Date(y, m - 1, d);
  };

  // Recarrega dados quando muda o modo (mensal/personalizado), mês, ano ou intervalo.
  // Para o modo personalizado, atualiza automaticamente ao alterar as datas.
  useEffect(() => {
    if (isPersonalizado) {
      // valida intervalo
      if (new Date(dataInicio) > new Date(dataFim)) {
        setErro('Data inicial não pode ser maior que data final.');
        return;
      }
      setErro(null);
      carregarDados();
      return;
    }

    // modo mensal: recarrega quando mês/ano mudarem
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPersonalizado, mesSelecionado, anoSelecionado, dataInicio, dataFim]);

  // Processa os dados para o gráfico de atendimentos
  const processarDadosGrafico = () => {
    if (!atendimentoGraficoData || atendimentoGraficoData.length === 0) {
      const baseDataset = {
        label: isPersonalizado ? "Período selecionado" : "Mês selecionado",
        data: [],
        borderColor: "black",
        backgroundColor: "#211F1E",
        fill: false,
        pointBackgroundColor: "black",
        tension: 0.3,
      };

      const datasets = [baseDataset];
      if (!isPersonalizado) {
        datasets.push({
          label: "Mês anterior",
          data: [],
          borderColor: "lightgray",
          backgroundColor: "lightgray",
          fill: false,
          pointBackgroundColor: "lightgray",
          tension: 0.3,
        });
      }

      return { labels: [], datasets };
    }
    // Detecta formato dos itens e extrai label/data correta
    const dadosOrdenados = [...atendimentoGraficoData].slice();

    // Se os itens tiverem campo 'data' (ex: "2025-11-01"), usaremos a data completa
    const hasFullDate = dadosOrdenados.some(item => item.data || item.dataAtual || item.date);

    if (hasFullDate) {
      // Ordena por data completa -- usar parser local para evitar shift de timezone
      dadosOrdenados.sort((a, b) => parseISODateLocal(a.data || a.dataAtual || a.date) - parseISODateLocal(b.data || b.dataAtual || b.date));
      const dias = dadosOrdenados.map(item => {
        const d = parseISODateLocal(item.data || item.dataAtual || item.date);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        return `${dd}/${mm}`;
      });
      const qtdAtual = dadosOrdenados.map(item => item.qtdAtual ?? 0);

      const datasets = [
        {
          label: "Período selecionado",
          data: qtdAtual,
          borderColor: "#211F1E",
          backgroundColor: "#211F1E",
          fill: false,
          pointBackgroundColor: "#211F1E",
          tension: 0.3,
        }
      ];

      return { labels: dias, datasets };
    }

    // Caso padrão (modo mensal): itens têm 'diaMesAtual' e possivelmente 'qtdAnterior'
    dadosOrdenados.sort((a, b) => Number(a.diaMesAtual) - Number(b.diaMesAtual));
    const mesNum = isPersonalizado ? (new Date(dataInicio).getMonth() + 1) : mesSelecionado;
    const diasMes = dadosOrdenados.map((item) =>
      `${String(item.diaMesAtual).padStart(2, "0")}/${String(mesNum).padStart(2, "0")}`
    );
    const qtdAtual = dadosOrdenados.map((item) => item.qtdAtual ?? 0);
    const qtdAnterior = dadosOrdenados.map((item) => item.qtdAnterior ?? 0);

    const datasets = [
      {
        label: isPersonalizado ? "Período selecionado" : "Mês selecionado",
        data: qtdAtual,
        borderColor: "#211F1E",
        backgroundColor: "#211F1E",
        fill: false,
        pointBackgroundColor: "#211F1E",
        tension: 0.3,
      }
    ];
    if (!isPersonalizado) {
      datasets.push({
        label: "Mês anterior",
        data: qtdAnterior || [],
        borderColor: "lightgray",
        backgroundColor: "lightgray",
        fill: false,
        pointBackgroundColor: "lightgray",
        borderDash: [6, 4],
        tension: 0.3,
      });
    }

    return {
      labels: diasMes,
      datasets,
    };
  };

  const atendimentosData = processarDadosGrafico();

  const atendimentosOptions = {
    responsive: true,
    maintainAspectRatio: true, // preserve aspect ratio to avoid vertical stretch
    aspectRatio: 3, // width / height; tweak (e.g., 2.5~3.5) to taste
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
        ticks: {
          precision: 0,
        },
      },
    },
  };

  // Processa os dados para o gráfico de serviços
  const processarDadosServicos = () => {
    if (!atendimentoServicoData || atendimentoServicoData.length === 0) {
      const base = {
        label: isPersonalizado ? "Período selecionado" : "Mês selecionado",
        data: [],
        backgroundColor: "#211F1E",
      };
      const datasets = [base];
      if (!isPersonalizado) {
        datasets.push({ label: "Mês anterior", data: [], backgroundColor: "lightgray" });
      }
      return { labels: [], datasets };
    }

    // Ordena por quantidade atual (decrescente) para listar os serviços mais populares primeiro
    const dadosOrdenados = [...atendimentoServicoData].sort(
      (a, b) => b.qtdAtual - a.qtdAtual
    );

    const labels = dadosOrdenados.map(item => item.nomeServico);
    const qtdAtual = dadosOrdenados.map(item => item.qtdAtual);
    const qtdAnterior = dadosOrdenados.map(item => item.qtdAnterior);

    // Inclui dataset do período atual
    const datasets = [
      {
        label: isPersonalizado ? "Período selecionado" : "Mês selecionado",
        data: qtdAtual,
        backgroundColor: "#211F1E",
      }
    ];
    // Incluir mês anterior no modo mensal (mesmo que vazio)
    if (!isPersonalizado) {
      datasets.push({
        label: "Mês anterior",
        data: qtdAnterior || [],
        backgroundColor: "lightgray",
      });
    }

    return {
      labels,
      datasets,
    };
  };

  const servicosData = processarDadosServicos();

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
        ticks: {
          precision: 0,
        },
      },
    },
  };

  async function gerarAnaliseIA() {
    setIaLoading(true);
    setIaErro("");
    setIaResposta("");
    try {
      // Monta um contexto resumido com alguns KPIs e top serviços
      const contextoServicos = (atendimentoServicoData || [])
        .sort((a, b) => b.qtdAtual - a.qtdAtual)
        .slice(0, 5)
        .map(s => `${s.nomeServico}: ${s.qtdAtual}`)
        .join("; ");
      const prompt = isPersonalizado ?

        `Você é um assistente que interpreta uma dashboard mensal para gestão de um salão de beleza.
Mes selecionado: ${mesSelecionado}/${anoSelecionado}
Total atendimentos: ${kpiData?.totalAtendimentos ?? "0"}
Cancelados: ${kpiData?.totalCancelados ?? "0"}
Clientes cadastrados: ${kpiUsuariosData?.totalCadastros ?? "0"}
Faturamento: ${kpiData?.faturamentoTotal ?? "0"}
Top serviços (qtd no período): ${contextoServicos || "Sem dados"}

Objetivo: gere uma análise em português, com:
- Resumo dos dados para melhor interpretação
- Tendências principais
- Possíveis causas
Seja breve e utilize tom profissional.

Lembre-se que sua resposta será uma variavel string exibida diretamente dentro de uma div de um site, então não utilize formatações de texto (bold/italic/title/etc).`

        :

        `Você é um assistente que interpreta uma dashboard para gestão de um salão de beleza.
Período: ${dataInicio} a ${dataFim}
Total atendimentos: ${kpiData?.totalAtendimentos ?? "0"}
Cancelados: ${kpiData?.totalCancelados ?? "0"}
Clientes cadastrados: ${kpiUsuariosData?.totalCadastros ?? "0"}
Faturamento: ${kpiData?.faturamentoTotal ?? "0"}
Top serviços (qtd no período): ${contextoServicos || "Sem dados"}

Objetivo: gere uma análise em português, com:
- Resumo dos dados para melhor interpretação
- Tendências principais
- Possíveis causas
Seja breve e utilize tom profissional.

Lembre-se que sua resposta será uma variavel string exibida diretamente dentro de uma div de um site, então não utilize formatações de texto (bold/italic/title/etc).`
        ;

      const resposta = await perguntarIA(prompt);
      setIaResposta(resposta);
    } catch (e) {
      setIaErro(e.message || "Erro ao gerar análise");
    } finally {
      setIaLoading(false);
    }
  }
  return (
    <MenuDash>

      {/* Título + Select */}
      <div className="section_controle_servico_title">
        <p className="titulo-1">{isPersonalizado ? 'Período Selecionado:' : 'Mês Selecionado'}</p>
        <select
          name="select_mes"
          id="select_mes"
          className="paragrafo-2 select semibold"
          style={{ width: `${!isPersonalizado ? 'auto' : ''}` }}
          value={isPersonalizado ? 'personalizado' : String(mesSelecionado)}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'personalizado') {
              setIsPersonalizado(true);
            } else {
              setIsPersonalizado(false);
              setMesSelecionado(Number(v));
            }
          }}
        >
          <option value="personalizado">Personalizado</option>
          {/* show month label with year, e.g. "Jan/2025" */}
          <option value="1">Janeiro/{anoSelecionado}</option>
          <option value="2">Fevereiro/{anoSelecionado}</option>
          <option value="3">Março/{anoSelecionado}</option>
          <option value="4">Abril/{anoSelecionado}</option>
          <option value="5">Maio/{anoSelecionado}</option>
          <option value="6">Junho/{anoSelecionado}</option>
          <option value="7">Julho/{anoSelecionado}</option>
          <option value="8">Agosto/{anoSelecionado}</option>
          <option value="9">Setembro/{anoSelecionado}</option>
          <option value="10">Outubro/{anoSelecionado}</option>
          <option value="11">Novembro/{anoSelecionado}</option>
          <option value="12">Dezembro/{anoSelecionado}</option>
        </select>
        {isPersonalizado && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '24px' }}>
            <label className="paragrafo-1" style={{ marginTop: "4px" }} htmlFor="dataInicio_input">De</label>
            <input
              id="dataInicio_input"
              type="date"
              className="paragrafo-2 input select_data_range_dash semibold"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              onFocus={() => setErro(null)}
            />

            <label className="paragrafo-1" style={{ marginTop: "4px" }} htmlFor="dataFim_input">Até</label>
            <input
              id="dataFim_input"
              type="date"
              className="paragrafo-2 input select_data_range_dash semibold"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              onFocus={() => setErro(null)}
            />
          </div>
        )}
      </div>

      {/* Mini Nav */}
      <ControleMensal />

      {/* KPIs */}
      <div className="section_controle_servico_kpis_pai">
        <div className="section_controle_servico_kpis card">
          <p className="paragrafo-2 italic">Total de Atendimentos</p>
          <div className="section_controle_servico_kpis_card_column">
            <p className="paragrafo-1 semibold">{kpiData?.totalAtendimentos ?? "0"}</p>
            {!isPersonalizado && (
              <p className="paragrafo-2 section_controle_servico_kpis_card_value"
                style={{
                  backgroundColor:
                    kpiData?.totalAtendimentosTaxa < 0
                      ? "var(--vermelho)"
                      : "var(--verde)"
                }}>
                {kpiData?.totalAtendimentosTaxa
                  ? `${kpiData.totalAtendimentosTaxa > 0 ? '+' : ''}${kpiData.totalAtendimentosTaxa}%`
                  : "—"}
              </p>
            )}
          </div>
        </div>

        <div className="section_controle_servico_kpis card">
          <p className="paragrafo-2 italic">Atendimentos Cancelados</p>
          <div className="section_controle_servico_kpis_card_column">
            <p className="paragrafo-1 semibold">{kpiData?.totalCancelados ?? "0"}</p>

            {!isPersonalizado && (
              <p
                className="paragrafo-2 section_controle_servico_kpis_card_value"
                style={{
                  backgroundColor:
                    kpiData?.totalCanceladosTaxa < 0
                      ? "var(--vermelho)"
                      : "var(--verde)"
                }}
              >
                {kpiData?.totalCanceladosTaxa
                  ? `${kpiData.totalCanceladosTaxa > 0 ? '+' : ''}${kpiData.totalCanceladosTaxa}%`
                  : "—"}
              </p>
            )}
          </div>
        </div>

        <div className="section_controle_servico_kpis card">
          <p className="paragrafo-2 italic">Clientes Cadastrados</p>
          <div className="section_controle_servico_kpis_card_column">
            <p className="paragrafo-1 semibold">{kpiUsuariosData?.totalCadastros ?? "0"}</p>

            {!isPersonalizado && (
              <p className="paragrafo-2 section_controle_servico_kpis_card_value"
              style={{
                  backgroundColor:
                    kpiData?.variacaoPercentual < 0
                      ? "var(--vermelho)"
                      : "var(--verde)"
                }}
              >
                {kpiUsuariosData?.variacaoPercentual
                  ? `${kpiUsuariosData.variacaoPercentual > 0 ? '+' : ''}${kpiUsuariosData.variacaoPercentual}%`
                  : "—"}
              </p>
            )}
          </div>
        </div>

        <div className="section_controle_servico_kpis card">
          <p className="paragrafo-2 italic">Faturamento Total</p>
          <div className="section_controle_servico_kpis_card_column">
            <p className="paragrafo-1 semibold">
              {kpiData?.faturamentoTotal ? `R$${kpiData.faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "R$0"}
            </p>
            {!isPersonalizado && (
              <p className="paragrafo-2 section_controle_servico_kpis_card_value"
              style={{
                  backgroundColor:
                    kpiData?.faturamentoTotalTaxa < 0
                      ? "var(--vermelho)"
                      : "var(--verde)"
                }}>
                {kpiData?.faturamentoTotalTaxa
                  ? `${kpiData.faturamentoTotalTaxa > 0 ? '+' : ''}${kpiData.faturamentoTotalTaxa}%`
                  : "—"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Gráfico de Atendimentos por Dia */}
      <div className="section_controle_servico_grafico card" style={{ width: "100%" }}>
        <p className="paragrafo-2 semibold" style={{ alignSelf: "flex-start", textAlign: "start" }}>Atendimentos por Dia</p>
        <Line data={atendimentosData} options={atendimentosOptions} style={{ width: "100%", justifyContent: "center" }} />
      </div>

      {/* Linha com gráfico e análise IA */}
      <div className="section_controle_servico_line2">
        <div className="section_controle_servico_column_pai card">
          <p className="paragrafo-2 semibold">Atendimentos por Serviço</p>
          <Bar data={servicosData} options={servicosOptions} />
        </div>

        <div className="section_controle_servico_column_pai card" style={{ gap: "16px" }}>
          <p className="paragrafo-2 semibold" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="/src/assets/svg/icon_ia.svg" alt="icon-ia" />
            Análise de Desempenho
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p className="paragrafo-2">Gere resumos automáticos com base nos dados apresentados.</p>
            <button
              onClick={gerarAnaliseIA}
              disabled={iaLoading}
              className="paragrafo-2 semibold"
              style={{
                padding: "8px 12px",
                background: "black",
                color: "white",
                borderRadius: "6px",
                width: "fit-content",
                cursor: iaLoading ? "not-allowed" : "pointer",
                opacity: iaLoading ? 0.7 : 1
              }}>
              {iaLoading ? "Gerando análise..." : "Gerar análise IA"}
            </button>
            {iaErro && <p style={{ color: "var(--vermelho)", whiteSpace: "pre-wrap" }}>{iaErro}</p>}
            {iaResposta && (
              <div style={{
                maxHeight: "180px",
                overflowY: "auto",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: "#fafafa",
                whiteSpace: "pre-wrap",
                fontSize: "0.85rem"
              }}>
                {iaResposta}
              </div>
            )}
          </div>
        </div>
      </div>

    </MenuDash>
  );
}

