import { useNavigate } from "react-router-dom";

export default function UsuariosHeader({
  tipo = "clientes",           // "clientes" | "funcionarios"
  onButtonClick,
  iconSrc = "/src/assets/icons/plus-icon.svg",
  titulo,                      // opcional
  label,                       // opcional
}) {
  const navigate = useNavigate();
  const isClientes = tipo === "clientes";

  const tituloFinal = titulo ?? (isClientes ? "Gerenciar Clientes" : "Gerenciar Funcionários");
  const labelFinal = label ?? (isClientes ? "Cadastrar Cliente" : "Cadastrar Funcionário");

  return (
    <>
      <div className="mini_nav_pai">
        <p
          className={isClientes ? "paragrafo-2 mini_nav_filho_ativo" : "paragrafo-2 mini_nav_filho"}
          onClick={() => navigate("/adm/usuarios-clientes")}
        >
          Clientes
        </p>
        <p
          className={!isClientes ? "paragrafo-2 mini_nav_filho_ativo" : "paragrafo-2 mini_nav_filho"}
          onClick={() => navigate("/adm/usuarios-funcionarios")}
        >
          Funcionários
        </p>
      </div>

      {/* Usa a mesma classe em ambas as telas */}
      <div className="dash_section_container_header_usuarios usuarios_clientes_titulo_box">
        <h1 className="titulo-1">{tituloFinal}</h1>
        <button className="btn-rosa" onClick={onButtonClick}>
          <img src={iconSrc} alt="" />
          {labelFinal}
        </button>
      </div>
    </>
  );
}