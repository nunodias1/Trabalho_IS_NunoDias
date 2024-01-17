import { Database } from "sqlite";
import { Livro } from "../model/livro.model";



export class BibliotecaRepository {

    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async findLivros(titulo: string): Promise<Livro[]> {
        const params: string[] = [];
    
        let q = "SELECT * FROM livros WHERE 1=1";
    
        if (titulo) {
            q += ' AND autor LIKE ? OR titulo LIKE ? OR anoPublicacao LIKE ?';
            params.push(`%${titulo}%`);
            params.push(`%${titulo}%`);
            params.push(`%${titulo}%`);
        }
    
        const records = await this.db.all(q, ...params);
    
        return records.map((record): Livro => {
            return {
                id: record.id,
                autor: record.autor,
                titulo: record.titulo,
                anoPublicacao: record.anoPublicacao,
                capa: record.capa
            };
        });
    }


    async getLivrosById(id: number): Promise<Livro | null> {
        const record = await this.db.get("SELECT * FROM livros WHERE id = ?", id);

        return {
            id: record.id,
            autor: record.autor,
            titulo: record.titulo,
            anoPublicacao: record.anoPublicacao,
            capa: record.capa
        };
    }
    

    async addLivro(livro: Livro): Promise<number|undefined> {
        try {
            const result = await this.db.run(
                "INSERT INTO livros (titulo, autor, anoPublicacao, capa) VALUES (?, ?, ?, ?)",
                livro.titulo,
                livro.autor,
                livro.anoPublicacao,
                livro.capa
            );
    
            return result.lastID;
        } catch (error) {
            console.error("Erro ao adicionar livro:", error);
            // Dependendo da sua lógica de erro, você pode querer re-lançar o erro ou retornar undefined
            return undefined;
        }
    }

    async deleteLivro(livroId: number) {
        await this.db.run(
            "DELETE FROM livros WHERE id = ?",
            livroId
        )
    }


    async editLivros(id: number, titulo: string, autor: string, anoPublicacao: string): Promise<Livro[]> {
        const params: any[] = [];
    
        let q = "UPDATE livros SET";
    
        if (titulo) {
            q += ' titulo = ?,';
            params.push(titulo);
        }
    
        if (autor) {
            q += ' autor = ?,';
            params.push(autor);
        }
    
        if (anoPublicacao) {
            q += ' anoPublicacao = ?,';
            params.push(anoPublicacao);
        }
    
        // Remova a última vírgula, se houver
        q = q.replace(/,$/, '');
    
        // Adicione a cláusula WHERE
        q += ' WHERE id = ?';
        params.push(id);
    
        // Execute a consulta
        await this.db.run(q, ...params);
    
        // Recupere e retorne os registros atualizados
        const records = await this.db.all("SELECT * FROM livros WHERE id = ?", id);
    
        return records.map((record): Livro => {
            return {
                id: record.id,
                autor: record.autor,
                titulo: record.titulo,
                anoPublicacao: record.anoPublicacao,
                capa: record.capa
            };
        });
    }
    


}