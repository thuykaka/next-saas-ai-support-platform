# Echo Widget Embed

A customer support chat widget that can be embedded into your website.

## Features

- Floating chat widget with customizable position
- Easy integration with a single line of code
- Responsive design
- Customizable position (bottom-right, bottom-left)
- Multi-organization support

## Installation

### Using CDN

Add the script tag to your website's `<head>` or end of `<body>`:

```html
<script
  src="https://your-domain.com/echo-widget.iife.js"
  data-org-id="your-organization-id"
  data-position="bottom-right"
></script>
```

### Configuration Parameters

- `data-org-id` (required): Your organization ID
- `data-position` (optional): Widget position (`bottom-right` or `bottom-left`), defaults to `bottom-right`

## Development

### Requirements

- Node.js 18+
- pnpm

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Server will run at `http://localhost:3002`

### Build for Production

```bash
pnpm build
```

Build file will be created in `dist/` directory as `echo-widget.iife.js`

### Preview Build

```bash
pnpm preview
```

## Demo

Run demo to test the widget:

```bash
pnpm dev
```

Then open `http://localhost:3002` to view the demo.

## Project Structure

```
src/
├── config.ts      # Default configuration
├── embed.ts       # Main widget logic
├── icons.ts       # SVG icons
└── index.html     # Demo page

demo/
└── index.html     # Demo with controls

dist/
└── echo-widget.iife.js  # Production build file
```

## Customization

### Change Widget URL

Update `VITE_WIDGET_URL` in `src/config.ts`:

```typescript
export const EMBED_CONFIG = {
  WIDGET_URL: 'https://your-widget-domain.com'
  // ...
};
```

### Change Default Position

```typescript
export const EMBED_CONFIG = {
  DEFAULT_POSITION: 'bottom-left' as const
  // ...
};
```

## Notes

- Widget automatically creates a floating button and iframe container
- Z-index is set high (999999) to ensure display above other elements
- Widget is responsive and will automatically adjust size on mobile
- Valid `data-org-id` is required for widget to function
