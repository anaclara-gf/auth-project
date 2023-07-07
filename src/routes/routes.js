const bcrypt = require("bcrypt");
const express = require("express");
const config = require("../config/settings");
const generateToken = require("../utils/generateToken");
const verifyToken = require("../middleware/verifyToken");

const User = require("../models/user");

const router = express.Router();

router.post("/users", (req, res) => {
  bcrypt.hash(req.body.senha, config.bcrypt_salt, (err, result) => {
    if (err) {
      return res.status(500).send({ output: `Erro ao gerar a senha: ${err}` });
    }

    req.body.senha = result;

    const userData = new User(req.body);
    userData
      .save()
      .then(() =>
        res.status(201).send({ message: "Usuário cadastrado com sucesso" })
      )
      .catch((erro) =>
        res.status(400).send({ erro: `Erro ao tentar cadastrar ${erro}` })
      );
  });
});

router.get("/users/:id", verifyToken, (_, res) => {
  User.find()
    .select("-senha")
    .then((dados) => {
      res.status(200).send({ resultado: dados });
    })
    .catch((erro) => {
      res.status(400).send({
        erro: `Ocorreu um erro durante o processamento da requisição ${erro}`,
      });
    });
});

router.get("/users/:id", verifyToken, (req, res) => {
  User.findById(req.params.id)
    .select("-senha")
    .then((dados) => {
      res.status(200).send({ resultado: dados });
    })
    .catch((erro) => {
      res.status(400).send({
        erro: `Ocorreu um erro durante o processamento da requisição ${erro}`,
      });
    });
});

router.post("/login", (req, res) => {
  const nomeusuario = req.body.nomeusuario;
  const senha = req.body.senha;
  User.findOne({ nomeusuario })
    .then((result) => {
      if (!result) {
        return res.status(404).send({ output: "Usuário não encontrado" });
      }
      bcrypt
        .compare(senha, result.senha)
        .then((passwordResult) => {
          if (!passwordResult) {
            return res
              .status(400)
              .send({ output: "Usuário ou senha incorretos" });
          }

          const token = generateToken(result._id, result.usuario, result.email);
          res.status(200).send({ output: "Autenticado com sucesso", token });
        })
        .catch((err) =>
          res.status(500).send({ output: `Erro ao processar dados: ${err}` })
        );
    })
    .catch((err) =>
      res.status(500).send({ output: `Erro ao tentar efetuar o login: ${err}` })
    );
});

router.put("/users/changePassword/:id", verifyToken, (req, res) => {
  if (req.body.senha) {
    bcrypt.hash(req.body.senha, config.bcrypt_salt, (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ output: `Erro ao gerar a senha: ${err}` });
      }

      User.findByIdAndUpdate(req.params.id, { senha: result }, { new: true })
        .then((result) => {
          if (!result) {
            return res.status(400).send({
              message: "Não foi possível atualizar a senha do usuário",
            });
          }
          res.status(200).send({
            message: `Você atualizou com sucesso a senha do usuário com id ${req.params.id}!`,
          });
        })
        .catch((error) => {
          res
            .status(500)
            .send({ message: `Erro ao processar a solicitação: ${error}` });
        });
    });
  } else {
    res.status(400).send({ message: "É preciso mandar o parâmetro senha" });
  }
});

router.use((_, res) => {
  res.type("application/json");
  res.status(404).send("404 - Not Found");
});

module.exports = router;
