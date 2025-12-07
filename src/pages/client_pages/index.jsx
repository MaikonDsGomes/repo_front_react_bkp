import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarLandingPage from "/src/components/NavbarLandingPage.jsx";
import Footer from "/src/components/Footer.jsx";
import { buscarAvaliacoes } from "../../js/api/avaliacao.js"
import { buscarInfoSalao } from "../../js/api/info_salao.js"
import BotpressChat from "../../components/BotpressChat.jsx";



// --- COMPONENTE ESPECIALIDADE ---
function EspecialidadeCard({ icon, titulo, descricao }) {
  return (
    <div className="especialidade_section_column">
      <div className="especialidade_icone">
        <img src={icon} alt={`icone-${titulo.toLowerCase()}`} />
      </div>
      <p className="paragrafo-1 bold" style={{ color: "var(--rosa-4)" }}>
        {titulo}
      </p>
      <p className="paragrafo-2" style={{ color: "var(--rosa-4)" }}>
        {descricao}
      </p>
    </div>
  );
}

function InstagramEmbed({ url }) {
  useEffect(() => {
    // Carrega o script oficial do Instagram se ainda não estiver na página
    if (!document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Se já existe, força o reprocessamento dos embeds
      window.instgrm?.Embeds?.process();
    }
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        margin: "1px",
        maxWidth: "540px",
        minWidth: "326px",
        padding: 0,
        width: "100%"
      }}
    />
  );
}

