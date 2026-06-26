const mysql = require("mysql2");
require("dotenv").config();

console.log("========== VARIÁVEIS DO BANCO ==========");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("========================================");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
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

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:");
    console.error(err);
    return;
  }

  console.log("✅ Conectado ao MySQL com sucesso!");

  connection.release();
});

module.exports = pool;
