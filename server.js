const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('bibliotecaLivros.db');

// Configurar o multer para lidar com uploads de imagens
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Criar a tabela 'livros' se não existir, incluindo o campo 'capa'
db.run(`CREATE TABLE IF NOT EXISTS livros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT,
  autor TEXT,
  anoPublicacao INTEGER,
  capa TEXT
)`);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  db.all('SELECT * FROM livros', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.render('index', { livros: rows });
  });
});

// ...

app.post('/pesquisar', (req, res) => {
  const termoPesquisa = req.body.termoPesquisa;

  // Modifique esta consulta de acordo com suas necessidades
  const query = `
    SELECT * FROM livros
    WHERE autor LIKE ? OR titulo LIKE ? OR anoPublicacao LIKE ?;
  `;

  // Utiliza placeholders para evitar injeção de SQL
  db.all(query, [`%${termoPesquisa}%`, `%${termoPesquisa}%`, `%${termoPesquisa}%`], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.render('index', { livros: rows });
  });
});

app.post('/adicionar', upload.single('capa'), (req, res) => {
  const { titulo, autor, anoPublicacao } = req.body;

  // Obter o nome do arquivo da capa do livro
  const capa = req.file ? req.file.filename : null;

  db.run('INSERT INTO livros (titulo, autor, anoPublicacao, capa) VALUES (?, ?, ?, ?)', [titulo, autor, anoPublicacao, capa], (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.redirect('/');
  });
});

app.post('/apagar/:id', (req, res) => {
  const idLivro = req.params.id;

  db.run('DELETE FROM livros WHERE id = ?', [idLivro], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.redirect('/');
  });
});

app.get('/editar/:id', (req, res) => {
  const idLivro = req.params.id;

  db.get('SELECT * FROM livros WHERE id = ?', [idLivro], (err, livro) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.render('editar', { livro });
  });
});

app.post('/editar/:id', (req, res) => {
  const idLivro = req.params.id;
  const { titulo, autor, anoPublicacao } = req.body;

  db.run('UPDATE livros SET titulo = ?, autor = ?, anoPublicacao = ? WHERE id = ?', [titulo, autor, anoPublicacao, idLivro], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.redirect('/');
  });
});

app.post('/pesquisar', (req, res) => {
  const termoPesquisa = req.body.termoPesquisa;

  // Modifique esta consulta de acordo com suas necessidades
  const query = 'SELECT * FROM livros WHERE autor LIKE ? OR titulo LIKE ? OR anoPublicacao = ?';

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.render('index', { livros: rows });
  });
});

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});


