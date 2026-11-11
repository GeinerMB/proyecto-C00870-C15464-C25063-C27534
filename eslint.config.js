import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  // No revisar dependencias ni archivos generados.
  {
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
  },

  // Reglas generales para todo el JavaScript del proyecto.
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      "no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Código que se ejecuta en el navegador.
  {
    files: ["src/**/*.{js,jsx}", "public/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // JSX y reglas de hooks de React.
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },

  // Servidor, herramientas y archivos de configuración.
  {
    files: [
      "servidor.js",
      "*.config.{js,mjs}",
      "scripts/**/*.{js,mjs}",
      "rutas/**/*.js",
      "controladores/**/*.js",
      "modelos/**/*.js",
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
];