#!/usr/bin/env pwsh
# Frontend ECR Deployment Script

param(
    [string]$region = "us-east-1",
    [string]$tag = "latest"
)

$ErrorActionPreference = "Stop"

# Get AWS account ID
$accountId = aws sts get-caller-identity --query "Account" --output text

# Set repository name
$repositoryName = "theroundtable-frontend"

# Authenticate Docker to ECR
Write-Host "Authenticating Docker with ECR..."
aws ecr get-login-password --region $region | docker login --username AWS --password-stdin "$accountId.dkr.ecr.$region.amazonaws.com"

# Build the Docker image
Write-Host "Building Docker image..."
docker build -t "$repositoryName`:$tag" .

# Tag the image for ECR
Write-Host "Tagging image for ECR..."
docker tag "$repositoryName`:$tag" "$accountId.dkr.ecr.$region.amazonaws.com/$repositoryName`:$tag"

# Push the image to ECR
Write-Host "Pushing image to ECR..."
docker push "$accountId.dkr.ecr.$region.amazonaws.com/$repositoryName`:$tag"

Write-Host "Deployment complete!" -ForegroundColor Green
