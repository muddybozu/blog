import svelteParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';
import globals from 'globals';

export default tseslint.config(
	// 基本的なJS/TSルール
	...tseslint.configs.recommended,
	// Svelte専用ルール
	...sveltePlugin.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tseslint.parser
			},
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'svelte/no-navigation-without-resolve': 'off' // href="/"を許容
		}
	},
	{
		languageOptions: {
			globals: globals.node
		}
	},
	{
		ignores: ['build/', 'dist/', '.svelte-kit/']
	}
);
