import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { SchemaTypeDefinition } from "sanity";

import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "default",
  title: "Explorush",

  projectId: "rmcbvfwf",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Website Tour Settings")
              .id("websiteTourSettings")
              .child(
                S.document()
                  .schemaType("websiteTourSettings")
                  .documentId("websiteTourSettings")
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "websiteTourSettings"
            ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes as SchemaTypeDefinition[],
  },
});