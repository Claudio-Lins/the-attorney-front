import { CustomSection } from "@/components/custom/custom-section";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ServicesCards } from "./services-cards";

export function Services() {
	const t = useTranslations("HomeData");

	return (
		<CustomSection id="services" sectionColor container className="scroll-mt-24">
			<div className={cn("")}>
				<h2
					className={cn("text-4xl mb-8 font-bold text-white uppercase tracking-wide leading-tight md:text-5xl text-left")}
				>
					{t("servicesSectionData.title")}
				</h2>
				<ServicesCards />
			</div>
		</CustomSection>
	);
}
