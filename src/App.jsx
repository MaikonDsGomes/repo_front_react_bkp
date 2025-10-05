import { BrowserRouter, Routes, Route } from "react-router-dom";

// ====================
// Páginas do Cliente
// ====================
import Index from "./pages/client_pages/index.jsx";
import Login from "./pages/client_pages/login.jsx";
import Servicos from "./pages/client_pages/servicos.jsx";
import Cadastro from "./pages/client_pages/cadastro.jsx";
import ConfigCupons from "./pages/client_pages/config_cupons.jsx";
import ConfigHistorico from "./pages/client_pages/config_historico.jsx";
import ConfigPerfil from "./pages/client_pages/config_perfil.jsx";

// ====================
// Páginas do Admin
// ====================
import CalendarioAtendimentos from "./pages/adm_pages/calendario_atendimentos.jsx";
import CalendarioConfiguracoes from "./pages/adm_pages/calendario_configuracoes.jsx";
import CalendarioVisaoGeral from "./pages/adm_pages/calendario_visao_geral.jsx";
import ControleAvaliacoes from "./pages/adm_pages/controle_avaliacoes.jsx";
import ControleCancelamentos from "./pages/adm_pages/controle_cancelamentos.jsx";
import ControleServicos from "./pages/adm_pages/controle_servicos.jsx";
import Perfil from "./pages/adm_pages/perfil.jsx";
import ServicosCupons from "./pages/adm_pages/servicos_cupons.jsx";
import ServicosServicos from "./pages/adm_pages/servicos_servicos.jsx";
import UsuariosClientes from "./pages/adm_pages/usuarios_clientes.jsx";
import UsuariosFuncionarios from "./pages/adm_pages/usuarios_funcionarios.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas do Cliente */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/config-cupons" element={<ConfigCupons />} />
        <Route path="/config-historico" element={<ConfigHistorico />} />
        <Route path="/config-perfil" element={<ConfigPerfil />} />

        {/* Rotas do Admin */}
        <Route path="/adm/calendario-atendimentos" element={<CalendarioAtendimentos />} />
        <Route path="/adm/calendario-configuracoes" element={<CalendarioConfiguracoes />} />
        <Route path="/adm/calendario-visao-geral" element={<CalendarioVisaoGeral />} />
        <Route path="/adm/controle-avaliacoes" element={<ControleAvaliacoes />} />
        <Route path="/adm/controle-cancelamentos" element={<ControleCancelamentos />} />
        <Route path="/adm/controle-servicos" element={<ControleServicos />} />
        <Route path="/adm/perfil" element={<Perfil />} />
        <Route path="/adm/servicos-cupos" element={<ServicosCupons />} />
        <Route path="/adm/servicos-servicos" element={<ServicosServicos />} />
        <Route path="/adm/usuarios-clientes" element={<UsuariosClientes />} />
        <Route path="/adm/usuarios-funcionarios" element={<UsuariosFuncionarios />} />
      </Routes>
    </BrowserRouter>
  );
}
