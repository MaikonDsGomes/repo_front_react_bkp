import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuDash from "../../components/MenuDash";
import ControleMensalLayout from "../../components/ControleMensalLayout";
import ControleItemCard from "../../components/ControleItemCard";
import { buscarCancelamentosDashboard } from "../../js/api/elerson.js";

export default function Controle_cancelamentos() {
  const navigate = useNavigate();
  // Obter mês atual
  const mesAtual = ["jan", "fev", "mar", "abr", "mai", "jun", 
                    "jul", "ago", "set", "out", "nov", "dez"][new Date().getMonth()];
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [cancelamentos, setCancelamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do endpoint quando a página for carregada
  useEffect(() => {
    const carregarCancelamentos = async () => {
      try {
        setLoading(true);
        const dados = await buscarCancelamentosDashboard();
        
        // Transformar os dados da API para o formato esperado pelo componente
        const cancelamentosFormatados = dados.map((item) => ({
          id: item.id,
          idCliente: item.idCliente,
          clienteNome: item.nomeCliente,
          servicoNome: item.nomeServico,
          dataHoraISO: `${item.dataServico}T00:00:00.000Z`, // Converter data para ISO
          descricao: item.descricao,
          fotoUrl: "/src/assets/img/foto_perfil.png", // Foto padrão
          mes: obterMesAbreviado(item.dataServico), // Extrair mês da data
        }));
        
        setCancelamentos(cancelamentosFormatados);
        console.log("Cancelamentos carregados com sucesso!", dados);
      } catch (error) {
        console.error("Erro ao carregar cancelamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarCancelamentos();
  }, []);

  // Função para obter mês abreviado da data
  const obterMesAbreviado = (dataString) => {
    const meses = ["jan", "fev", "mar", "abr", "mai", "jun", 
                   "jul", "ago", "set", "out", "nov", "dez"];
    const data = new Date(dataString);
    return meses[data.getMonth()];
  };

  // Filtro por mês selecionado
  const itensFiltrados = cancelamentos.filter((c) => c.mes === mesSelecionado);

  // Formatação de data/hora
  const formatarDataHora = (iso) => {
    try {
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = String(d.getFullYear()).slice(2);
      const hh = d.getHours();
      const min = String(d.getMinutes()).padStart(2, "0");
      const sufixo = hh >= 12 ? "pm" : "am";
      const hh12 = ((hh + 11) % 12) + 1;
      return `${dd}/${mm}/${yy} ${String(hh12).padStart(2, "0")}:${min}${sufixo}`;
    } catch {
      return iso;
    }
  };

  return (
    <MenuDash>
      <ControleMensalLayout
        active="cancelamentos"
        mes={mesSelecionado}
        onMesChange={setMesSelecionado}
      >
        <div className="dash_lista_itens">
          {loading ? (
            <p>Carregando cancelamentos...</p>
          ) : itensFiltrados.length > 0 ? (
            itensFiltrados.map((c) => (
              <ControleItemCard
                key={c.id}
                tipo="cancelamento"
                fotoUrl={c.idCliente} // Usar ID para foto de perfil
                clienteNome={c.clienteNome}
                servicoNome={c.servicoNome}
                dataHoraISO={c.dataHoraISO}
                descricao={c.descricao}
                formatarDataHora={formatarDataHora}
              />
            ))
          ) : (
            <p>Nenhum cancelamento encontrado para este mês.</p>
          )}
        </div>
      </ControleMensalLayout>
    </MenuDash>
  );
}