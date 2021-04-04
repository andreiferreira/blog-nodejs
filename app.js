//carregamento de módulos
const express = require('express');
const handlerbars = require('express-handlebars');
const bodyParser = require('body-parser');
//const mongoose = require('mongoose');

const app = express();


//configurações
    //body-parser
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    //handlerbars
    app.engine('handlebars', handlerbars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    
//rotas

//outros
const PORT = 8081
app.listen(PORT, () => {
    console.log('Servidor rodando');
})

