"use client";
import { CustomSection } from "@/components/custom/custom-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function HeroSection() {
	// const locale = await getLocale();
	// const heroSectionData = await getHeroSectionData(locale);
	const t = useTranslations("HomeData");
	return (
		<CustomSection id="hero" sectionColor className={cn("relative overflow-hidden scroll-mt-0 pt-0", "md:p-0")}>
			<div className={cn("absolute inset-0", "md:hidden")}>
				<Image
					src={t("heroSectionData.heroImage")}
					alt={t("heroSectionData.heroImageAlt")}
					className="object-cover object-center w-full h-full opacity-40"
					quality={100}
					width={1000}
					height={1000}
				/>
			</div>
			<div className={cn(" h-full relative")}>
				<article className={cn("w-full grid grid-cols-1 gap-8 min-h-[100dvh]", "md:grid-cols-2")}>
					<div className={cn("px-4 space-y-8 h-full flex flex-col justify-center py-20", "md:pl-20")}>
						<h1 className={cn("text-5xl font-bold text-white uppercase tracking-wide leading-tight", "md:text-5xl")}>
							{t("heroSectionData.name")}
						</h1>
						<div className="flex gap-2 items-center justify-start">
							<div className="w-20 h-1 bg-blue-500" />
							<p className="text-white">{t("heroSectionData.title")}</p>
						</div>
						<p className="text-white text-lg text-balance tracking-wide">{t("heroSectionData.description")}</p>
						<div className="flex w-full gap-4">
							<Button variant="default" className="flex flex-row items-center justify-center gap-2">
								<MessageCircle size={24} />
								{t("heroSectionData.buttonText")}
							</Button>
							{/* <Button>Descubra Mais</Button> */}
						</div>
					</div>
					<div className={cn("hidden relative", "md:block h-full w-full bg-blue-800")}>
						<Image
							src={t("heroSectionData.heroImage")}
							alt={t("heroSectionData.heroImageAlt")}
							className="object-cover object-center w-full h-full"
							quality={100}
							width={1000}
							height={1000}
						/>
					</div>
				</article>
			</div>
		</CustomSection>
	);
}
