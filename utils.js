// Force the accept header to a certin value
module.exports.forceAccept = function(mimeType) {
    return function(req, res, next) {
        req.headers.accept = mimeType;
        next();
    };
};

// Google analytics
module.exports.ga = function(req, res, next) {
    // Ignore favicon requests
    if (req.path == "/favicon.ico") return next();

    req.visitor.pageview(req.vhost.hostname + req.path, function(err) {
        if (err) console.log(err);
    });
    next();
};

