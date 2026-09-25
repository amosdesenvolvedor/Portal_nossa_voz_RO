const blockedPatterns = [
  /acidente/i,
  /crime/i,
  /pris[aã]o/i,
  /opera[cç][aã]o policial/i,
  /manifesta[cç][aã]o/i,
  /desastre/i,
  /pessoa espec[ií]fica/i,
  /evid[eê]ncia/i,
  /prova/i,
  /pol[ií]tica/i,
];

export function isBlockedEditorialImagePrompt(prompt: string): boolean {
  const text = prompt.trim();
  if (!text) {
    return true;
  }

  return blockedPatterns.some((pattern) => pattern.test(text));
}
