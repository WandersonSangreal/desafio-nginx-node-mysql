SET NAMES utf8;

-- DROP TABLE people;

CREATE DATABASE IF NOT EXISTS nodedb;
USE nodedb;
CREATE TABLE IF NOT EXISTS people(id int not null auto_increment, name varchar(255), primary key(id));
INSERT INTO people (name) SELECT 'Usuário Teste' WHERE NOT EXISTS (SELECT * FROM people);