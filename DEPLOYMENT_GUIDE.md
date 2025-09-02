# 🚀 Deployment Guide: Vercel + Fly.io

---

This guide will walk you through deploying your Dex-Note-Taking-App using:

- **Frontend**: Vercel (free tier)
- **Backend**: Fly.io (free tier)
- **Database**: MongoDB Atlas (free tier)

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Fly.io Account** - Sign up at [fly.io](https://fly.io)
4. **MongoDB Atlas Account** - Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
5. **Upstash Account** - Sign up at [upstash.com](https://upstash.com) (for rate limiting)

## 📁 Required Files

Before starting deployment, ensure you have these configuration files in your project:

- **`backend/fly.toml`** - Fly.io deployment configuration
- **`backend/Dockerfile`** - Container configuration for Fly.io
- **`frontend/vercel.json`** - Vercel deployment and routing configuration

---

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

**Can I skip this step?** If you've already installed Fly CLI for a previous project on the same PC, you can skip this step. The Fly CLI is installed system-wide and available for all projects.

### 1.2 Login to Fly.io

```bash
fly auth login
```

**Can I skip this step?** If you've already logged in for a previous project, your authentication token should still be active. You can verify your login status by running:

```bash
fly auth whoami
```

If it shows your Fly.io email address, you're all set! You can proceed directly to Step 1.3.

### 1.3 Navigate to Backend Directory

```bash
cd backend
```

### 1.4 Create Required Configuration Files

Before deploying to Fly.io, you need to create several configuration files in your backend directory:

#### 1.4.1 Create `fly.toml` File

Create a `fly.toml` file in your backend directory:

```toml
app = "your-app-name-backend"
primary_region = "iad"

[build]

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256

[http_service.checks]
  [http_service.checks.health]
    grace_period = "10s"
    interval = "30s"
    method = "GET"
    timeout = "5s"
    path = "/health"
```

**Important**: Replace `your-app-name-backend` with your actual app name.

#### 1.4.2 Create `Dockerfile`

Create a `Dockerfile` in your backend directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
```

#### 1.4.3 Update Backend `package.json` Scripts

Make sure your **backend** `package.json` has a start script:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

**Important**: This is the `package.json` file in your `backend/` directory, not the root or frontend `package.json`.

### 1.5 Set Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=8080
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
NODE_ENV=production
```

**Note**: This `.env` file is for local development only. For production deployment, you'll set these as secrets in Fly.io.

**What is Upstash Redis?** Upstash Redis is used for rate limiting - it prevents users from making too many requests to your API (protects against spam/abuse). It's optional but recommended for production apps.

### 1.6 Create Fly.io App

First, create the app with a unique name:

```bash
fly apps create appName-backend
```

**Important**: When prompted:

- Choose a unique app name (e.g., `appName-backend`)
- Select a region close to you (e.g., `iad` for Virginia, `lax` for Los Angeles)

### 1.7 Set Fly.io Secrets

Before deploying, you must set your environment variables as secrets in Fly.io:

```bash
fly secrets set MONGO_URI="your_mongodb_atlas_connection_string"
fly secrets set UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
fly secrets set UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"
fly secrets set NODE_ENV="production"
fly secrets set PORT="8080"
```

**Important**: Replace the values in quotes with your actual credentials. These secrets are encrypted and secure.

### 1.8 Deploy to Fly.io

Now deploy your app:

```bash
fly deploy
```

**Note**: The app name in your `fly.toml` file should match the app you just created.

**Important**: If you encounter PATH issues on Windows, you have two options:

**Option 1: Use Full Path (Immediate Solution)**

```bash
C:\Users\YourUsername\.fly\bin\fly.exe deploy
C:\Users\YourUsername\.fly\bin\fly.exe status
C:\Users\YourUsername\.fly\bin\fly.exe logs
```

**Option 2: Fix PATH Permanently (Recommended)**

1. Add `C:\Users\YourUsername\.fly\bin` to your Windows account environment variable PATH
2. Restart your PC completely
3. Open a new PowerShell terminal
4. Test with: `fly deploy`, `fly status`, `fly logs`

**Note**: After fixing the PATH and restarting, the `fly` command will work in all new terminal sessions without needing the full path.

### 1.9 Verify Deployment

```bash
fly status
fly logs
```

**Important**: If your app shows as "stopped" or has health check failures, you may need to restart the machine to pick up new environment variables:

```bash
# Get the machine ID from fly status, then restart it
fly machine restart MACHINE_ID
```

Your backend will be available at: `https://your-app-name.fly.dev`

### 1.10 Test API Endpoints

Verify your backend is working correctly by testing the API endpoints:

**Method 1: Browser Testing (Easiest)**
Visit these URLs in your browser:

- **Root API Info**: `https://your-app-name.fly.dev/`
- **Health Check**: `https://your-app-name.fly.dev/health`
- **Notes API**: `https://your-app-name.fly.dev/api/notes`

**Method 2: Command Line Testing**

```bash
# Test health endpoint
curl https://your-app-name.fly.dev/health

# Test notes endpoint
curl https://your-app-name.fly.dev/api/notes
```

**Expected Results:**

- **Health Check**: Should return `{"status":"OK","timestamp":"..."}`
- **Notes API**: Should return an array of notes (may be empty initially)
- **Root Endpoint**: Should return API information with available endpoints

**Troubleshooting**: If endpoints return errors, check the logs with `fly logs` and ensure the machine is running with `fly status`.

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Push Code to GitHub

Make sure your code is in a GitHub repository.

### 2.2 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite (tells Vercel you're using Vite as your build tool)
   - **Root Directory**: `frontend` (tells Vercel where your frontend code is located)
   - **Build Command**: `npm run build` (command to compile your code for production)
   - **Output Directory**: `dist` (folder where the compiled files will be stored)
   - **Install Command**: `npm install` (command to install your project dependencies)
5. **Important**: Expand the "Environment Variables" section and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-app-name-backend.fly.dev`

### 2.3 Create Vercel Configuration

Create a `vercel.json` file in your frontend directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR-FLY-APP-NAME.fly.dev/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

**Important**: Replace `YOUR-FLY-APP-NAME` with your actual Fly.io app name (e.g., `dex-note-taking-app-backend`).

**What this file does:**

- **rewrites**: Routes API calls from your frontend to your Fly.io backend
- **headers**: Sets CORS headers to allow communication between Vercel and Fly.io
- **buildCommand/outputDirectory**: Tells Vercel how to build your Vite project

### 2.4 Deploy

Click "Deploy" in Vercel. Your frontend will be deployed automatically.

## 🔗 Step 3: Update Frontend Configuration

### 3.1 Update Frontend Axios Configuration

Your frontend needs to know where your backend API is located. Update the axios configuration:

**File**: `frontend/src/lib/axios.js`

```javascript
import axios from 'axios';

// in production, there's no localhost so we have to make this dynamic
const BASE_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:8080/api' : '/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
```

**What this does:**

- **Development**: Uses `http://localhost:8080/api` (your local backend)
- **Production**: Uses `/api` (which gets routed to your Fly.io backend via `vercel.json`)

**Important**: This configuration should already be correct if you followed the guide. The `/api` path will be automatically routed to your Fly.io backend through the `vercel.json` rewrites we set up.

### 3.2 Push Changes to GitHub

Before testing, you need to push your local changes to GitHub so Vercel can redeploy with the updated configuration:

```bash
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "Update deployment configuration files"

# Push to GitHub (this will trigger Vercel redeploy)
git push origin main
```

**What this does:**

- **Stages your changes** (including updated `vercel.json`)
- **Commits the changes** with a descriptive message
- **Pushes to GitHub** which automatically triggers Vercel to redeploy
- **Updates the routing** so your frontend can connect to your backend

### 3.3 Test the Connection

1. **Wait 2-3 minutes** for Vercel to complete the redeploy
2. **Visit your deployed frontend** (Vercel URL)
3. **Create a new note** using the UI
4. **Check your MongoDB Atlas database** to verify the note was saved
5. **Test all CRUD operations**:
   - Create a note
   - Edit a note
   - Delete a note
   - View notes list

**Expected Result**: All operations should work seamlessly between your Vercel frontend and Fly.io backend.

---

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

5. **Upstash Redis Connection Issues**

   - **Problem**: Rate limiter fails with "ENOTFOUND" errors
   - **Cause**: Upstash Redis database was deleted due to inactivity
   - **Solution**:
     - Create a new Upstash Redis database
     - Update your secrets with the new URL and token:
       ```bash
       fly secrets set UPSTASH_REDIS_REST_URL="your-new-redis-url"
       fly secrets set UPSTASH_REDIS_REST_TOKEN="your-new-redis-token"
       ```
     - Restart the machine to apply new secrets:
       ```bash
       fly machine restart MACHINE_ID
       ```

6. **Machine Restart Required**
   - **When**: After updating secrets or environment variables
   - **Why**: Running containers don't automatically pick up new secrets
   - **How**:
     ```bash
     fly status  # Get machine ID
     fly machine restart MACHINE_ID
     ```

### Windows-Specific Issues:

7. **Fly Command Not Recognized**

   - **Problem**: `fly` command not found in new terminal sessions
   - **Cause**: Fly.io installer doesn't properly update system PATH on Windows
   - **Solutions**:
     - **Option 1**: Use full path to execute commands (immediate solution):
       ```bash
       C:\Users\YourUsername\.fly\bin\fly.exe deploy
       C:\Users\YourUsername\.fly\bin\fly.exe status
       C:\Users\YourUsername\.fly\bin\fly.exe logs
       ```
     - **Option 2**: Fix PATH permanently (recommended):
       1. Add `C:\Users\YourUsername\.fly\bin` to your Windows account environment variable PATH
       2. **Restart your PC completely** (not just the terminal)
       3. Open a new PowerShell terminal
       4. Test with `fly deploy`, `fly status`, `fly logs`
     - **Option 3**: Reinstall Fly CLI in each new session (temporary):
       ```bash
       iwr https://fly.io/install.ps1 -useb | iex
       ```

8. **PATH Environment Variable Issues**

   - **Incorrect**: `C:\Users\YourUsername\.fly\bin\fly.exe` (points to file)
   - **Correct**: `C:\Users\YourUsername\.fly\bin` (points to directory)
   - **Fix**: Update PATH to point to the directory, not the executable file

### Useful Fly.io Commands:

```bash
fly logs                    # View application logs
fly status                  # Check app status
fly secrets list           # List environment variables
fly secrets set KEY=value  # Set environment variable
fly machine restart ID     # Restart machine to apply new secrets
fly scale count 1          # Scale to 1 instance (free tier)
```

---

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

### Upstash Redis:

- 10,000 requests/day
- 256MB storage
- Rate limiting for API protection

---

## 🎉 Success!

Once deployed, your app will be available at:

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-app-name.fly.dev`

---

## 🔄 Continuous Deployment

Both Vercel and Fly.io will automatically redeploy when you push changes to your GitHub repository's main branch.

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Fly.io Documentation](https://fly.io/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
