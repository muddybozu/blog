// 記事の型
export type Post = {
	title?: string;
	description?: string;
	updatedDate?: string;
	tags?: string[];
	published?: boolean;
	pinned?: boolean;
	slug?: string;
	content: string;
};
