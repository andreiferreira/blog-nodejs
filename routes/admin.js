const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categoria");
const Categoria = mongoose.model("Categorias");
require('../models/Postagem');
const Postagem = mongoose.model('Postagens');
const {ehAdmin} = require('../helpers/ehAdmin');

router.get('/', ehAdmin, (req, res) => {
    res.render('admin/index');   
})

router.get('/posts', ehAdmin, (req, res) => {
})

router.get('/categorias', ehAdmin, (req, res) => {
    Categoria.find().lean().then((categoria) => {
        res.render('admin/categorias', {categoria: categoria});
    }).catch((err) => {
        console.log('Nao foi posivel caterizar')
    })
})

router.get('/categorias/edicao/:id', ehAdmin, (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean()
        .then(categoria => {
            res.render('admin/editCategorias', {categoria: categoria});
        }).catch((err) => {
            req.flash('error_msg', 'Esta categoria não existe!')
            res.redirect('/admin/categorias')
        })
})

router.post('/categorias/edicao', ehAdmin, (req, res) => {
    Categoria.findOne({_id: req.body.id})
    .then(categoria => {
        categoria.nome = req.body.nome,
        categoria.slug = req.body.slug
        
        categoria.save()
            .then(() => {
                req.flash('success', 'Categoria editada com sucesso.')
                res.redirect('/admin/categorias');
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao salvar a categoria');
                res.redirect('/admin/categorias');
            })

    }).catch((err) => {
        req.flash('error_msg', 'Houver um erro ao editar a categoria')
        res.redirect("/admin/categorias");
    })
})

router.post('/categorias/excluir', ehAdmin, (req, res) => {
    Categoria.deleteOne({_id: req.body.id})
        .then(() => {
            req.flash('success_msg', 'Categoria excluida com sucesso');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possivel excluir a categoria');
            res.redirect('/admin/categorias');
        })
})

router.post('/categorias/add', ehAdmin, (req, res) => {

    var erros = [];

    if(!req.body.nome){
        erros.push({mensagem: "Nome da categoria invalida"})
    }

    if(req.body.nome.length < 2){
        erros.push({mensagem: 'Nome da categoria muito curta!'})
    }

    if(!req.body.slug){
        erros.push({mensagem: 'Slug da categoria inválido!'})
    }

    if(req.body.slug.length < 2){
        erros.push({mensagem: 'Slug da categoria muito curta!'})
    }

    if(erros.length > 0){
        res.render('admin/addCategorias', {erros: erros});

    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save()
            .then(() => {
                req.flash("success_msg", "Categoria criada com sucesso");
                res.redirect("/admin/categorias");
            })
            .catch((err) => {
                req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente.");
                res.redirect('/admin');
            })
    }

})

router.get('/categorias/add', ehAdmin, (req, res) => {
    res.render('admin/addCategorias');
})


router.get('/postagens', ehAdmin, (req, res) => {
    Postagem.find().populate("categoria").sort({date: "desc"}).lean()
        .then(postagem => {
            res.render('admin/postagens', {postagem: postagem});
        }).catch((err) => {
            console.log('que q aconteceeeuuu' + err);
        })
    
})

router.get('/postagens/add', ehAdmin, (req, res) => {
    Categoria.find().lean()
        .then(categorias => {
            res.render('admin/addPostagem', {categoria: categorias})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro no formulario')
            req.redirect('admin/');
        })
})

router.post('/postagens/add', ehAdmin, (req, res) => {

    var erros = []

    if(req.body.categoria === '0'){
        erros.push({text: 'Categoria inválida, registre uma nova categoria'});
    }

    if(erros.length > 0){
        res.render('admin/postagens/add', {erros: erros})
    }
    const novaPostagem = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    }

    new Postagem(novaPostagem).save()
        .then(() => {
            req.flash('success_msg', 'Postagem salva com sucesso')
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível salvar a mensagem');
            res.redirect('/admin/postagens');
        })
})

router.get('/postagens/edit/:id', ehAdmin, (req, res) => {
    
    Postagem.findOne({_id: req.params.id}).lean()
        .then(postagem =>{
            Categoria.find().lean()
                .then(categoria =>{
                    res.render('admin/editPostagem', {categoria: categoria, postagem: postagem})
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao listar as categorias');
                    res.redirect('/admin/postagens');
                })
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao carregar o formulario de edição');
            res.redirect('/admin/postagens');
        })
})

router.post('/postagem/edit', ehAdmin, (req, res) => {
    Postagem.findOne({_id: req.body.id})
        .then(postagem => {

            postagem.titulo = req.body.titulo,
            postagem.slug = req.body.slug,
            postagem.descricao = req.body.descricao,
            postagem.conteudo = req.body.descricao,
            postagem.categoria = req.body.categoria

            postagem.save()
                .then(() =>{
                    console.log('bbbb')
                    req.flash('success_msg', 'Postagem editada com sucesso!');
                    res.redirect('/admin/postagens');
                })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possivel editar a postagem');
            res.redirect('/admin/postagens');
        }).catch((err) => {
            console.log('aaaa')
        })

})


router.post('/postagem/exclusao', ehAdmin, (req, res) =>{
    Postagem.deleteOne({_id: req.body.id})
        .then(() => {
            req.flash('success_msg', 'Postagem apagada com sucesso!')
            res.redirect('/admin/postagens');
        }).catch((err) =>{
            req.flash('error_msg', 'Não foi possivel excluir a postagem')
            res.redirect('/admin/postagens');
        })
    })
module.exports = router;