// --- COMPONENTE AVALIAÇÃO ---
function AvaliacaoCard({ nome, data, estrelas, servico, comentario, imagem }) {
  return (
    <div className="avaliacao_section_card shadow">
      <div className="avaliacao_section_card_infos">
          <img
            className="card-foto-cliente-dashboard" 
            src={`http://localhost:8080/usuarios/foto/${imagem}`}
            onError={(e) => { e.target.src = "/src/assets/img/usuario_foto_def.png"; }}
            alt="icon_perfil" 
          />
          <p className="semibold paragrafo-1">{nome}</p>
      </div>
      <div className="avaliacao_section_card_infos">
        <p className="paragrafo-2">{data} •</p>
        <div className="estrelas">
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              src={`/src/assets/svg/${i < estrelas ? "icon_star_outline.svg " : "icon_star_filled.svg"}`}
              alt="estrela"
            />
          ))}
        </div>
      </div>
      <p className="paragrafo-2 italic"><span className="semibold"> Serviço realizado: </span> {servico}</p>
      <p className="paragrafo-2">"{comentario}"</p>
    </div>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function Index() {
  const navigate = useNavigate();

  const especialidades = [
    {
      icon: "/src/assets/svg/icon_cores.svg",
      titulo: "CORES",
      descricao: "Tons vibrantes, naturais ou ousados — encontramos a cor perfeita para valorizar sua beleza."
    },
    {
      icon: "/src/assets/svg/icon_corte.svg",
      titulo: "CORTE",
      descricao: "Cortes personalizados que respeitam seu estilo, sua rotina e a textura natural dos fios."
    },
    {
      icon: "/src/assets/svg/icon_mechas.svg",
      titulo: "MECHAS",
      descricao: "Luzes, balayage ou morena iluminada: mechas com técnica e bom gosto para realçar seu brilho."
    }
  ];

  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    buscarAvaliacoes()
      .then(data => {
        setAvaliacoes(data);
      })
      .catch(error => {
        console.error("Erro ao carregar avaliações:", error);
      });
  }, []);

  const [infoSalao, setInfoSalao] = useState({});

  useEffect(() => {
    buscarInfoSalao()
      .then(data => {
        setInfoSalao(Array.isArray(data) ? data[0] || {} : data);
      })
      .catch(error => {
        console.error("Erro ao carregar informações do salão:", error);
      });
  }, []);

  return (
    <>
      <NavbarLandingPage />
      {/* Home */}
      <section className="home_section_pai">
        <div className="home_section_title">
          <div className="home_section_title_desc">
            <p className="super-titulo">Marina Mota Hair</p>
            <p className="paragrafo-2">
              Quando o assunto é auto cuidado, a Salon Time e Marina Motta são suas melhores amigas!
              Cadastre-se e agende seus serviços de beleza a qualquer hora, com praticidade e exclusividade,
              além de promoções temporárias imperdíveis!
            </p>
          </div>
          <div className="btn-juntos">
            <button className="btn-rosa" onClick={() => navigate("/")}>Saiba Mais</button>
            <button className="btn-branco" onClick={() => navigate("/servicos")}>Serviços</button>
          </div>
        </div>
        <div className="home_section_img">
          <img src="/src/assets/img/Group 51.png" alt="imgem de fundo" />
        </div>
      </section>

      {/* Especialidades */}
      <section className="especialidade_section_pai">
        <p className="especialidade_section_title">ESPECIALISTA EM</p>
        <div className="especialidade_section_container">
          {especialidades.map((esp, idx) => (
            <EspecialidadeCard key={idx} {...esp} />
          ))}
        </div>
      </section>

      {/* Portifólio] */}
      <section className="portifolio_section_pai">
        <p className="subtitulo portifolio_section_title"><a className="italic">Um pouco do meu trabalho!</a>😉</p>
        {/* <img src="/src/assets/img/portifolio_teste.png" alt="portifolio" /> */}
        <div className="instagram-embed-container">
          <InstagramEmbed url="https://www.instagram.com/p/DJR2xteJD8D" />
          <InstagramEmbed url="https://www.instagram.com/p/DKPQwvDxGsr" />
          <InstagramEmbed url="https://www.instagram.com/p/DK2h471JEgA" />
        </div>
        <a href="https://www.instagram.com/marinamotahair/" target="_blank" rel="noopener noreferrer">
          <button className="btn-rosa bold" style={{ height: "50px" }}>
            <img src="/src/assets/svg/icon_instagram.svg" alt="" style={{ height: "30px" }} />
            Veja mais!
          </button>
        </a>
      </section>


      {/* Sobre mim */}
      <section className="sobre_section_pai_1">
        <img src="/src/assets/img/marina_sobre_mim.png" alt="sobre-mim" style={{ height: "576px" }} />
        <div className="sobre_section_container">
          <p className="titulo-1" style={{ fontFamily: "Georgia" }}>Sobre Mim</p>
          <p className="paragrafo-2" style={{ maxWidth: "424px" }}>
            Olá! Sou a Marina Mota, cabeleireira com mais de 10 anos de experiência 
            atendendo mulheres na região do ABC Paulista. Acredito que 
            cada cabelo conta uma história, e meu trabalho é trazer à tona o melhor 
            de cada mulher, com cuidado, técnica e muito brilho! 💖
          </p>
          <p className="paragrafo-2 italic sobre_section_social">
            <img src="/src/assets/svg/icon_whatsapp 1.svg" alt="icon-zap" />
            {infoSalao.telefone || '(11) 98765-4321'}
          </p>
          <p className="paragrafo-2 italic sobre_section_social">
            <img src="/src/assets/svg/icon_instagram2.svg" alt="icon-insta" />
            @marinamotahair
          </p>
          <button
            className="btn-rosa"
            onClick={() => navigate("/servicos")}
          >
            <img src="/src/assets/vector/icon_sum/jam-icons/Vector.svg" alt="" />
            Agendar
          </button>
        </div>
      </section>



      <section className="sobre_section_pai_2">
        <div className="sobre_mim_title">
          <img src="/src/assets/img/marina_sobre_mim.png" alt="sobre-mim" style={{ height: "150px" }} />
          <p className="titulo-1" style={{ fontFamily: "Georgia", fontSize: "50px" }}>Sobre <br/> Mim</p>
        </div>
        <div className="sobre_section_container">
          <p className="paragrafo-2" style={{ maxWidth: "424px" }}>
            Olá! Sou a Marina Mota, cabeleireira com mais de 10 anos de experiência 
            atendendo mulheres na região do ABC Paulista. Acredito que 
            cada cabelo conta uma história, e meu trabalho é trazer à tona o melhor 
            de cada mulher, com cuidado, técnica e muito brilho! 💖
          </p>
          <p className="paragrafo-2 italic sobre_section_social">
            <img src="/src/assets/svg/icon_whatsapp 1.svg" alt="icon-zap" />
            {infoSalao.telefone || '(11) 98765-4321'}
          </p>
          <p className="paragrafo-2 italic sobre_section_social">
            <img src="/src/assets/svg/icon_instagram2.svg" alt="icon-insta" />
            @marinamotahair
          </p>
          <button
            className="btn-rosa"
            onClick={() => navigate("/servicos")}
          >
            <img src="/src/assets/vector/icon_sum/jam-icons/Vector.svg" alt="" />
            Agendar
          </button>
        </div>
      </section>

      {/* Localizacao */}
      <section className="section_local_pai">
        <div className="section_local_title">
          <p className="titulo-1" style={{ color: "var(--rosa-3)", fontFamily: "Georgia" }}>
            Localização do Salão
          </p>
          <div className="section_local_ender">
            <p className="paragrafo-2" style={{ color: "var(--rosa-3)" }}>
              {infoSalao.logradouro || 'R. Adamantina'}, {infoSalao.numero || '34'} - {infoSalao.complemento || 'apto 3'}
            </p>
            <p className="paragrafo-2 italic" style={{ color: "var(--rosa-2)" }}>
              {infoSalao.cidade || 'São Bernardo do Campo'} - {infoSalao.estado || 'SP'}
            </p>
          </div>
        </div>

        <div className="section_local_mapa">
          <div className="section_local_mapa_bar">
            <div className="section_local_circulo"></div>
            <div className="section_local_circulo"></div>
            <div className="section_local_circulo"></div>
          </div>
          <div className="section_local_mapa_google" id="map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.6253637830596!2d-46.5593502!3d-23.657927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce425d6f37e0cf%3A0x92b7fbb1e0c21678!2sR.%20Adamantina%2C%2034%20-%203%20-%20Baeta%20Neves%2C%20S%C3%A3o%20Bernardo%20do%20Campo%20-%20SP%2C%2009760-340!5e0!3m2!1spt-BR!2sbr!4v1692279080345!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "0px 0px 16px 16px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Avaliações */}
      <section className="avaliacao_section_pai" style={{ padding: "0px !important" }}>
        <p className="titulo-1">Avaliações:</p>
        <div className="avaliacao_section_carrossel">
          <div className="group">
            {avaliacoes.map((dado, idx) => (
              <AvaliacaoCard
                key={idx}
                nome={dado.nomeUsuario}
                data={dado.dataHorario}
                estrelas={dado.notaServico}
                servico={dado.nomeServico}
                comentario={dado.descricaoServico}
                imagem={dado.idUsuario}
              />
            ))}
          </div>
          <div className="group">
            {avaliacoes.map((dado, idx) => (
              <AvaliacaoCard
                key={idx}
                nome={dado.nomeUsuario}
                data={dado.dataHorario}
                estrelas={dado.notaServico}
                servico={dado.nomeServico}
                comentario={dado.descricaoServico}
                imagem={dado.idUsuario}
              />
            ))}
          </div>
        </div>
      </section>


      <BotpressChat/>

      {/* Footer */}
      <Footer />
    </>
  );
}


