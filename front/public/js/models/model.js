import { initialData } from '../database/seeders.js';

export class Model {
    constructor(collectionName) {
        this.collection = collectionName;
        this.initialize();
    }

    initialize() {
        const storedData = localStorage.getItem('techsync_db');
        if (!storedData) {
            localStorage.setItem('techsync_db', JSON.stringify(initialData));
        }
    }

    getDb() {
        return JSON.parse(localStorage.getItem('techsync_db'));
    }

    saveDb(data) {
        // 1. Salva no LocalStorage (para acesso imediato e offline)
        localStorage.setItem('techsync_db', JSON.stringify(data));

        // 2. Tenta salvar no arquivo físico (seeders.js) através do nosso servidor
        fetch('http://localhost:3000/api/save-seeders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) console.log("Backup salvo em seeders.js");
            else console.warn("Erro ao salvar no disco.");
        })
        .catch(error => {
            // Se o servidor estiver desligado, não quebra o site, apenas avisa
            console.warn("Servidor offline. Dados salvos apenas no navegador.");
        });
    }

    getAll() {
        const db = this.getDb();
        return db[this.collection] || [];
    }

    create(item) {
        const db = this.getDb();
        // Gera ID aleatório
        const newItem = { 
            id: Math.random().toString(36).substr(2, 9), 
            ...item 
        };

        if (!db[this.collection]) {
            db[this.collection] = [];
        }

        db[this.collection].push(newItem);
        this.saveDb(db);
        
        return Promise.resolve(newItem);
    }

    update(id, data) {
        const db = this.getDb();
        const collection = db[this.collection] || [];
        
        const index = collection.findIndex(item => item.id === id);
        
        if (index !== -1) {
            // Atualiza apenas os campos enviados (merge)
            collection[index] = { ...collection[index], ...data };
            db[this.collection] = collection;
            this.saveDb(db);
            return Promise.resolve(collection[index]);
        } else {
            return Promise.reject(new Error('Item não encontrado'));
        }
    }
}