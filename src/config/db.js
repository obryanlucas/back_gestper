const mysql = require("mysql2");
require("dotenv").config();

// ===============================
// DEBUG DAS VARIÁVEIS DE AMBIENTE
// ===============================
console.log("========== ENV ==========");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "********" : "NÃO DEFINIDA");
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("=========================");

// ===============================
// CONEXÃO COM O MYSQL
// ===============================
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ===============================
// TESTE DA CONEXÃO
// ===============================
pool.getConnection((err, connection) => {
  if (err) {
    console.error("==================================");
    console.error("ERRO AO CONECTAR NO MYSQL");
    console.error(err);
    console.error("==================================");
    return;
  }

  console.log("==================================");
  console.log("✅ Conectado ao banco MySQL!");
  console.log("==================================");

  connection.release();
});

module.exports = pool;
