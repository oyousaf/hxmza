import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // This app fetches data with plain useEffect (no React Compiler / data
      // library), which is the canonical React "fetch on mount" pattern and
      // necessarily calls setState from effects. Treat as advisory, not a
      // hard error, rather than restructuring working code around it.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
