"use client";
import { CustomImage } from "@/components/custom/custom-image";
import { CustomSection } from "@/components/custom/custom-section";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export function AboutSection() {
	const t = useTranslations("HomeData");
	return (
		<CustomSection id="about" container className="bg-white scroll-mt-24">
			<div className={cn("grid grid-cols-1 gap-8 items-center md:grid-cols-2 bg-white")}>
				<div className={cn("relative")}>
					<div className={cn("w-full h-[500px] rounded-lg overflow-hidden", " ")}>
						<Image
							src={t("aboutSectionData.aboutImage")}
							alt={t("aboutSectionData.aboutImageAlt")}
							className="object-cover object-right w-full h-full shadow-lg"
							quality={100}
							width={1000}
							height={1000}
						/>
					</div>
					<div className={cn("absolute right-4 -bottom-10  overflow-hidden", " ")}>
						<Image
							src={t("aboutSectionData.aboutOrdemImage")}
							alt={t("aboutSectionData.aboutOrdemImageAlt")}
							className="object-contain object-center"
							width={80}
							height={100}
							quality={100}
						/>
					</div>
				</div>
				<div className={cn("space-y-8", "lg:w-4/5")}>
					<h2 className={cn("text-4xl font-bold text-zinc-950 uppercase tracking-wide leading-tight", "md:text-5xl")}>
						{t("aboutSectionData.name")}
					</h2>
					<ScrollArea className={cn("h-[200px]")}>
						<div className={cn("text-zinc-950 text-lg leading-relaxed prose text-justify", " ")}>
							<ReactMarkdown>{t("aboutSectionData.description")}</ReactMarkdown>
						</div>
					</ScrollArea>
					<div className={cn("w-full")}>
						<Button variant="default" className="flex flex-row items-center justify-center gap-2">
							<Mail size={24} />
							{t("aboutSectionData.buttonText")}
						</Button>
					</div>
				</div>
			</div>
		</CustomSection>
	);
}
