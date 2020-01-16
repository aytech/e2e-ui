DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT  PRIMARY KEY,
  email VARCHAR (250) NOT NULL,
  password VARCHAR (250) NOT NULL,
  ip VARCHAR (250) NOT NULL,
  session VARCHAR (250) NOT NULL
);

INSERT INTO users (email, password) VALUES
  ('oleg.yapparov@infor.com', 'test');