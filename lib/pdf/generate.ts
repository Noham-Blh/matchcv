import { pdf } from "@react-pdf/renderer";
import { ResumeTemplateClassic } from "@/components/pdf/ResumeTemplateClassic";
import { ResumeTemplateModern } from "@/components/pdf/ResumeTemplateModern";

export async function downloadAsPdf(
  content: string,
  title: string,
  template: "classic" | "modern",
  filename: string,
  photoUrl?: string | null,
  themeId?: string | null
) {
  const doc =
    template === "modern"
      ? ResumeTemplateModern({ title, content, photoUrl, themeId })
      : ResumeTemplateClassic({ title, content, photoUrl, themeId });

  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
