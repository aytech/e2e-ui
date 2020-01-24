DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT  PRIMARY KEY,
  activation_code VARCHAR (100),
  email VARCHAR (250) NOT NULL,
  password VARCHAR (250) NOT NULL,
  session VARCHAR (250),
  live INT NOT NULL DEFAULT 0,
  created TIMESTAMP,
  deleted INT NOT NULL DEFAULT 0
);

INSERT INTO users (email, password) VALUES
  ('oleg.yapparov@infor.com', 'test');