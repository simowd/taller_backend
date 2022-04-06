# Backend para taller de grado.

### Para que el proyecto funcione correctamente se tiene que tener un archivo .env con las siguientes llaves:

  MYSQL_URI="mysql://admin:abc123@mysql-database:3306/taller"
  PORT="3000"
  TEST_MYSQL_URI="mysql://admin:abc123@mysql-database:3306/testing"
  SECRET="secret"

### Para realizar pruebas locales en el ambiente de desarrollador

  TEST_MYSQL_URI="mysql://admin:abc123@localhost:3306/testing" npm run test