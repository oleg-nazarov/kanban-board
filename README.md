## Kanban Board

Minimal single-page Kanban board built with **Next.js + TypeScript**. It ships three fixed columns (Todo, In Progress, Done), supports drag & drop via the native HTML5 DnD API, and persists all tasks in `localStorage`, which makes it ready for instant deployment to Vercel.

### Features

- Add new tasks (title + optional description) into the Todo column.
- Drag any card between columns — no third-party DnD libraries used.
- Delete tasks via the inline “×” action.
- Automatic persistence to `localStorage` under the `kanban-board` key.
- Responsive layout: columns sit side‑by‑side on desktop, stack on small screens.

### Tech Stack

- [Next.js 15 (App Router)](https://nextjs.org/)
- React functional components + hooks
- TypeScript with strict typing for board data
- CSS Modules for component-scoped styling

### Development

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

Deploy the output to Vercel or any Node-compatible host. No environment variables are required because persistence uses the browser’s `localStorage`.
