//carregamento de módulos
const express = require('express');
const handlerbars = require('express-handlebars');
const bodyParser = require('body-parser');
const moment = require('moment');
const adminRoutes = require('./routes/admin');
const usuarioRoutes = require('./routes/usuario');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Postagem');
require('./models/Categoria')
const Postagem = mongoose.model('Postagens');
const Categoria = mongoose.model('Categorias');
const passport = require('passport');
require("./config/auth")(passport);
const db = require('./config/db');
const app = express();


//configurações
    //sessoes
    app.use(session({
        secret: "andrei",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash());

    //middleware

    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash("error_msg");        
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
    
    })    //body-parser
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    //handlerbars
    app.engine('handlebars', handlerbars({defaultLayout: 'main', helpers:{formatDate:(date) => {return moment(date).format('DD/MM/YYYY')}}}))
    app.set('view engine', 'handlebars');

    //mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect((db.mongoURI), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log("Conectado ao mongo");
        }).catch((err) => {
            console.log('Erro ao se conectar' + err);
        })
    
    //public
    app.use(express.static(path.join(__dirname, "public")));

//rotas

    app.get("/", (req, res) => {
        Postagem.find().populate('categoria').sort({data: 'desc'}).lean()
            .then(postagem =>{
                res.render('index', {postagem: postagem});
            })
            .catch((err) => {
                req.flash('error_msg', 'Não foi possivel exibir as postagens');
                res.redirect('/index');
            })
    })
    
    app.get('/404', (req, res) =>{
        res.send('Erro 404. Página não encontrada');
    })

    app.get('/postagem/:slug', (req, res) =>{
        Postagem.findOne({slug: req.params.slug}).lean()
            .then(postagem =>{
                res.render('postagem/index', {postagem: postagem});
            }).catch((err) =>{
                    console.log('deu ruim' + err);
            })
    })

    app.get('/categorias', (req, res) => {
        Categoria.find().lean()
            .then(categorias => {
                res.render('categoria/index', {categoria: categorias})
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao listar as categorias')
                res.redirect('/');
            })
    })

    app.get('/categorias/:slug', (req, res) =>{
        Categoria.findOne({slug: req.params.slug}).lean()
            .then(categoria => {
                if(categoria){
                    Postagem.find({categoria: categoria._id}).lean()
                    .then(postagens => {
                        res.render('categoria/postagens', {postagens: postagens, categoria: categoria})
                    }).catch((err) =>{
                        console.log(err)
                        req.flash('error_msg', 'Erro ao listar as postagens')
                        res.redirect('/');
                    })
                }else{
                    req.flash('error_msg', 'Essa categoria não existe');
                    res.redirect('/');
                }

            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao carregar a página desta categoria')
                res.redirect('/');
            })
    })

    app.use('/admin', adminRoutes);
    app.use('/usuario', usuarioRoutes);



//outros
const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log('Servidor rodando');
})

