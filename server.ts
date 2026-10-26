import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Serve built frontend assets
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/projects', express.static(path.join(__dirname, 'public/projects')));

// Health checks for container orchestration and Cloud Run
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'kc-nexus', time: new Date().toISOString() });
});

// SPA Fallback: all routes resolve to index.html for direct URLs and browser refreshes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start listening unconditionally on all interfaces (0.0.0.0)
app.listen(port, '0.0.0.0', () => {
  console.log(`KC NEXUS application serving on http://0.0.0.0:${port}`);
});

export default app;
