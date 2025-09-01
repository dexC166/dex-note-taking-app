# 🚀 Deployment Guide: Vercel + Fly.io

This guide will walk you through deploying your Dex-Note-Taking-App using:

- **Frontend**: Vercel (free tier)
- **Backend**: Fly.io (free tier)
- **Database**: MongoDB Atlas (free tier)

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Fly.io Account** - Sign up at [fly.io](https://fly.io)
4. **MongoDB Atlas Account** - Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
5. **Upstash Account** - Sign up at [upstash.com](https://upstash.com)

## 🔧 Step 1: Deploy Backend to Fly.io

### 1.1 Install Fly CLI

```bash
# On Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# On macOS
curl -L https://fly.io/install.sh | sh

# On Linux
curl -L https://fly.io/install.sh | sh
```

### 1.2 Login to Fly.io

```bash
fly auth login
```

### 1.3 Navigate to Backend Directory

```bash
cd backend
```

### 1.4 Set Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=8080
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
NODE_ENV=production
```

### 1.5 Deploy to Fly.io

```bash
fly deploy
```

**Important**: When prompted:

- Choose a unique app name (e.g., `dex-notes-backend-yourname`)
- Select a region close to you
- Choose "Yes" for deploying immediately

### 1.6 Verify Deployment

```bash
fly status
fly logs
```

Your backend will be available at: `https://your-app-name.fly.dev`

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Push Code to GitHub

Make sure your code is in a GitHub repository.

### 2.2 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2.3 Update Vercel Configuration

Update the `vercel.json` file with your actual Fly.io backend URL:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR-FLY-APP-NAME.fly.dev/api/$1"
    }
  ]
}
```

### 2.4 Deploy

Click "Deploy" in Vercel. Your frontend will be deployed automatically.

## 🔗 Step 3: Update Frontend Configuration

### 3.1 Update Backend URL

In your deployed frontend, make sure the axios configuration points to your Fly.io backend.

### 3.2 Test the Connection

1. Create a new note
2. Check if it appears in your MongoDB Atlas database
3. Verify all CRUD operations work

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**

   - Make sure your Fly.io backend CORS settings include your Vercel domain
   - Check the `vercel.json` configuration

2. **Environment Variables**

   - Verify all environment variables are set in Fly.io
   - Use `fly secrets set VARIABLE_NAME=value` to set secrets

3. **Port Issues**

   - Fly.io expects port 8080
   - Make sure your backend listens on the correct port

4. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas

### Useful Fly.io Commands:

```bash
fly logs                    # View application logs
fly status                  # Check app status
fly secrets list           # List environment variables
fly secrets set KEY=value  # Set environment variable
fly scale count 1          # Scale to 1 instance (free tier)
```

## 💰 Free Tier Limits

### Vercel:

- 100GB bandwidth/month
- Unlimited deployments
- Custom domains

### Fly.io:

- 3 shared-cpu-1x 256mb VMs
- 3GB persistent volume storage
- 160GB outbound data transfer

### MongoDB Atlas:

- 512MB storage
- Shared clusters

## 🎉 Success!

Once deployed, your app will be available at:

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-app-name.fly.dev`

## 🔄 Continuous Deployment

Both Vercel and Fly.io will automatically redeploy when you push changes to your GitHub repository's main branch.

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Fly.io Documentation](https://fly.io/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
