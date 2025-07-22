# 🐳 Honda Plus Docker Setup

Complete Docker configuration for Honda Plus application with production-ready setup.

## 🚀 Quick Start

### Development Environment
```bash
# Start all services including development tools
docker-compose --profile development up -d

# View logs
docker-compose logs -f honda-plus

# Stop all services
docker-compose down
```

### Production Environment
```bash
# Start production services only
docker-compose up -d

# Scale the application
docker-compose up -d --scale honda-plus=3

# Update and restart
docker-compose pull && docker-compose up -d
```

## 📋 Services

### 🚗 Honda Plus Application
- **Port**: 3000
- **Health Check**: http://localhost:3000/api/health
- **Environment**: Production optimized
- **Features**: Auto-restart, health monitoring

### 🗄️ MongoDB Database
- **Port**: 27017
- **Username**: admin
- **Password**: hondaplus2024
- **Database**: honda-plus
- **Features**: Authentication enabled, persistent storage

### 🔄 Redis Cache
- **Port**: 6379
- **Password**: hondaplus2024
- **Features**: Persistent storage, optimized for caching

### 🌐 Nginx Reverse Proxy
- **HTTP Port**: 80
- **HTTPS Port**: 443
- **Features**: SSL termination, rate limiting, compression
- **Config**: `./nginx/nginx.conf`

### 🛠️ Development Tools (Development Profile)

#### MongoDB Express
- **Port**: 8081
- **URL**: http://localhost:8081
- **Username**: admin
- **Password**: hondaplus2024

#### Redis Commander
- **Port**: 8082
- **URL**: http://localhost:8082

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
NODE_ENV=production
MONGODB_URI=mongodb://admin:hondaplus2024@mongodb:27017/honda-plus?authSource=admin
REDIS_URL=redis://:hondaplus2024@redis:6379
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=https://hondaplus.vn
```

### SSL Certificates
Place SSL certificates in `./ssl/`:
```
docker/nginx/ssl/
├── cert.pem
└── key.pem
```

### MongoDB Initialization
Place initialization scripts in `./mongodb/init/`:
```javascript
// docker/mongodb/init/01-init.js
db = db.getSiblingDB('honda-plus');
db.createUser({
  user: 'hondaplus',
  pwd: 'hondaplus2024',
  roles: [{ role: 'readWrite', db: 'honda-plus' }]
});
```

## 📊 Monitoring

### Health Checks
```bash
# Application health
curl http://localhost:3000/api/health

# MongoDB health
docker exec honda-plus-mongodb mongosh --eval "db.adminCommand('ping')"

# Redis health
docker exec honda-plus-redis redis-cli ping
```

### Logs
```bash
# Application logs
docker-compose logs -f honda-plus

# All services logs
docker-compose logs -f

# Nginx access logs
docker exec honda-plus-nginx tail -f /var/log/nginx/access.log
```

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up
docker system prune -f
```

## 🔒 Security

### Network Security
- All services run in isolated network
- Only necessary ports exposed
- Rate limiting enabled
- SSL/TLS encryption

### Database Security
- Authentication required
- Non-root user
- Encrypted connections
- Regular backups

### Application Security
- Non-root container user
- Security headers
- Input validation
- CORS protection

## 🚀 Deployment

### Production Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.yml up -d

# Update application
docker-compose pull honda-plus
docker-compose up -d honda-plus

# Backup database
docker exec honda-plus-mongodb mongodump --out /backup
```

### Scaling
```bash
# Scale application instances
docker-compose up -d --scale honda-plus=3

# Load balancer will distribute traffic automatically
```

## 🛠️ Troubleshooting

### Common Issues

#### Application won't start
```bash
# Check logs
docker-compose logs honda-plus

# Check environment variables
docker exec honda-plus-app env

# Restart service
docker-compose restart honda-plus
```

#### Database connection issues
```bash
# Check MongoDB status
docker exec honda-plus-mongodb mongosh --eval "db.adminCommand('ismaster')"

# Check network connectivity
docker exec honda-plus-app ping mongodb
```

#### Performance issues
```bash
# Monitor resources
docker stats

# Check application metrics
curl http://localhost:3000/api/health

# Optimize containers
docker system prune -f
```

## 📈 Performance Optimization

### Application
- Multi-stage Docker build
- Standalone Next.js output
- Optimized dependencies
- Health checks

### Database
- Connection pooling
- Indexes optimization
- Regular maintenance
- Backup strategy

### Caching
- Redis for session storage
- Nginx static file caching
- Application-level caching
- CDN integration

## 🔄 Backup & Recovery

### Database Backup
```bash
# Create backup
docker exec honda-plus-mongodb mongodump --out /backup

# Restore backup
docker exec honda-plus-mongodb mongorestore /backup
```

### Application Backup
```bash
# Backup volumes
docker run --rm -v honda-plus_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

## 📞 Support

For issues and questions:
- 📧 Email: support@hondaplus.vn
- 📱 Phone: 1900-1234
- 🌐 Website: https://hondaplus.vn
