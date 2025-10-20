Write-Host "Iniciando setup do projeto..."
Write-Host ""

# 1. Instalar dependencias
Write-Host "1. Instalando dependencias..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao instalar dependencias"
    exit 1
}
Write-Host ""

# 2. Criar arquivo .env
Write-Host "2. Criando arquivo .env..."
if (Test-Path .env) {
    Write-Host "Arquivo .env ja existe"
} else {
    Copy-Item .env.example .env
}
Write-Host ""

# 3. Iniciar Docker
Write-Host "3. Iniciando banco de dados..."
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao iniciar Docker"
    exit 1
}
Write-Host ""

# 4. Aguardar banco inicializar
Write-Host "4. Aguardando banco inicializar..."
Start-Sleep -Seconds 8
Write-Host ""

# 5. Criar banco de teste
Write-Host "5. Criando banco de teste..."
docker exec -it teste-omega psql -U omega_user -d omega_db -c "CREATE DATABASE omega_db_test;" 2>&1 | Out-Null
Write-Host ""

# 6. Executar migrations (desenvolvimento)
Write-Host "6. Executando migrations (desenvolvimento)..."
npm run migration:dev
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao executar migrations"
    exit 1
}
Write-Host ""

# 7. Executar migrations (teste)
Write-Host "7. Executando migrations (teste)..."
$env:DB_NAME = "omega_db_test"
npm run migration:dev
$env:DB_NAME = "omega_db"
Write-Host ""

# 8. Executar testes
Write-Host "8. Executando testes..."
npm test
Write-Host ""

Write-Host "Setup concluido!"
Write-Host ""
Write-Host "Para iniciar o servidor execute: npm run dev"
