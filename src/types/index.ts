export interface ImageTypes {
	id: number;
	documentID: string;
	url: string;
	alternativeText: string;
	width: number;
	height: number;
}

export interface CtaTypes {
	id: number;
	text: string;
	href: string | null;
	isExterna: boolean;
	whatsAppMessage: string | null;
}

export interface HeroSectionTypes {
	id: number;
	locale: string;
	name: string;
	title: string;
	description: string;
	heroImage: ImageTypes;
	cta: CtaTypes;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
}

export interface AboutSectionTypes {
	id: number;
	documentID: string;
	title: string;
	name: string;
	resume: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
	locale: string;
	aboutImage: ImageTypes;
	ordemImage: ImageTypes;
	cta: CtaTypes;
}

export interface ServicesSectionTypes {
	id: number;
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
	locale: string;
	serviceCard: ServiceCard[];
}

export interface ServiceCard {
	id: number;
	title: string;
	description: string;
	whatsAppMessage: WhatsAppMessage;
	topics: Topic[];
}

export interface Topic {
	id: number;
	topic: string;
}

export interface WhatsAppMessage {
	id: number;
	text: string;
	href: string | null;
	isExterna: boolean;
	whatsAppMessage: string | null;
}

// Faqs
export interface FaqsSectionTypes {
	id: number;
	idSection: string;
	locale: string;
	title: string;
	description: string;
	subject: Subject[];
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
}

export interface Subject {
	id: number;
	title: string;
	faqs: FAQ[];
}

export interface FAQ {
	id: number;
	question: string;
	answer: string;
	cta: CtaTypes;
}

// Testimonials
export interface TestimonialSectionTypes {
	id: number;
	title: string;
	description: string;
	locale: string;
	approved: boolean;
	testimonial: Testimonial[];
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
}

export interface Testimonial {
	id: number;
	name: string;
	testimonial: string;
	nationality: string;
	testimonialsImage: ImageTypes;
}

// Global
export interface GlobalTypes {
	id: number;
	siteName: string;
	siteDescription: string;
	locale: string;
	favicon: ImageTypes;
	defaultSEO: DefaultSEO;
	header: HeaderTypes;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
}

export interface DefaultSEO {
	id: number;
	metaTitle: string;
	metaDescription: string;
	shareImage: ImageTypes;
}

export interface HeaderTypes {
	id: number;
	logo: Logo;
	navigation: Navigation[];
}

export interface Logo {
	id: number;
	logoText: string;
	image: ImageTypes;
	imageNeg: ImageTypes;
	imagePos: ImageTypes;
}

export interface Navigation {
	id: number;
	text: string;
	href: string | null;
	isExterna: boolean;
	whatsAppMessage: string | null;
	anchor: string | null;
}
