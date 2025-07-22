# 🚀 Honda Plus Deployment Guide

Complete deployment guide for Honda Plus with GitHub Actions, Docker, Swagger, and Postman integration.

## 📋 Table of Contents

- [🔧 Prerequisites](#prerequisites)
- [🐳 Docker Deployment](#docker-deployment)
- [🚀 GitHub Actions CI/CD](#github-actions-cicd)
- [📖 API Documentation](#api-documentation)
- [🧪 Testing with Postman](#testing-with-postman)
- [📊 Monitoring & Health Checks](#monitoring--health-checks)
- [🔒 Security Configuration](#security-configuration)
- [🛠️ Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software
- **Docker** 20.10+ and Docker Compose 2.0+
- **Node.js** 18+ (for local development)
- **Git** for version control
- **Newman** for Postman CLI testing

### Environment Setup
```bash
# Clone repository
git clone https://github.com/your-org/honda-plus.git
cd honda-plus

# Copy environment file
cp .env.example .env.local

# Install dependencies
npm install
```

## 🐳 Docker Deployment

### Quick Start
```bash
# Development with all tools
npm run docker:compose:dev

# Production deployment
npm run docker:compose

# Check status
docker-compose ps

# View logs
docker-compose logs -f honda-plus
```

### Services Overview

| Service | Port | Description |
|---------|------|-------------|
| Honda Plus App | 3000 | Main Next.js application |
| MongoDB | 27017 | Database server |
| Redis | 6379 | Cache server |
| Nginx | 80/443 | Reverse proxy |
| Mongo Express | 8081 | Database admin (dev only) |
| Redis Commander | 8082 | Cache admin (dev only) |

### Environment Variables
```env
# Application
NODE_ENV=production
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=https://hondaplus.vn

# Database
MONGODB_URI=mongodb://admin:hondaplus2024@mongodb:27017/honda-plus?authSource=admin

# Cache
REDIS_URL=redis://:hondaplus2024@redis:6379

# Security
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key
```

## 🚀 GitHub Actions CI/CD

### Workflow Overview
The CI/CD pipeline includes:

1. **Code Quality & Testing**
   - ESLint code linting
   - TypeScript type checking
   - Jest unit tests
   - Test coverage reporting

2. **Security Scanning**
   - npm audit for vulnerabilities
   - Snyk security analysis
   - Dependency checking

3. **Build & Deploy**
   - Docker image building
   - Multi-platform support (AMD64/ARM64)
   - Container registry push
   - Automated deployment

### Required Secrets
Configure these in GitHub repository settings:

```bash
# Deployment
STAGING_HOST=staging.hondaplus.vn
STAGING_USER=deploy
STAGING_SSH_KEY=<private-key>

PRODUCTION_HOST=hondaplus.vn
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=<private-key>

# Security
SNYK_TOKEN=<snyk-token>
CODECOV_TOKEN=<codecov-token>

# Notifications
SLACK_WEBHOOK_URL=<slack-webhook>
```

### Manual Deployment
```bash
# Build Docker image
npm run docker:build

# Tag for registry
docker tag honda-plus ghcr.io/your-org/honda-plus:latest

# Push to registry
docker push ghcr.io/your-org/honda-plus:latest

# Deploy on server
ssh user@server 'cd /opt/honda-plus && docker-compose pull && docker-compose up -d'
```

## 📖 API Documentation

### Swagger UI
Access interactive API documentation:
- **Local**: http://localhost:3001/api/docs
- **Production**: https://hondaplus.vn/api/docs

### API Endpoints

#### Health Check
```bash
GET /api/health
```
Returns API health status and system information.

#### Cars API
```bash
# Get all cars
GET /api/cars?limit=10&sortBy=createdAt&sortOrder=desc

# Search cars
GET /api/cars?search=civic&category=sedan

# Filter by price
GET /api/cars?minPrice=500000000&maxPrice=1000000000
```

### API Specification
The OpenAPI specification is served dynamically at `/api/swagger` endpoint.

## 🧪 Testing with Postman

### Collection Import
1. Import `postman/Honda-Plus-API.postman_collection.json`
2. Import `postman/Honda-Plus-Environment.postman_environment.json`
3. Set environment variables

### Environment Configuration
```json
{
  "base_url": "http://localhost:3001/api",
  "staging_url": "https://staging.hondaplus.vn/api",
  "production_url": "https://hondaplus.vn/api",
  "auth_token": "your-auth-token"
}
```

### CLI Testing
```bash
# Run all tests
npm run postman:test

# Run specific collection
newman run postman/Honda-Plus-API.postman_collection.json \
  -e postman/Honda-Plus-Environment.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

### Test Scenarios
- ✅ API health checks
- ✅ Car listing and filtering
- ✅ Search functionality
- ✅ Performance testing
- ✅ Error handling

## 📊 Monitoring & Health Checks

### Health Check Endpoints
```bash
# Application health
curl http://localhost:3001/api/health

# Database health
curl http://localhost:3001/api/health | jq '.database'

# System metrics
curl http://localhost:3001/api/health | jq '.memory'
```

### Docker Health Checks
```bash
# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# View health check logs
docker inspect honda-plus-app | jq '.[0].State.Health'
```

### Monitoring Stack
- **Application**: Built-in health checks
- **Database**: MongoDB monitoring
- **Cache**: Redis monitoring
- **Proxy**: Nginx access logs
- **System**: Docker stats

## 🔒 Security Configuration

### SSL/TLS Setup
```bash
# Generate self-signed certificates (development)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout docker/nginx/ssl/key.pem \
  -out docker/nginx/ssl/cert.pem

# Production: Use Let's Encrypt or commercial certificates
```

### Security Headers
Nginx automatically adds:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security
- Referrer-Policy

### Rate Limiting
- API endpoints: 10 requests/second
- General traffic: 30 requests/second
- Burst handling: 20-50 requests

## 🛠️ Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
docker-compose logs honda-plus

# Check environment variables
docker exec honda-plus-app env | grep -E "(NODE_ENV|MONGODB_URI)"

# Restart service
docker-compose restart honda-plus
```

#### Database Connection Issues
```bash
# Test MongoDB connection
docker exec honda-plus-mongodb mongosh --eval "db.adminCommand('ping')"

# Check network connectivity
docker exec honda-plus-app ping mongodb

# Reset database
docker-compose down -v && docker-compose up -d
```

#### Performance Issues
```bash
# Monitor resources
docker stats

# Check application metrics
curl http://localhost:3001/api/health | jq '.memory'

# Optimize containers
docker system prune -f
```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=honda-plus:*

# Run with verbose output
docker-compose up --verbose
```

## 📞 Support

### Documentation
- 📖 API Docs: `/api/docs`
- 🐳 Docker Guide: `docker/README.md`
- 🧪 Testing Guide: `postman/README.md`

### Contact
- 📧 Email: support@hondaplus.vn
- 📱 Phone: 1900-1234
- 🌐 Website: https://hondaplus.vn
- 💬 Slack: #honda-plus-support

---

**Honda Plus** - *Production-Ready Deployment* 🚗🚀✨
