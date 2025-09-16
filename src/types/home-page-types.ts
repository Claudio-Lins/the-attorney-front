export interface HomePageTypes {
	id: number;
	documentID: string;
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
	locale: string;
	blocks: Block[];
}

export interface Block {
	component: string;
	id: number;
	name?: string;
	title: string;
	description?: null | string;
	heroImage?: ImageTypes;
	cta?: CtaTypes;
	resume?: string;
	aboutImage?: ImageTypes;
	ordenImage?: ImageTypes;
	serviceCard?: ServiceCard[];
}

export interface ImageTypes {
	id: number;
	documentID: string;
	url: string;
	alternativeText: null;
	width: number;
	height: number;
}

export interface CtaTypes {
	id: number;
	text: null | string;
	href: null | string;
	isExterna: boolean;
	whatsAppMessage: null | string;
}

export interface ServiceCard {
	id: number;
	title: string;
	description: string;
	whatsAppMessage: CtaTypes;
	topics: Topic[];
}

export interface Topic {
	id: number;
	topic: string;
}

type ComponentTypes = "blocks.hero-section" | "blocks.about-section" | "blocks.service-section";

interface Base<T extends ComponentTypes, D extends object = Record<string, unknown>> {
	component: T;
	id: number;
	name?: string;
	title: string;
	description?: string;
	heroImage?: ImageTypes;
	cta?: CtaTypes;
	resume?: string;
	aboutImage?: ImageTypes;
	ordenImage?: ImageTypes;
	serviceCard?: ServiceCard[];
}

export interface HeroSectionTypes extends Base<"blocks.hero-section"> {
	component: "blocks.hero-section";
}

export interface AboutSectionTypes extends Base<"blocks.about-section"> {
	component: "blocks.about-section";
}

export interface ServiceSectionTypes extends Base<"blocks.service-section"> {
	component: "blocks.service-section";
}
