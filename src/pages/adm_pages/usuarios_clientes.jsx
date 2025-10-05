import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuDash from "../../components/MenuDash";
import CardCliente from "../../components/CardCliente";
import UsuariosHeader from "../../components/UsuariosHeader";


export default function Usuarios_clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nome: "Nome do Cliente",
      email: "email@email.com",
      telefone: "123123-12312",
      foto: "/src/assets/img/foto_perfil.png",
      pendencias: 10
    },
    {
      id: 2,
      nome: "Maria Silva",
      email: "maria@email.com",
      telefone: "98765-4321",
      foto: "/src/assets/img/foto_perfil.png",
      pendencias: 3
    },{
      id: 2,
      nome: "Maria Silva",
      email: "maria@email.com",
      telefone: "98765-4321",
      foto: "/src/assets/img/foto_perfil.png",
      pendencias: 3
    }
  ]);

  const handleEditar = (id) => {
    console.log("Editar cliente:", id);
    // Implementar lógica de edição
  };

  const handleDetalhes = (id) => {
    console.log("Ver detalhes do cliente:", id);
    // Implementar lógica para mostrar detalhes
  };

  return (
    <MenuDash>
      

      <UsuariosHeader
        tipo="clientes"
        onButtonClick={() => console.log("Cadastrar Cliente")}
        iconSrc="src\assets\svg\plus.svg"
      ></UsuariosHeader>

      <div className="dash_section_container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', flexDirection: 'row' }}>
        {clientes.map(cliente => (
          <CardCliente
            key={cliente.id}
            nome={cliente.nome}
            email={cliente.email}
            telefone={cliente.telefone}
            foto={cliente.foto}
            pendencias={cliente.pendencias}
            onEditar={() => handleEditar(cliente.id)}
            onDetalhes={() => handleDetalhes(cliente.id)}
          />
        ))}
      </div>
    </MenuDash>
  );
}