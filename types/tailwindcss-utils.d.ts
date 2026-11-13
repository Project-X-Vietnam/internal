// `tailwindcss/lib/util/*` ships no type declarations; this covers the one
// helper tailwind.config.ts imports.
declare module "tailwindcss/lib/util/flattenColorPalette" {
  const flattenColorPalette: (colors: Record<string, unknown>) => Record<string, string>;
  export default flattenColorPalette;
}
