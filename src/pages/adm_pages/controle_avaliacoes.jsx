import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuDash from "../../components/MenuDash";
import ControleMensalLayout from "../../components/ControleMensalLayout";
import ControleItemCard from "../../components/ControleItemCard";
import { buscarAvaliacoes } from "../../js/api/elerson.js";

export default function Controle_avaliacoes() {
  const navigate = useNavigate();
  // Obter mês atual
  const mesAtual = ["jan", "fev", "mar", "abr", "mai", "jun", 
                    "jul", "ago", "set", "out", "nov", "dez"][new Date().getMonth()];
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados da API quando a página é carregada
  useEffect(() => {
    const carregarAvaliacoes = async () => {
      try {
        setLoading(true);
        const dados = await buscarAvaliacoes();
        console.log("Avaliações recebidas da API:", dados);
        
        // Transformar os dados da API para o formato esperado pelo componente
        const avaliacoesFormatadas = dados.map((item) => ({
          id: item.id,
          idCliente: item.idUsuario,
          clienteNome: item.nomeUsuario,
          servicoNome: item.nomeServico,
          dataHoraISO: item.dataHorario, // Já está no formato ISO
          descricao: item.descricaoServico,
          fotoUrl: "/src/assets/img/foto_perfil.png", // Foto padrão
          estrelas: item.notaServico,
          mes: obterMesAbreviado(item.dataHorario), // Extrair mês da data
        }));
        
        setAvaliacoes(avaliacoesFormatadas);
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarAvaliacoes();
  }, []);

  // Função para obter mês abreviado da data
  const obterMesAbreviado = (dataString) => {
    const meses = ["jan", "fev", "mar", "abr", "mai", "jun", 
                   "jul", "ago", "set", "out", "nov", "dez"];
    const data = new Date(dataString);
    return meses[data.getMonth()];
  };

  // Filtro por mês selecionado
  const itensFiltrados = avaliacoes.filter((a) => a.mes === mesSelecionado);

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
        active="avaliacoes"
        mes={mesSelecionado}
        onMesChange={setMesSelecionado}
      >
        <div className="dash_lista_itens">
          {loading ? (
            <p>Carregando avaliações...</p>
          ) : itensFiltrados.length > 0 ? (
            itensFiltrados.map((a) => (
              <ControleItemCard
                key={a.id}
                tipo="avaliacao"
                fotoUrl={a.idCliente}
                clienteNome={a.clienteNome}
                servicoNome={a.servicoNome}
                dataHoraISO={a.dataHoraISO}
                descricao={a.descricao}
                estrelas={a.estrelas}
                formatarDataHora={formatarDataHora}
              />
            ))
          ) : (
            <p>Nenhuma avaliação encontrada para este mês.</p>
          )}
        </div>
      </ControleMensalLayout>
    </MenuDash>
  );
}