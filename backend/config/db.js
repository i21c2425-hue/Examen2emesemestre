// Connexion a la base de donnees
// Pour l'instant en local, faudra changer les infos une fois deployes
// (ou juste utiliser le .env, plus propre)

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_commandes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// export direct en version "promise" pour pouvoir utiliser async/await
// dans les controllers plutot que des callbacks partout
module.exports = pool.promise();
