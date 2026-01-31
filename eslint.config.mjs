import coreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: ["playwright-report/**", "test-results/**"],
  },
  ...coreWebVitals,
];

export default eslintConfig;
