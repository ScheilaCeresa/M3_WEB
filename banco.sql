const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "senha",
    database: "dividas_db"
});

CREATE DATABASE IF NOT EXISTS dividas_db
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;
    
USE dividas_db;

CREATE TABLE dividas (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    email VARCHAR(120) NOT NULL,
    cep VARCHAR(20),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    valor DECIMAL(10,2) NOT NULL,
    objeto TEXT NOT NULL,
    situacao VARCHAR(20) NOT NULL,
    processo VARCHAR(100),
    comprovante VARCHAR(255)
);

SELECT * FROM dividas;

DESCRIBE dividas;




