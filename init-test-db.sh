#!/bin/bash
set -e

# Cria banco de testes se não existir
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE omega_db_test'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'omega_db_test')\gexec
EOSQL

echo "Banco de testes criado!"

