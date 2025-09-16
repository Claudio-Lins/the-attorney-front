export interface SupabaseFile {
	name: string;
	id: string;
	updated_at: string;
	created_at: string;
	last_accessed_at: string;
	metadata: {
		eTag: string;
		size: number;
		mimetype: string;
		cacheControl: string;
		lastModified: string;
		contentLength: number;
		httpStatusCode: number;
	};
}

export interface DocumentResponse {
	error?: {
		message: string;
		statusCode: string;
	};
	data?: SupabaseFile[];
}
