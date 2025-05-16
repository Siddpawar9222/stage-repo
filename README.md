# vite-template-redux

Uses [Vite](https://vitejs.dev/), [Vitest](https://vitest.dev/), and [React Testing Library](https://github.com/testing-library/react-testing-library) to create a modern [React](https://react.dev/) app compatible with [Create React App](https://create-react-app.dev/)

```sh
npx degit reduxjs/redux-templates/packages/vite-template-redux my-app
```

## Goals

- Easy migration from Create React App or Vite
- As beginner friendly as Create React App
- Optimized performance compared to Create React App
- Customizable without ejecting

## Scripts

- `dev`/`start` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner

## Inspiration

- [Create React App](https://github.com/facebook/create-react-app/tree/main/packages/cra-template)
- [Vite](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react)
- [Vitest](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib)


*** Deployment ***

npm run deploy 

-- add cname file to ur gh-pages



Great! If you add this to your `package.json`:

```json
"scripts": {
  "dev": "vite",
  "dev:staging": "vite --mode staging",
  "build": "vite build --mode production",
  "preview": "vite preview"
}
```

---

### ✅ Commands to Run Each Environment

#### 1. **Run Development Environment**

```bash
npm run dev
```

👉 Uses `.env.development`

---

#### 2. **Run Staging Environment**

```bash
npm run dev:staging
```

👉 Uses `.env.staging`

---

#### 3. **Run Production Build Locally (Preview)**

First, **build** the production bundle:

```bash
npm run build
```

👉 Uses `.env.production` and creates a `dist/` folder.

Then, **preview** the built app locally:

```bash
npm run preview
```



To **run your React + Vite app in production**, you need to **build** it and then **serve** the built files.

Here's how to do it step by step:

---

### ✅ 1. Build for Production

Use this command:

```bash
npm run build
```

This runs:

```bash
vite build --mode production
```

It creates an optimized build in the `dist/` folder using `.env.production`.

---

### ✅ 2. Preview Locally (Optional)

If you want to preview the production build locally:

```bash
npm run preview
```

This runs:

```bash
vite preview
```

It starts a local server and serves the `dist/` folder as if it's in production.

---

### ✅ 3. Deploy to a Production Server

You can now deploy the contents of the `dist/` folder to any static file hosting service like:

* **Vercel**
* **Netlify**
* **GitHub Pages**
* **AWS S3 + CloudFront**
* **Nginx/Apache (self-hosted server)**

Just copy the `dist/` folder contents and host them.

---


