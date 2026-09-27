exports.isAuth = function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/messages');
};

exports.isNotAuth = function isNotAuth(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('messages');
};