const jwt = require("jsonwebtoken");
const config = require("../config/settings");

function verifyToken(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).send({
      output: "Não existe token, realize o processo de autenticação",
    });
  }

  jwt.verify(token, config.jwt_secret, (err, result) => {
    if (err) {
      return res.status(500).send({ output: `Erro interno => ${err}` });
    }
    req.content = {
      id: result.idusuario,
      nomeusuario: result.nomeusuario,
      email: result.email,
    };
    return next();
  });
}

module.exports = verifyToken;
