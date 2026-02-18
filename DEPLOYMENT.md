# Deployment Guide

## Production Deployment

### Backend Deployment (Flask)

#### Using Gunicorn

1. **Install Gunicorn**:
```bash
pip install gunicorn
```

2. **Run with Gunicorn**:
```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Using Docker

Create `Dockerfile` in backend folder:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

Build and run:
```bash
docker build -t hardware-backend .
docker run -p 5000:5000 hardware-backend
```

### Frontend Deployment (React)

#### Build for Production
```bash
cd frontend
npm run build
```

This creates an optimized `build/` folder.

#### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

#### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `build/` folder to Netlify

#### Using Docker

Create `Dockerfile` in frontend folder:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://backend:5000;
    }
}
```

### Environment Configuration

#### Backend (.env)
```
FLASK_ENV=production
DATABASE_URL=sqlite:///hardware_management.db
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://yourdomain.com
```

#### Frontend (.env.production)
```
REACT_APP_API_URL=https://api.yourdomain.com
```

### Database Considerations

#### Production Database
Replace SQLite with PostgreSQL:

1. Install psycopg2:
```bash
pip install psycopg2-binary
```

2. Update connection string in `app.py`:
```python
import os
db_url = os.getenv('DATABASE_URL', 'sqlite:///hardware_management.db')
```

3. Use connection pooling for better performance

#### Backup Strategy
- Regular automated backups
- Store backups in cloud storage
- Test restore procedures

### Security Checklist

- [ ] Change demo credentials
- [ ] Implement proper JWT authentication
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Set up logging and monitoring
- [ ] Regular security updates
- [ ] Database encryption
- [ ] Implement proper error handling (no stack traces in production)

### Monitoring

#### Backend
- Set up error tracking (Sentry)
- Enable logging
- Monitor database performance

#### Frontend
- Set up error tracking (Sentry)
- Monitor API response times
- Track user sessions

### Scaling

As traffic grows:

1. **Backend**:
   - Use load balancing with Nginx
   - Cache with Redis
   - Optimize database queries
   - Use CDN for static assets

2. **Frontend**:
   - Enable caching headers
   - Compress assets
   - Use CDN distribution
   - Implement code splitting

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - run: |
          cd backend
          pip install -r requirements.txt
          python -m pytest
      - name: Deploy Backend
        run: # Add deployment command

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: |
          cd frontend
          npm ci
          npm run build
      - name: Deploy Frontend
        run: # Add deployment command
```

### Health Checks

```python
@app.route('/health')
def health():
    try:
        # Check database connection
        conn = get_db_connection()
        conn.close()
        return {'status': 'healthy'}, 200
    except:
        return {'status': 'unhealthy'}, 500
```

### Performance Optimization

#### Backend
```python
# Enable query optimization
conn.execute('PRAGMA query_only = ON')

# Connection pooling
from sqlalchemy.pool import QueuePool
```

#### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Minification

### Rollback Plan

- Keep previous version running
- Version database migrations
- Test rollback procedures
- Document rollback steps

