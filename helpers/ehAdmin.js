module.exports = {
    ehAdmin: function(req, res ,next) {
        if(req.isAuthenticated() && req.user.ehAdmin == 1) {
            console.log('vc é admin bacana')
            return next();
        }
        console.log('vc nao é admin')
        req.flash('error_msg', 'Você precisa ser um administrador para acessar essa página!');
        res.redirect('/');
    }
}