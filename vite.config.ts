import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
				silenceDeprecations: ['import'],
				prependData: `@import 'src/lib/components/common/styles/colors.new.scss';`
			}
		}
	},
	plugins: [tailwindcss(),sveltekit()]
});
