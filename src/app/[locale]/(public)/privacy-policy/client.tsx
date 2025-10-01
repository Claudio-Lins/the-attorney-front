"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"

export function PrivacyPolicyClient() {
  const t = useTranslations("PrivacyPolicy")

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Title Section */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">{t("title")}</h1>
            <span className="text-sm text-muted-foreground">
              {t("lastUpdated")}: {new Date().toLocaleDateString()}
            </span>
          </div>

          {/* Content Card */}
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-10">
                {/* 1. Introduction */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.introduction.title")}</h2>
                  <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {t("sections.introduction.content")}
                  </p>
                </section>

                <Separator />

                {/* 2. Data Collected */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.dataCollected.title")}</h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">{t("sections.dataCollected.intro")}</p>
                  <ul className="space-y-3">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <li key={index} className="flex gap-3">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <div>
                          <span className="font-medium text-foreground">
                            {t(`sections.dataCollected.items.${index}.label`)}:
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {t(`sections.dataCollected.items.${index}.text`)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <Separator />

                {/* 3. Purposes */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.purposes.title")}</h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">{t("sections.purposes.intro")}</p>
                  <ol className="space-y-2">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <li key={index} className="flex gap-3 text-muted-foreground">
                        <span className="font-medium text-foreground">{index + 1}.</span>
                        <span>{t(`sections.purposes.items.${index}`)}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <Separator />

                {/* 4. Legal Basis */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.legalBasis.title")}</h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">{t("sections.legalBasis.intro")}</p>
                  <ul className="space-y-2">
                    {[0, 1, 2, 3].map((index) => (
                      <li key={index} className="flex gap-3 text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{t(`sections.legalBasis.items.${index}`)}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <Separator />

                {/* 5. Data Sharing */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.dataSharing.title")}</h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">{t("sections.dataSharing.intro")}</p>
                  <ul className="space-y-2">
                    {[0, 1, 2].map((index) => (
                      <li key={index} className="flex gap-3 text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{t(`sections.dataSharing.items.${index}`)}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <Separator />

                {/* 6. Data Retention */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.dataRetention.title")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("sections.dataRetention.content")}</p>
                </section>

                <Separator />

                {/* 7. Rights */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.rights.title")}</h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">{t("sections.rights.intro")}</p>
                  <ul className="mb-4 space-y-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                      <li key={index} className="flex gap-3 text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{t(`sections.rights.items.${index}`)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">{t("sections.rights.footer")}</p>
                </section>

                <Separator />

                {/* 8. Security */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.security.title")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("sections.security.content")}</p>
                </section>

                <Separator />

                {/* 9. Cookies */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.cookies.title")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("sections.cookies.content")}</p>
                </section>

                <Separator />

                {/* 10. Contact */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.contact.title")}</h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">{t("sections.contact.intro")}</p>
                  <div className="rounded-lg border border-border/50 bg-muted/30 p-6">
                    <p className="mb-2 font-semibold text-foreground">{t("sections.contact.officeName")}</p>
                    <p className="mb-1 text-sm text-muted-foreground">{t("sections.contact.address")}</p>
                    <p className="mb-1 text-sm text-muted-foreground">{t("sections.contact.email")}</p>
                    <p className="text-sm text-muted-foreground">{t("sections.contact.phone")}</p>
                  </div>
                </section>

                <Separator />

                {/* 11. Authority */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.authority.title")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("sections.authority.content")}</p>
                </section>

                <Separator />

                {/* 12. Changes */}
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">{t("sections.changes.title")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("sections.changes.content")}</p>
                </section>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} The Attorney. Todos os direitos reservados.
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
