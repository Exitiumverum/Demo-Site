/**
 * Store template configurations
 * TODO: Expand this when implementing multiple store templates
 */
export const storeTemplates = {
  default: {
    name: "Default Template",
    description: "Clean and modern storefront design",
    // Future: add template-specific styling, layout options, etc.
  },
} as const;

export type StoreTemplate = keyof typeof storeTemplates;

