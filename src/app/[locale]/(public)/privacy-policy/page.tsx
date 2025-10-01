import { getTranslations } from "next-intl/server"
import { PrivacyPolicyClient } from "./client"

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy" })

  return {
    title: `${t("title")} - The Attorney`,
    description: t("sections.introduction.content").substring(0, 160),
  }
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />
}
