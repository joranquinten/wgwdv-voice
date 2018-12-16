const TokenProtected = {
  validateWebhookSecret(req, res, next) {
    const token = req.headers["wgwdv-secret"];
    if (token !== process.env.wgwdv_secret) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    } else {
      next();
    }
  }
};

module.exports = TokenProtected;
