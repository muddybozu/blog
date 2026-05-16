import type { Post } from '$lib/types';
import matter from 'gray-matter';

export async function getPosts(): Promise<Post[]> {
	let posts: Post[] = [];

	// マークダウンファイルの中身をただの文字列として取得し、パスをキーとした一覧オブジェクトを取得する
	const paths = import.meta.glob('$posts/*.md', { eager: true, query: '?raw', import: 'default' });

	for (const path in paths) {
		const rawContent = paths[path] as string;

		// ファイル名をスラッグとして扱う
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (rawContent && slug) {
			// マークダウンファイルを解析し、フロントマターと本文を取得
			const { data, content } = matter(rawContent);

			const post = {
				...data,
				slug,
				content
			} as Post;

			if (post.published) {
				posts.push(post);
			}
		}
	}

	posts = posts.sort((a, b) => {
		// ピン留めを優先
		if (a.pinned !== b.pinned) {
			return a.pinned ? -1 : 1;
		}

		// 更新日を降順にソート
		const dateA = a.updatedDate ? new Date(a.updatedDate).getTime() : 0;
		const dateB = b.updatedDate ? new Date(b.updatedDate).getTime() : 0;

		return dateB - dateA;
	});

	return posts;
}
