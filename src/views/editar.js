document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let livroId = null /* Obter o ID do livro a ser editado */;
    let data = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        anoPublicacao: document.getElementById('anoPublicacao').value
    };

    fetch(`/editar/${livroId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            console.log('Livro atualizado com sucesso!');
            // Redirecionar ou atualizar a interface
        } else {
            console.error('Erro ao atualizar o livro');
        }
    });
});
