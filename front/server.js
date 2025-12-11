const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve os arquivos do seu site (pasta public)
app.use(express.static(path.join(__dirname, 'public')));

// Rota mágica que salva os dados no arquivo seeders.js
app.post('/api/save-seeders', (req, res) => {
    const dados = req.body;

    // Transforma os dados em formato de código JavaScript
    const conteudoArquivo = `export const initialData = ${JSON.stringify(dados, null, 2)};`;
    
    // Caminho onde está o seu seeders.js
    const caminhoArquivo = path.join(__dirname, 'public', 'js', 'database', 'seeders.js');

    // Escreve no disco
    fs.writeFile(caminhoArquivo, conteudoArquivo, (err) => {
        if (err) {
            console.error('Erro ao salvar:', err);
            return res.status(500).json({ error: 'Erro ao salvar arquivo' });
        }
        console.log('Dados salvos com sucesso em seeders.js!');
        res.json({ success: true });
    });
});

app.listen(3000, () => {
    console.log('✅ Servidor rodando! Acesse: http://localhost:3000');
});