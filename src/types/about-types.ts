export interface AboutTypes {
	id: number;
	title: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
	locale: string;
	name: string;
	resume: string;
	cover: ImageTypes;
	image: ImageTypes;
}

export interface ImageTypes {
	id: number;
	url: string;
	alternativeText: string;
	width: number;
	height: number;
}
