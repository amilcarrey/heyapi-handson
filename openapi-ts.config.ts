import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://earn.turtle.xyz/v1/docs/openapi.json',
  output: {
    path: './src/client',
    format: 'prettier',
  },
  plugins: [
    '@hey-api/client-fetch',
    '@hey-api/sdk',
    '@hey-api/typescript',
  ],
});
