import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { parseCvContent } from "@/lib/pdf/parseCvContent";

function scaleFor(content: string) {
  const len = content.length;
  if (len > 2600) return { base: 8.5, heading: 10.5, sub: 9.5, gap: 8, bulletGap: 3 };
  if (len > 2000) return { base: 9, heading: 11.5, sub: 10, gap: 10, bulletGap: 3.5 };
  return { base: 9.75, heading: 12.5, sub: 10.75, gap: 12, bulletGap: 4 };
}

export function ResumeTemplateModern({ title, content }: { title: string; content: string }) {
  const { name, contact, blocks } = parseCvContent(content);
  const scale = scaleFor(content);

  const styles = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: scale.base, color: "#1A1D26" },
    sidebar: { width: 130, backgroundColor: "#12141C", padding: 22, color: "#FFFFFF", minHeight: "100%" },
    sidebarLabel: { fontSize: 7.5, color: "#C6FF3D", marginBottom: 4, letterSpacing: 1 },
    sidebarTitle: { fontSize: 15, fontFamily: "Helvetica-Bold", marginBottom: 10, lineHeight: 1.25 },
    sidebarContact: { fontSize: 8, color: "#B4C0F5", lineHeight: 1.6 },
    main: { flex: 1, padding: 26, lineHeight: 1.45 },
    accent: { width: 22, height: 3, backgroundColor: "#C6FF3D", marginBottom: 14 },
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
    bulletRow: { flexDirection: "row", marginBottom: scale.bulletGap },
    bulletDot: { width: 9, fontSize: scale.base },
    bulletText: { flex: 1 },
    paragraph: { marginBottom: scale.bulletGap },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarLabel}>CANDIDATURE</Text>
          <Text style={styles.sidebarTitle}>{name || title || "Curriculum Vitae"}</Text>
          {contact ? <Text style={styles.sidebarContact}>{contact.split(" · ").join("\n")}</Text> : null}
        </View>
        <View style={styles.main}>
          <View style={styles.accent} />
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
        </View>
      </Page>
    </Document>
  );
}
