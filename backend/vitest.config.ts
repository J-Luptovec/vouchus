import { defineConfig } from 'vitest/config';
import { TEST_JWT_SECRET } from './tests/helpers/constants';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    fileParallelism: false,
    env: {
      DATABASE_URL: 'postgresql://vouchus:vouchus@localhost:5432/vouchus_test',
      JWT_SECRET: TEST_JWT_SECRET,
      PORT: '3001',
      CORS_ORIGIN: 'http://localhost:4200',
    },
    globalSetup: './tests/setup/global-setup.ts',
    setupFiles: ['./tests/setup/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts'],
    },
  },
});
