#!/usr/bin/env pwsh
# Frontend Build and Deploy Script

param(
    [switch]$Build,
    [switch]$Deploy,
    [switch]$All,
    [string]$region = "us-east-1",
    [string]$tag = "latest"
)

$ErrorActionPreference = "Stop"

# Set default to build and deploy if no parameters specified
if (-not $Build -and -not $Deploy) {
    $All = $true
}

if ($All) {
    $Build = $true
    $Deploy = $true
}

# Navigate to the frontend directory
Set-Location $PSScriptRoot\..

# Build frontend
if ($Build) {
    Write-Host "Building frontend..." -ForegroundColor Cyan
    
    # Install dependencies if node_modules doesn't exist
    if (-not (Test-Path node_modules)) {
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    # Build the application
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Build completed successfully!" -ForegroundColor Green
}

# Deploy frontend to ECR
if ($Deploy) {
    Write-Host "Deploying frontend to ECR..." -ForegroundColor Cyan
    
    # Execute the ECR deployment script
    & $PSScriptRoot\deploy-to-ecr.ps1 -region $region -tag $tag
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Deployment failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
}
