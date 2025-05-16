
# Deploying Vite + React  Project on GitHub Pages (Stage and Production Environment)

A modern **React + Redux** template using [Vite](https://vitejs.dev/).

## 🔧 Requirements

* **Node.js** version `>=18`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Siddpawar9222/stage-repo
```

### 2. Go to Project Directory

```bash
cd stage-repo
```

### 3. Install Dependencies

```bash
npm install
```

---

## 🧪 Run Project in Different Environments

### 1. Run Development Environment

```bash
npm run dev
```

👉 Uses `.env` file (default mode is `development`)

---

### 2. Run Staging Environment

```bash
npm run dev:stage
```

👉 Uses `.env.stage`

---

### 3. Run Production Environment (Development Mode)

```bash
npm run dev:prod
```

👉 Uses `.env.prod`

---

## 📦 Build and Preview for Stage

### 1. Build Staging Bundle

```bash
npm run build:stage
```

👉 Uses `.env.stage` and creates the `dist/` folder.

To preview the **staging build** locally after building:

```bash
npm run preview:stage
```

This will start a local server to serve the contents of the `dist/` folder.

### 2. Build Production Bundle

```bash
npm run build:prod
```

👉 Uses `.env.prod` and creates the `dist/` folder.


To preview the **production build** locally after building:

```bash
npm run preview:prod
```

This will start a local server to serve the contents of the `dist/` folder.

---


