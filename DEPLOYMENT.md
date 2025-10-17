# Deployment Guide - Zama fhEVM Block Explorer

This guide will help you deploy the Zama Block Explorer to Railway to get **real-time blockchain data** from Zama devnet.

## Why Railway?

✅ Full Node.js support with WebSocket  
✅ Persistent processes for real-time updates  
✅ No network restrictions - can access Zama RPC  
✅ Free tier available ($5 credit/month)  
✅ One-click GitHub deployment

## Prerequisites

1. A GitHub account
2. A Railway account (sign up at [railway.app](https://railway.app))
3. This code pushed to a GitHub repository

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Zama Block Explorer"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/yourusername/zama-explorer.git
git push -u origin main
```

### 2. Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `zama-explorer` repository
5. Railway will automatically detect the Node.js app

### 3. Configure Environment Variables

In Railway dashboard:
1. Click on your deployed service
2. Go to **"Variables"** tab
3. Add these variables:

```
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-secure-random-string-here
```

To generate a secure SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy!

Railway will automatically:
- Install dependencies
- Build the app (`npm run build`)
- Start the server (`npm start`)
- Assign a public URL

### 5. Access Your Explorer

Once deployed, Railway provides a URL like:
```
https://zama-explorer-production.up.railway.app
```

🎉 **Your explorer is now live with real Zama blockchain data!**

## What You'll See

With the Railway deployment, your explorer will:

✅ Connect to `https://devnet.zama.ai`  
✅ Fetch real blocks and transactions  
✅ Show live encrypted FHE data  
✅ Update in real-time via WebSocket  
✅ Display actual network statistics

## Monitoring

In Railway dashboard:
- **Logs**: View real-time application logs
- **Metrics**: Monitor CPU, memory, network usage
- **Deployments**: Track deployment history

## Troubleshooting

### Build Fails
- Check the build logs in Railway dashboard
- Ensure all dependencies are in `package.json`

### App Crashes
- Check logs for error messages
- Verify SESSION_SECRET is set
- Ensure PORT is set to 5000

### No Real Data Showing
- Check logs for "Zama RPC unavailable" messages
- If you see this, the RPC might be down - check Zama's status

## Alternative: Render Deployment

If you prefer Render over Railway:

1. Go to [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables (same as above)

## Local Testing Before Deployment

Test the production build locally:

```bash
# Build the app
npm run build

# Start in production mode
NODE_ENV=production SESSION_SECRET=test npm start
```

Visit `http://localhost:5000` to verify everything works.

## Cost

**Railway Free Tier**:
- $5 credit/month
- Usually enough for development/demo projects
- Upgrade if needed for production traffic

**Render Free Tier**:
- Free for web services (with limitations)
- Spins down after inactivity
- Good for demos and low traffic

## Support

If you encounter issues:
1. Check Railway/Render logs
2. Verify Zama devnet is operational
3. Review the application logs for errors

---

**Ready to deploy?** Follow the steps above and your explorer will be live with real Zama blockchain data in minutes! 🚀
