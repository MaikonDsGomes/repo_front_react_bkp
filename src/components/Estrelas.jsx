export default function Estrelas({
  quantidade = 0,
  max = 5,
  filledSrc = "/src/assets/svg/icon_star_filled.svg",
  outlineSrc = "/src/assets/svg/icon_star_outline.svg",
  size = 16,
  className = "",
}) {
  const itens = [];
  for (let i = 1; i <= max; i++) {
    const filled = i <= quantidade;
    itens.push(
      <img
        key={i}
        src={filled ? filledSrc : outlineSrc}
        alt={filled ? "estrela preenchida" : "estrela vazia"}
        style={{ width: size, height: size }}
      />
    );
  }
  return <div className={`estrelas ${className}`.trim()}>{itens}</div>;
}