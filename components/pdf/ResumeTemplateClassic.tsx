import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { parseCvContent } from "@/lib/pdf/parseCvContent";

// Ajuste automatiquement la taille du texte selon la longueur du contenu,
// pour que le CV tienne sur une seule page A4 même si la génération est
// un peu plus longue que prévu.
function scaleFor(content: string) {
  const len = content.length;
  if (len > 2600) return { base: 8.75, heading: 11.5, sub: 9.75, gap: 9, bulletGap: 3 };
  if (len > 2000) return { base: 9.25, heading: 12.5, sub: 10.25, gap: 11, bulletGap: 3.5 };
  return { base: 10, heading: 13.5, sub: 11, gap: 13, bulletGap: 4 };
}

export function ResumeTemplateClassic({ title, content }: { title: string; content: string }) {
  const { name, contact, blocks } = parseCvContent(content);
  const scale = scaleFor(content);

  const styles = StyleSheet.create({
    page: { padding: 42, fontSize: scale.base, fontFamily: "Helvetica", color: "#1A1D26", lineHeight: 1.45 },
    header: { marginBottom: 16, borderBottom: "2pt solid #12141C", paddingBottom: 10 },
    name: { fontSize: 21, fontFamily: "Helvetica-Bold", marginBottom: 3 },
    subtitle: { fontSize: scale.base - 0.5, color: "#4C5162" },
    heading: {
      fontSize: scale.heading,
      fontFamily: "Helvetica-Bold",
      color: "#2E3FB0",
      marginTop: scale.gap,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    subheading: { fontSize: scale.sub, fontFamily: "Helvetica-Bold", marginTop: 5, marginBottom: 2 },
    bulletRow: { flexDirection: "row", marginBottom: scale.bulletGap, paddingLeft: 2 },
    bulletDot: { width: 10, fontSize: scale.base },
    bulletText: { flex: 1 },
    paragraph: { marginBottom: scale.bulletGap },
    footer: { position: "absolute", bottom: 20, left: 42, right: 42, fontSize: 7.5, color: "#8A8F9E", textAlign: "center" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{name || title || "Curriculum Vitae"}</Text>
          {contact ? <Text style={styles.subtitle}>{contact}</Text> : null}
        </View>

        {blocks.map((block, i) => {
          if (block.type === "heading") return <Text key={i} style={styles.heading}>{block.text}</Text>;
          if (block.type === "subheading") return <Text key={i} style={styles.subheading}>{block.text}</Text>;
          if (block.type === "bullet")
            return (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>—</Text>
                <Text style={styles.bulletText}>{block.text}</Text>
              </View>
            );
          return <Text key={i} style={styles.paragraph}>{block.text}</Text>;
        })}

        <Text style={styles.footer} fixed>
          Document généré via matchcv.fr
        </Text>
      </Page>
    </Document>
  );
}
