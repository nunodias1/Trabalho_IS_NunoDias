function fetchLivros() {
    fetch('/livros')
    .then(response => response.json())
    .then(livros => {
        const livrosList = document.getElementById('livrosList');
        livrosList.innerHTML = '';
        livros.forEach(livro => {
            let li = document.createElement('li');
            applyLiStyle(li); // Aplica os estilos ao 'li'

            li.innerHTML = `
                <p><strong>Título:</strong> ${livro.titulo}</p>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Ano de Publicação:</strong> ${livro.anoPublicacao}</p>
                ${livro.capa ? `<img src="/uploads/${livro.capa}" alt="Capa do Livro" style="width: 100px; height: 150px;">` : ''}
            `;

            livrosList.appendChild(li);
        });
    })
    .catch(error => console.error('Erro ao carregar livros:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('/')
    .then(response => response.json())
    .then(livros => {
        livros.forEach(livro => {
            // Usando document.write() para exibir cada título
            // Nota: document.write() é geralmente não recomendado; veja a explicação abaixo
            document.write("Título do Livro: " + livro.titulo + "<br>");
        });
    })
    .catch(error => console.error('Erro ao carregar livros:', error));
});
