// This is the configuration file for ESLint, the TypeScript linter:
// https://eslint.org/docs/latest/use/configure/

/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    // The linter base is the IsaacScript mod config:
    // https://github.com/IsaacScript/isaacscript/blob/main/packages/eslint-config-isaacscript/mod.js
    "eslint-config-isaacscript/mod",
  ],

  parserOptions: {
    // ESLint needs to know about the project's TypeScript settings in order for TypeScript-specific
    // things to lint correctly. We do not point this at "./tsconfig.json" because certain files
    // (such at this file) should be linted but not included in the actual project output.
    project: "./tsconfig.eslint.json",
  },

  rules: {
    // Insert changed or disabled rules here, if necessary.

    // @template-customization-start

    // All classes in this mod are internal only, so there is no need for method modifiers.
    "no-restricted-syntax": [
      "error",
      {
        selector: "MethodDefinition[accessibility='public']",
        message: 'Using "public" class method modifiers are not allowed.',
      },
      {
        selector: "MethodDefinition[accessibility='private']",
        message: 'Using "private" class method modifiers are not allowed.',
      },
      {
        selector: "MethodDefinition[accessibility='protected']",
        message: 'Using "protected" class method modifiers are not allowed.',
      },
    ],

    // @template-customization-end
  },
};

module.exports = config;
