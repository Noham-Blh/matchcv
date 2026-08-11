import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 42, fontSize: 10.5, fontFamily: "Helvetica", color: "#1A1D26", lineHeight: 1.5 },
  header: { marginBottom: 18, borderBottom: "2pt solid #12141C", paddingBottom: 12 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  subtitle: { fontSize: 10, color: "#4C5162" },
  paragraph: { marginBottom: 6, whiteSpace: "pre-wrap" },
  footer: { position: "absolute", bottom: 24, left: 42, right: 42, fontSize: 8, color: "#8A8F9E", textAlign: "center" },
});

export function ResumeTemplateClassic({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const paragraphs = content.split("\n").filter((l) => l.trim().length > 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{title || "Curriculum Vitae"}</Text>
          <Text style={styles.subtitle}>Généré et optimisé avec MatchCV</Text>
        </View>

        {paragraphs.map((line, i) => (
          <Text key={i} style={styles.paragraph}>
            {line}
          </Text>
        ))}

        <Text style={styles.footer} fixed>
          Document généré via matchcv.app
        </Text>
      </Page>
    </Document>
  );
}
