// ...existing code...
export default function CardCliente({
  nome,
  email,
  telefone,
  foto,
  pendencias = 0,
  onEditar,
  onDetalhes,
  exibirPendencias = false, // novo: permite ocultar "Pendências"
}) {
  return (
    <div className="card usuarios_card">
      <img 
      className="card-foto-cliente" 
      src={`http://localhost:8080/usuarios/foto/${foto}`}
      onError={(e) => { e.target.src = "/src/assets/img/usuario_foto_def.png"; }}
      alt={`Foto de ${nome}`} />

      <div className="card-info">
        <p className="paragrafo-1 bold">{nome}</p>

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
        {exibirPendencias && <p className="paragrafo-2">Pendências: {pendencias}</p>}
      </div>
    </div>
  );
}
