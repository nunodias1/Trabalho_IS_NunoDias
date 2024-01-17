//const express = require("express");
//import { connectDatabase, migrate } from "./persistence/database.js";

import express from "express";
import path from "path";
import multer from "multer";
import { LivroController } from "./controller/livro.controller";
import database from "./persistance/database";
import { BibliotecaRepository } from "./repository/livro.repository";


(async () => {
    console.log("💾 Connecting to database");
    const db = await database.connectDatabase();

    console.log("🏃 Executing migrations");
    await database.migrate(db);

    console.log("📚 Initializing repositories");
    const bibliotecaRepository = new BibliotecaRepository(db);

    console.log("🚪 Initializing controllers");
    const livroController = new LivroController(bibliotecaRepository);

    console.log("🔨 Configuring express");
    const api: express.Express = express();
    const port: number = 3000;
    api.use(express.json());

    console.log("Configurar Multer");
    const upload = multer({ dest: 'uploads/' });
    api.use(express.urlencoded({ extended: true }));

    console.log("🧭 Registering routes");
    // Após a configuração do Express
    // Antes das rotas
    api.use(express.static('/views/index.html'));
    api.use('/uploads', express.static('uploads'));
    api.get("/", (req, res) => {res.sendFile(path.join(__dirname, '/views', 'index.html'));});
    api.post("/", livroController.findLivros());
    api.get("/", livroController.getLivrosById());
    api.post("/editar", livroController.editLivros());
    api.post("/adicionar", upload.single('capa'), livroController.addLivro());
    api.delete("/livro/:livroId", livroController.deleteLivros());
    api.get("/", async (req, res) => {
        try {
            const livros = await bibliotecaRepository.findLivros("");
            res.json(livros);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    });
    

    console.log("✈️ Starting express");
    api.listen(port, () => {
        console.log(`💡 Express JS listening on port ${port}`);
    });
})().catch(err => {
    console.error("An error occurred:", err);
});