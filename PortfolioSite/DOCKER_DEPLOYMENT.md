# Portfolio Site - Docker Deployment Guide

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Ports 80, 3001, and 3306 available

### Deploy Locally

```bash
# Build and start all containers
docker-compose up --build

# Run in background
docker-compose up -d --build
```

Access the site at: `http://localhost`

### Stop Containers

```bash
docker-compose down

# Remove volumes too (deletes database)
docker-compose down -v
```

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │────▶│     MySQL       │
│    (Nginx)      │     │   (Node.js)     │     │    Database     │
│    Port: 80     │     │   Port: 3001    │     │   Port: 3306    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Services

### Frontend (portfolio-frontend)
- **Image**: nginx:alpine
- **Port**: 80
- **Features**: 
  - Serves built React app
  - Proxies `/api` requests to backend
  - Proxies `/uploads` requests to backend
  - SPA routing support

### Backend (portfolio-backend)
- **Image**: Custom Node.js
- **Port**: 3001
- **Features**:
  - RESTful API for projects
  - Image upload handling
  - MySQL database connection

### Database (portfolio-db)
- **Image**: mysql:8.0
- **Port**: 3306
- **Credentials**:
  - User: `portfolio_user`
  - Password: `portfolio_pass_123`
  - Database: `portfolio`

---

## API Endpoints

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects/:id/images` | Upload images to project |
| DELETE | `/api/images/:id` | Delete single image |

---

## Oracle Cloud Deployment

### 1. Prepare Your Instance

```bash
# SSH into your Oracle Cloud instance
ssh -i <private_key> opc@<instance_ip>

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker opc

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in for group changes
exit
```

### 2. Transfer Files

```bash
# From your local machine
scp -i <private_key> -r ./PortfolioSite opc@<instance_ip>:~/
```

### 3. Configure Firewall

```bash
# Open ports in Oracle Cloud Console:
# - Ingress Rule: 0.0.0.0/0 → Port 80 (HTTP)
# - Ingress Rule: 0.0.0.0/0 → Port 443 (HTTPS, optional)

# On the instance
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload
```

### 4. Deploy

```bash
cd ~/PortfolioSite
docker-compose up -d --build
```

### 5. Verify

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Test the API
curl http://localhost/api/health
```

---

## Persistent Data

### Volumes
- `db_data` - MySQL database files
- `uploads_data` - Uploaded project images

### Backup Database

```bash
docker exec portfolio-db mysqldump -u portfolio_user -pportfolio_pass_123 portfolio > backup.sql
```

### Restore Database

```bash
cat backup.sql | docker exec -i portfolio-db mysql -u portfolio_user -pportfolio_pass_123 portfolio
```

---

## Environment Variables

### Backend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | API server port |
| DB_HOST | db | Database host |
| DB_PORT | 3306 | Database port |
| DB_USER | portfolio_user | Database username |
| DB_PASSWORD | portfolio_pass_123 | Database password |
| DB_NAME | portfolio | Database name |

### Frontend

| Variable | Description |
|----------|-------------|
| VITE_API_URL | API base URL (empty for same-origin) |

---

## Troubleshooting

### Database Connection Failed
```bash
# Check if database is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Manually connect to database
docker exec -it portfolio-db mysql -u portfolio_user -pportfolio_pass_123 portfolio
```

### Frontend Not Loading
```bash
# Rebuild frontend
docker-compose up -d --build frontend

# Check nginx logs
docker logs portfolio-frontend
```

### API Errors
```bash
# Check backend logs
docker logs portfolio-backend

# Restart backend
docker-compose restart backend
```

---

## Production Recommendations

1. **Change Default Passwords** 
   - Update database credentials in `docker-compose.yml`
   - Update `backend/.env`

2. **Enable HTTPS**
   - Use a reverse proxy like Traefik or Caddy
   - Or add SSL certificates to Nginx

3. **Resource Limits**
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '0.5'
             memory: 512M
   ```

4. **Health Monitoring**
   - Set up container health checks
   - Use Docker logging drivers

---

## Development Mode

### Run Without Docker

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
npm run dev
```

**Database:**
```bash
# Start only database in Docker
docker-compose up -d db
```
