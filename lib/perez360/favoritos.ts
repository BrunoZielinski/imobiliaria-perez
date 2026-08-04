export const CHAVE_FAVORITOS = "perez360:favoritos";

export const alternarFavorito = (atuais: string[], codigo: string) =>
  atuais.includes(codigo) ? atuais.filter((item) => item !== codigo) : [...atuais, codigo];

export const lerFavoritos = (valor: string | null) => {
  if (!valor) return [];
  try {
    const resultado: unknown = JSON.parse(valor);
    return Array.isArray(resultado) && resultado.every((item) => typeof item === "string")
      ? resultado
      : [];
  } catch {
    return [];
  }
};
