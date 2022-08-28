import { defineConfig } from 'vitest/config';

export default defineConfig({
    "test": {
        "include": ['**/test/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', '**/test/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        "exclude": ['**/node_modules/**', '**/dist/**', 'build', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**'],
        "watchExclude": ['**/node_modules/**', '**/dist/**', 'build'],
    },
});
