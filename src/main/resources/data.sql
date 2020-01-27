DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id                INT             AUTO_INCREMENT  PRIMARY KEY,
  activation_code   VARCHAR (100),
  email             VARCHAR (250)   UNIQUE          NOT NULL,
  password          VARCHAR (250)   NOT NULL,
  role              VARCHAR (250)   NOT NULL,
  enabled           INT             NOT NULL        DEFAULT 0,
  created           TIMESTAMP,
  deleted           INT             NOT NULL        DEFAULT 0
);

CREATE TABLE settings (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    user    INT NOT NULL
);

ALTER TABLE settings
    ADD CONSTRAINT user_fk
    FOREIGN KEY (user)
    REFERENCES users(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;