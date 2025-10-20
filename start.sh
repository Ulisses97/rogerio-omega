#!/bin/sh
# Script de inicializacao

echo "Aguardando banco de dados..."
sleep 5

echo "Executando migrations..."
npm run migration:dev

echo "Iniciando aplicacao..."
npm run dev
