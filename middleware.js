exports.isAuth = function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next();

    if (req.route.path === '/new') req.session.route = '/new';
    res.redirect('/user/login');
};

exports.isNotAuth = function isNotAuth(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('messages');
};