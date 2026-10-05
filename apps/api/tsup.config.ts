import { defineConfig } from 'tsup';
export default defineConfig({ noExternal: ['@finances/contracts'], clean: true });
