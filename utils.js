// Force the accept header to a certin value
module.exports.forceAccept = function(mimeType) {
    return function(req, res, next) {
        req.headers.accept = mimeType;
        next();
    };
};

