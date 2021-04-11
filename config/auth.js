const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//usuario
require('../models/Usuario');
const Usuario = mongoose.model('Usuarios');

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        Usuario.findOne({email: email})
            .then(usuario => {
                if(!usuario){
                    return done(null, false, {message: 'Essa conta nao existe'})
                }

                bcrypt.compare(senha, usuario.senha, (erro, exito) => {
                    if(exito){
                        return done(null, usuario)
                        console.log('AAAAAAA');
                    }else{
                        return done(null, false, {message: 'Senha incorreta!'})
                    }
                })
            })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario);
        })
    })
}