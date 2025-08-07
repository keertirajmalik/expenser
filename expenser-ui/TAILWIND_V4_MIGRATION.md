# Tailwind CSS v4 Migration Guide

This document outlines the migration from Tailwind CSS v3 to v4 for the Expenser UI project.

## What Changed

### 1. CSS-First Configuration
- **Before**: Used `tailwind.config.js` for configuration
- **After**: Configuration is done directly in CSS using `@theme` directive

### 2. Simplified Installation
- **Before**: Required `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`
- **After**: Single `@import "tailwindcss";` statement

### 3. Native CSS Features
- **Before**: Used HSL color values with CSS custom properties
- **After**: Uses modern OKLCH color space for better color accuracy and gamut

### 4. Built-in Tooling
- **Before**: Required PostCSS, Autoprefixer, and manual configuration
- **After**: Built-in CSS processing with Lightning CSS integration

### 5. Automatic Content Detection
- **Before**: Manual `content` array configuration
- **After**: Automatic discovery of template files (can be customized with `@source`)

## Files Changed

### Added Files
- `TAILWIND_V4_MIGRATION.md` - This migration guide

### Modified Files
- `vite.config.ts` - Added `@tailwindcss/vite` plugin
- `src/index.css` - Complete rewrite using v4 syntax
- `package.json` - Added `@tailwindcss/vite` dependency

### Removed Files
- `tailwind.config.js` - No longer needed
- `postcss.config.js` - Built into Tailwind v4
- `autoprefixer` and `postcss` packages - Built into Tailwind v4

## Key Benefits of v4

### Performance Improvements
- **Full builds**: Up to 5x faster
- **Incremental builds**: Over 100x faster (measured in microseconds)
- **New high-performance engine**: Complete architectural rewrite

### Modern CSS Features
- **OKLCH color space**: Better color accuracy and wider gamut support
- **Cascade layers**: Better CSS organization and specificity control
- **Native CSS custom properties**: Better browser compatibility

### Developer Experience
- **Automatic content detection**: No manual configuration of template paths
- **Built-in import support**: No additional bundling tools needed
- **First-party Vite integration**: Optimized for Vite projects

## Color System Migration

The color system has been migrated from HSL to OKLCH format:

### Before (HSL)
```css
--primary: 346.8 77.2% 49.8%;
--background: 0 0% 100%;
```

### After (OKLCH)
```css
--color-primary: oklch(64.13% 0.238 343.37);
--color-background: oklch(100% 0 0);
```

## Usage in Components

Component usage remains the same - all existing Tailwind classes work as expected:

```jsx
// This works the same in both v3 and v4
<div className="bg-primary text-primary-foreground p-4 rounded-lg">
  Content
</div>
```

## Dark Mode

Dark mode is handled using CSS class selectors to work with your existing `next-themes` setup:

```css
.dark {
    --color-background: hsl(20 14.3% 4.1%);
    --color-foreground: hsl(0 0% 95%);
    /* ... other dark mode colors */
}
```

This approach works with your existing `ThemeProvider` that adds `.dark` and `.light` classes to the document root, ensuring proper theme switching functionality.

## Custom Configurations

If you need to add custom configurations, use the `@theme` directive:

```css
@theme {
    /* Custom breakpoints */
    --breakpoint-3xl: 1920px;

    /* Custom fonts */
    --font-display: "Satoshi", sans-serif;

    /* Custom colors */
    --color-brand: oklch(65% 0.2 340);
}
```

## Source Path Configuration

If you need to include additional source paths, use `@source`:

```css
@import "tailwindcss";
@source "../components/**/*.tsx";
@source "../lib/**/*.ts";
```

## Troubleshooting

### Build Errors
If you encounter build errors:
1. Ensure you're using the latest version of Tailwind CSS v4
2. Check that the Vite plugin is properly configured
3. Verify that all old configuration files have been removed

### Missing Styles
If styles are missing:
1. Check that your template files are being detected automatically
2. Add explicit `@source` directives if needed
3. Verify color variable names match the new format

### Dark Mode Issues
If dark mode is not working properly:
1. Ensure your theme provider is adding the correct CSS classes (`.dark`, `.light`)
2. Check that color variables are defined outside of `@theme` blocks for class-based overrides
3. Verify that your theme switching logic is compatible with the new CSS structure

### Browser Compatibility
Tailwind CSS v4 uses modern CSS features but degrades gracefully:
- HSL colors maintain excellent browser compatibility
- Cascade layers are ignored in unsupported browsers
- Custom properties work in all modern browsers

## Next Steps

1. Test your application thoroughly in different browsers
2. Update any custom CSS that references the old color variables
3. Consider leveraging new v4 features like:
   - Container queries (`@container`)
   - 3D transforms
   - Text shadows (v4.1+)
   - CSS masks (v4.1+)

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [Migration from v3 to v4](https://tailwindcss.com/docs/v4-beta#migrating-from-v3)
- [OKLCH Color Picker](https://oklch.com/)
- [Tailwind CSS v4.1 Features](https://tailwindcss.com/blog/tailwindcss-v4-1)
