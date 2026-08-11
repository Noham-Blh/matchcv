import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 10, color: "#1A1D26" },
  sidebar: { width: 130, backgroundColor: "#12141C", padding: 24, color: "#FFFFFF", minHeight: "100%" },
  sidebarLabel: { fontSize: 8, color: "#C6FF3D", marginBottom: 4, letterSpacing: 1 },
  sidebarTitle: { fontSize: 15, fontFamily: "Helvetica-Bold", marginBottom: 22, lineHeight: 1.3 },
  main: { flex: 1, padding: 30, lineHeight: 1.55 },
  paragraph: { marginBottom: 7 },
  accent: { width: 22, height: 3, backgroundColor: "#C6FF3D", marginBottom: 16 },
});

export function ResumeTemplateModern({
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
        <View style={styles.sidebar}>
          <Text style={styles.sidebarLabel}>CANDIDATURE</Text>
          <Text style={styles.sidebarTitle}>{title || "Curriculum Vitae"}</Text>
          <Text style={{ fontSize: 8, color: "#8A8F9E" }}>Optimisé avec MatchCV pour l&apos;offre ciblée.</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.accent} />
          {paragraphs.map((line, i) => (
            <Text key={i} style={styles.paragraph}>
              {line}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
