export type CvBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "bullet"; text: string }
  | { type: "paragraph"; text: string };

export interface ParsedCv {
  name: string;
  contact: string;
  blocks: CvBlock[];
}

export function serializeCvContent(parsed: ParsedCv): string {
  const lines: string[] = [parsed.name];
  if (parsed.contact) lines.push(parsed.contact);
  lines.push("");

  for (const block of parsed.blocks) {
    if (block.type === "heading") lines.push(`## ${block.text}`);
    else if (block.type === "subheading") lines.push(`### ${block.text}`);
    else if (block.type === "bullet") lines.push(`- ${block.text}`);
    else lines.push(block.text);
  }

  return lines.join("\n");
}

/**
 * Analyse le texte du CV généré (qui suit la convention imposée dans le
 * prompt Claude : nom sur la ligne 1, coordonnées ligne 2, "## " pour les
 * sections, "### " pour les postes/formations, "- " pour les puces) afin de
 * pouvoir le mettre en page proprement dans le PDF, avec une vraie hiérarchie
 * visuelle plutôt qu'un simple bloc de texte.
 *
 * Reste tolérant : si jamais le texte ne suit pas exactement la convention
 * (contenu modifié à la main par l'utilisateur, ancienne génération...),
 * les lignes non reconnues sont simplement traitées comme des paragraphes.
 */
export function parseCvContent(content: string): ParsedCv {
  const lines = content.split("\n").map((l) => l.trim());
  const nonEmpty = lines.filter((l) => l.length > 0);

  const name = nonEmpty[0] || "";
  const secondLine = nonEmpty[1] || "";
  // La ligne 2 est traitée comme les coordonnées seulement si elle ne ressemble
  // pas déjà à un titre de section ou à un poste.
  const hasContactLine = secondLine && !secondLine.startsWith("#");
  const contact = hasContactLine ? secondLine : "";

  const bodyStartIndex = lines.findIndex((l) => l === nonEmpty[hasContactLine ? 2 : 1]);
  const bodyLines = bodyStartIndex >= 0 ? lines.slice(bodyStartIndex) : [];

  const blocks: CvBlock[] = [];
  for (const line of bodyLines) {
    if (!line) continue;
    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", text: line.slice(3).trim() });
    } else if (line.startsWith("### ")) {
      blocks.push({ type: "subheading", text: line.slice(4).trim() });
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      blocks.push({ type: "bullet", text: line.slice(2).trim() });
    } else {
      blocks.push({ type: "paragraph", text: line });
    }
  }

  return { name, contact, blocks };
}
