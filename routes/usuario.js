const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('../models/Usuario');
const Usuario = mongoose.model("Usuarios");
const passport = require('passport');


router.get('/registro', (req, res) => {
    res.render('usuario/registro');
})

router.post('/registro', (req, res) => {
    var erros = [];

    if(!req.body.nome){
        erros.push({texto: 'Nome inválido!'})
    }

    if(!req.body.email){
        erros.push({texto: 'Email inválido!'})
    }

    if(!req.body.senha || !req.body.senha2){
        erros.push({texto: 'Senha inválida!'})
    }
    
    if(req.body.senha < 4){
        erros.push({texto: 'Senha muito curta!'})
    }

    

    if(req.body.senha != req.body.senha2 ){
        erros.push({texto: 'Senhas não conferem! Tente novamente.'})
    }

    if(erros.length > 0){
        res.render('usuario/registro', {erros: erros})
    }else{

        Usuario.findOne({email: req.body.email}).then((usuario) => {
                if(usuario){
                    req.flash("error_msg", "Esse email ja possui um cadastro no sistema!");
                    res.redirect("/usuario/registro");
                }else{
                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha,
                        ehAdmin: 1
                    })

                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                            if(erro){
                                console.log(erro);
                                req.flash('error_msg', 'Houve um erro durante o salvamento do usuário');
                                res.redirect('/');
                            }

                            novoUsuario.senha = hash;
                            
                                new Usuario(novoUsuario).save()
                                .then(() => {
                                    req.flash('success_msg', 'Usuario salvo com sucesso!');
                                    res.redirect('/');
                                }).catch((err) => {
                                    req.flash('error_msg', 'Não foi possivel salvar o usuário.');
                                    res.redirect('/usuario/registro');
                                })
                                    })
                                })
            

                }
            }).catch((err) =>{
                console.log(err);
                req.flash('error_msg', 'Houve um erro interno');
                res.redirect('/');
            })

    }
})


router.get('/login', (req, res) => {
    res.render('usuario/login')
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res, next)

})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'Deslogado com sucessso.');
    res.redirect('/');
})


module.exports = router;