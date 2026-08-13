# Modelo relacional — PrismaShift

- JUGADORES(**id_jugador**, alias, curso, institucion, creado_en, activo)
- NIVELES(**id_nivel**, numero UQ, nombre, filas, columnas, configuracion_json, activo)
- PARTIDAS(**id_partida**, *id_jugador*, iniciada_en, finalizada_en, estado)
- RESULTADOS_NIVEL(**id_resultado**, *id_partida*, *id_nivel*, movimientos, caidas, duracion_segundos, completado_en)
- MOVIMIENTOS(**id_movimiento**, *id_partida*, *id_nivel*, secuencia, direccion, orientacion_resultante, fila, columna, creado_en)

La configuración del tablero se almacena como JSON para conservar casillas, inicio, objetivo y futuras reglas especiales. Una partida pertenece a un jugador; cada resultado vincula partida y nivel; los movimientos permiten reproducir o depurar una partida.
