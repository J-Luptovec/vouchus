import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  { ignores: ['dist/', 'generated/'] },
  tseslint.configs.recommended,
  prettier,
);
