import { Model } from '../models/Model.js';

const models = {
    usuarios: new Model('usuarios'),
    contatos: new Model('contatos'),
    dispositivos: new Model('dispositivos')
};

// Simula delay de rede para parecer real
const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export async function create(resource, data) {
    await delay();
    if (models[resource]) {
        return models[resource].create(data);
    }
    throw new Error(`Recurso ${resource} não encontrado.`);
}

export async function read(resource) {
    await delay();
    if (models[resource]) {
        return Promise.resolve(models[resource].getAll());
    }
    return Promise.resolve([]);
}

export async function update(resource, id, data) {
    await delay();
    if (models[resource]) {
        return models[resource].update(id, data);
    }
    throw new Error(`Recurso ${resource} não encontrado.`);
}