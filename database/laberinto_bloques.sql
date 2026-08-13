-- PROYECTO: PrismaShift
-- Motor: MySQL 8.0+
-- El juego frontend usa localStorage; este script prepara una fase futura.
DROP DATABASE IF EXISTS sena_prismashift;
CREATE DATABASE sena_prismashift CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sena_prismashift;

CREATE TABLE jugadores (
  id_jugador BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  alias VARCHAR(30) NOT NULL,
  curso VARCHAR(20) NOT NULL,
  institucion VARCHAR(120) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE niveles (
  id_nivel SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numero SMALLINT UNSIGNED NOT NULL UNIQUE,
  nombre VARCHAR(80) NOT NULL,
  filas SMALLINT UNSIGNED NOT NULL,
  columnas SMALLINT UNSIGNED NOT NULL,
  configuracion_json JSON NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_nivel_dimensiones CHECK (filas > 0 AND columnas > 0)
);
CREATE TABLE partidas (
  id_partida BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_jugador BIGINT UNSIGNED NOT NULL,
  iniciada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finalizada_en DATETIME,
  estado ENUM('EN_CURSO','FINALIZADA','ABANDONADA') NOT NULL DEFAULT 'EN_CURSO',
  CONSTRAINT fk_partida_jugador FOREIGN KEY (id_jugador) REFERENCES jugadores(id_jugador)
);
CREATE TABLE resultados_nivel (
  id_resultado BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_partida BIGINT UNSIGNED NOT NULL,
  id_nivel SMALLINT UNSIGNED NOT NULL,
  movimientos INT UNSIGNED NOT NULL,
  caidas INT UNSIGNED NOT NULL DEFAULT 0,
  duracion_segundos INT UNSIGNED,
  completado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_partida_nivel UNIQUE (id_partida,id_nivel),
  CONSTRAINT chk_movimientos CHECK (movimientos > 0),
  CONSTRAINT fk_resultado_partida FOREIGN KEY (id_partida) REFERENCES partidas(id_partida) ON DELETE CASCADE,
  CONSTRAINT fk_resultado_nivel FOREIGN KEY (id_nivel) REFERENCES niveles(id_nivel)
);
CREATE TABLE movimientos (
  id_movimiento BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_partida BIGINT UNSIGNED NOT NULL,
  id_nivel SMALLINT UNSIGNED NOT NULL,
  secuencia INT UNSIGNED NOT NULL,
  direccion ENUM('ARRIBA','ABAJO','IZQUIERDA','DERECHA') NOT NULL,
  orientacion_resultante ENUM('DE_PIE','HORIZONTAL','VERTICAL','CAIDA') NOT NULL,
  fila SMALLINT,
  columna SMALLINT,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_movimiento_secuencia UNIQUE (id_partida,id_nivel,secuencia),
  CONSTRAINT fk_movimiento_partida FOREIGN KEY (id_partida) REFERENCES partidas(id_partida) ON DELETE CASCADE,
  CONSTRAINT fk_movimiento_nivel FOREIGN KEY (id_nivel) REFERENCES niveles(id_nivel)
);
CREATE INDEX idx_resultados_ranking ON resultados_nivel(id_nivel,movimientos,duracion_segundos);
CREATE INDEX idx_partidas_jugador ON partidas(id_jugador,iniciada_en);

INSERT INTO jugadores (alias,curso,institucion) VALUES ('Equipo Cóndor','10-01','Institución demostración');
INSERT INTO niveles (numero,nombre,filas,columnas,configuracion_json) VALUES
  (1,'Primer giro',8,11,JSON_OBJECT('inicio',JSON_ARRAY(4,2),'objetivo',JSON_ARRAY(4,8))),
  (2,'Esquinas seguras',8,11,JSON_OBJECT('inicio',JSON_ARRAY(6,2),'objetivo',JSON_ARRAY(3,8))),
  (3,'Ruta fragmentada',9,12,JSON_OBJECT('inicio',JSON_ARRAY(7,2),'objetivo',JSON_ARRAY(4,8))),
  (4,'Vacíos cruzados',9,12,JSON_OBJECT('inicio',JSON_ARRAY(8,2),'objetivo',JSON_ARRAY(2,8))),
  (5,'Desafío prisma',9,12,JSON_OBJECT('inicio',JSON_ARRAY(8,2),'objetivo',JSON_ARRAY(2,11)));
