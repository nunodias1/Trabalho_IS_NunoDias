import { Handler, Request, Response } from "express";
import { BibliotecaRepository } from "../repository/livro.repository";
import { Livro } from "../model/livro.model";


export class LivroController {

    private bibliotecaRepository: BibliotecaRepository;

    constructor(
        bibliotecaRepository: BibliotecaRepository,
    ) {
        this.bibliotecaRepository = bibliotecaRepository
    }

    findLivros(): Handler {
        return async (req: Request, res: Response) => {
            try {
                let { titulo } = req.body;
    
                const livros = await this.bibliotecaRepository.findLivros(titulo);
    
                
                console.log(titulo);
                

                res.status(200).json(livros);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }
    

    addLivro(): Handler {
        return async (req: Request, res: Response) => {
            try {
                const novoLivro: Livro = req.body;
                const novoLivroId = await this.bibliotecaRepository.addLivro(novoLivro);
    
                if (novoLivroId === undefined) {
                    return res.status(500).send("Erro ao adicionar livro");
                }
    
                // Redirecionar para a página inicial
                res.redirect('/');
            } catch (error) {
                console.error(error);
                res.status(500).send("Erro interno do servidor");
            }
        }
    }
    

    getLivrosById(): Handler {

        return async (req :Request, res: Response) => {

            try {
                const { id } = req.params;
                const livroId = parseInt(id, 10);
        
                const livro = await this.bibliotecaRepository.getLivrosById(livroId);
        
                if (!livro) {
                    return res.status(404).json({ error: 'Livro não encontrado' });
                }
        
                res.json(livro);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }

    deleteLivros(): Handler {

        return async (req :Request, res: Response) => {

            try {
                const { id } = req.params;
                const livroId = parseInt(id, 10);
        
                await this.bibliotecaRepository.deleteLivro(livroId);
        
                res.status(204).send(); // Resposta sem conteúdo, indicando sucesso
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }

        }
    }

    editLivros(): Handler {

        return async (req :Request, res: Response) => {

            try {
                const { id } = req.params;
                const livroId = parseInt(id, 10);
                const { titulo, autor, anoPublicacao } = req.body;
        
                const livrosAtualizados = await this.bibliotecaRepository.editLivros(livroId, titulo, autor, anoPublicacao);
        
                res.json(livrosAtualizados);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }

        }
    }
}
