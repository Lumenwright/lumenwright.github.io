# Minimalist Portfolio SPA

A simple single-page application built with React and Bootstrap.

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

Deployment is handled automatically by GitHub Actions on every push to `main`. No manual deploy step needed.

## Features

- Responsive design with Bootstrap
- Single-page navigation with smooth scrolling
- Sections: Home, About, Projects, Contact

## Customization

Edit `src/App.tsx` to update content and `src/App.css` for styling.

---

## Troubleshooting

### `npm install` fails with peer dependency errors

Run `npm install` without any flags. This project uses Vite instead of Create React App, so there are no React version peer dependency conflicts.

If you see errors related to `react-scripts`, make sure it has been fully removed from `package.json` — it should not appear in `dependencies` or `devDependencies`.

### `npm start` opens a blank page

Check the browser console for errors. Common causes:

- **Missing root element** — `index.html` at the project root must have `<div id="root"></div>` and `<script type="module" src="/src/index.tsx"></script>`.
- **`public/index.html` still exists** — delete it. Vite serves from the root `index.html`; a copy in `public/` will overwrite the built output.

### `npm run build` fails

- **TypeScript errors** — run `npx tsc --noEmit` to see type errors without building. Fix any reported issues before retrying.
- **Missing module** — if Vite can't resolve an import, check that the file path and extension are correct. Vite is case-sensitive on all platforms.
- **JSON import errors** — ensure `resolveJsonModule: true` is set in `tsconfig.json`.

### Styles are missing after build

- CSS Modules files must be named `*.module.css`. Plain `.css` files are imported globally and should be imported directly in the component or `index.tsx`.
- Check that `vite.config.ts` is present at the project root and includes the React plugin.

