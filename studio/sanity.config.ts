import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { SchemaTypeDefinition } from "sanity";

import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "default",
  title: "Explorush",

  projectId: "rmcbvfwf",
  dataset: "production",

  plugins: [structureTool()],

  schema: {
    types: schemaTypes as SchemaTypeDefinition[],
  },
});