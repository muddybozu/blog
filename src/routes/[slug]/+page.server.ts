import { parseMarkdown } from '$lib/server/markdown';
import { getPosts } from '$lib/posts';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const posts = await getPosts();
	const post = posts.find((item) => item.slug === params.slug);

	if (!post) throw error(404, '指定された記事は存在しません。');

	const html = await parseMarkdown(post.content);

	return {
		post: {
			...post,
			content: html
		}
	};
};
