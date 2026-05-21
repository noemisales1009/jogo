import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve images and backgrounds explicitly
app.use('/src/assets/images', express.static(path.join(__dirname, 'src', 'assets', 'images')));
app.use('/src/assets/backgrounds', express.static(path.join(__dirname, 'src', 'assets', 'backgrounds')));

// Serve everything else from project root
app.use(express.static(__dirname));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
