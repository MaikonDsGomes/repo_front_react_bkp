import { useNavigate } from "react-router-dom";

export default function ControleMensalLayout({
  active,                  // "servicos" | "cancelamentos" | "avaliacoes"
  mes,
  onMesChange,
  mesOptions = [
    { value: "jan", label: "Janeiro" },
    { value: "fev", label: "Fevereiro" },
    { value: "mar", label: "Março" },
    { value: "abr", label: "Abril" },
    { value: "mai", label: "Maio" },
    { value: "jun", label: "Junho" },
    { value: "jul", label: "Julho" },
    { value: "ago", label: "Agosto" },
    { value: "set", label: "Setembro" },
    { value: "out", label: "Outubro" },
    { value: "nov", label: "Novembro" },
    { value: "dez", label: "Dezembro" }],
  children,
}) {
  const navigate = useNavigate();
  const isAtivo = (tab) => (active === tab ? "paragrafo-2 mini_nav_filho_ativo" : "paragrafo-2 mini_nav_filho");

  return (
    <>
      <div className="section_controle_servico_title">
        <p className="titulo-1">Mês Selecionado</p>
        <select
          className="paragrafo-1 select semibold"
          name="mes"
          id="mes_select"
          value={mes}
          onChange={(e) => onMesChange?.(e.target.value)}
        >
          {mesOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="mini_nav_pai">
        <p className={isAtivo("servicos")} onClick={() => navigate("/adm/controle-servicos")}>Serviços</p>
        <p className={isAtivo("cancelamentos")} onClick={() => navigate("/adm/controle-cancelamentos")}>Cancelamentos</p>
        <p className={isAtivo("avaliacoes")} onClick={() => navigate("/adm/controle-avaliacoes")}>Avaliações</p>
      </div>

      {children}
    </>
  );
}