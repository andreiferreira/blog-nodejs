const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
        required: true
    },

    descricao: {
        type: String,
        required: true
    },

    conteudo: {
        type: String,
        required: true
    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categorias',
        required: true
    },

    data: {
        type: Date,
        required: true,
        default: Date.now()
    }


})

mongoose.model('Postagens', Postagem)