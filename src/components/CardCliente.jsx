// ...existing code...
export default function CardCliente({
  nome,
  email,
  telefone,
  foto = "/src/assets/img/foto_perfil.png",
  pendencias = 0,
  onEditar,
  onDetalhes,
  exibirPendencias = true, // novo: permite ocultar "Pendências"
}) {
  return (
    <div className="card usuarios_card">
      <img className="card-foto-cliente" src={foto} alt={`Foto de ${nome}`} />

      <div className="card-info">
        <h2>{nome}</h2>

        <div className="info-item">
          <img src="/src/assets/svg/icon_mail.svg" alt="Ícone Email" className="icon-small" />
          {email}
        </div>

        <div className="info-item">
          <img src="/src/assets/svg/icon_phone.svg" alt="Ícone Telefone" className="icon-small" />
          {telefone}
        </div>
      </div>

      <div className="card-buttons">
        <button className="btn-rosa" onClick={onEditar}>Editar</button>
        <button className="btn-branco" onClick={onDetalhes}>Detalhes</button>
        {exibirPendencias && <p className="paragrafo-1">Pendências: {pendencias}</p>}
      </div>
    </div>
  );
}
