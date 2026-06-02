const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_DATABASE || "usuario",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl:{
    rejectUnauthorized: false,
  }
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
  connection.release(); // libera a conexão para o pool
});

module.exports = pool;
