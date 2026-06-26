require("dotenv").config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

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

