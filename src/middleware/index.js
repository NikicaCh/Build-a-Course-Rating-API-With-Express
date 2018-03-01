function loggedOut(req, res, next) {
    if(req.session && req.session.UserId) {
        res.redirect('/api/users');
    } else {
        next();
    }
}
function requiresLogin(req, res, next) {
    if(req.session && req.session.UserId) {
        next();
    } else {
        let err = new Error('You must be logged in to view this page');
        err.status = 401;
        next(err);
    }
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;