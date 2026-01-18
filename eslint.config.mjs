import hono from "@hono/eslint-config";
import globals from "globals";

export default [
    {
        ignores: ["node_modules/", "dist/", ".bun/", "coverage/", "src/docs/"]
    },
    ...hono,
    {
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "n/no-missing-import": "off",

            // Disable strict type-checking rules that cause too many errors in existing codebase
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/restrict-plus-operands": "off",
            "@typescript-eslint/prefer-nullish-coalescing": "off",
            "@typescript-eslint/no-base-to-string": "off",

            // Project specific patterns
            "@typescript-eslint/no-extraneous-class": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "import-x/order": "off",
            "@typescript-eslint/require-await": "off"
        }
    }
];
