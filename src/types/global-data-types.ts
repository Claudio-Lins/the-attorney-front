export interface GlobalDataTypes {
	id: number;
	documentId: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
	locale: string;
	header: HeaderTypes;
}

export interface HeaderTypes {
	id: number;
	logoPos: LogoNegTypes;
	logoNeg: LogoNegTypes;
	nav: NavTypes;
}

export interface LogoNegTypes {
	id: number;
	documentId: string;
	url: string;
	alternativeText: null;
	width: number;
	height: number;
}

export interface NavTypes {
	id: number;
	link: LinkTypes[];
}

export interface LinkTypes {
	id: number;
	url: string;
	text: string;
	isExternal: boolean;
	role: string;
	icon: LogoNegTypes | null;
}
