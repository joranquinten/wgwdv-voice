const ErrorHandlers = {
  clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: "Something failed!" });
    } else {
      next(err);
    }
  },
  errorHandler(err, req, res, next) {
    res.status(500);
    res.render("error", { error: err });
  }
};

module.exports = ErrorHandlers;
