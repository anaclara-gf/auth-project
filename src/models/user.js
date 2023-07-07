const mongoose = require("../database/connection");

const schema = new mongoose.Schema({
  nomeusuario: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  senha: { type: String, required: true },
  nomecompleto: { type: String, required: true },
  telefone: { type: String, required: true },
  dataCadastro: { type: Date, default: Date.now },
});

const User = mongoose.model("user", schema);
module.exports = User;
