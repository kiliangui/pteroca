# Docker Setup for Next.js Application

This directory contains Docker configuration files for containerizing your Next.js application.

## Files Created

- **`Dockerfile`** - Multi-stage Docker build configuration
- **`.dockerignore`** - Excludes unnecessary files from Docker build context
- **`docker-compose.yml`** - Complete setup with application and PostgreSQL database

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up --build

# Run in detached mode
docker-compose up --build -d

# Stop the application
docker-compose down
```

### Option 2: Using Docker CLI

```bash
# Build the Docker image
docker build -t nextjs-app .

# Run the container
docker run -p 3000:3000 nextjs-app
```

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

```env
DATABASE_URL=postgresql://postgres:password@db:5432/nextjs_app
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

## Docker Compose Services

- **app** - Next.js application (port 3000)
- **db** - PostgreSQL database (port 5432)

## Production Deployment

For production deployment, you may want to:

1. Remove the database service from `docker-compose.yml` if using an external database
2. Update environment variables with production values
3. Add a reverse proxy like Nginx
4. Configure proper SSL/TLS certificates
5. Use a proper secret management service

## Database Migrations

Run Prisma migrations after starting the containers:

```bash
# Run migrations
docker-compose exec app npx prisma db push

# Seed the database (if needed)
docker-compose exec app npm run db:seed
```

## Development Tips

- The `prisma` folder is mounted as a volume to persist database changes
- Use `docker-compose logs -f app` to view application logs
- Use `docker-compose exec app sh` to access the container shell

## Troubleshooting

- **Port conflicts**: If port 3000 or 5432 is already in use, modify the ports in `docker-compose.yml`
- **Database connection issues**: Ensure the DATABASE_URL environment variable is properly set
- **Build failures**: Check that all dependencies are properly listed in `package.json`