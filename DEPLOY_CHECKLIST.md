# Deployment Checklist for Develop/Production

## Pre-Deployment Configuration

### Backend Environment Variables (.env)

Required for production/develop deployment:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production  # Use 'production' for both develop and production branches

# MongoDB Connection
MONGO_URI=mongodb+srv://your-atlas-cluster/tidyapp  # Your production MongoDB

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production  # CHANGE THIS!

# CORS Origin
CORS_ORIGIN=https://tidyapp.co.za

# External APIs
STORMGLASS_API_KEY=your-actual-api-key

# Email Service (Required for user verification)
EMAIL_USER=noreplytidyapp@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM="TidyApp <noreplytidyapp@gmail.com>"
FRONTEND_URL=https://tidyapp.co.za
```

### Frontend Environment Variables (.env)

Optional - only needed if backend is on a different domain:

```bash
# Leave empty to use /api (same domain)
VITE_API_URL=

# Or specify full backend URL if on different domain
# VITE_API_URL=https://api.tidyapp.co.za/api
```

## Security Checklist

- [ ] `JWT_SECRET` is changed to a strong random string (not the default)
- [ ] `NODE_ENV=production` is set
- [ ] MongoDB uses authentication and is not publicly accessible
- [ ] Gmail app password is configured for email service
- [ ] CORS is configured for `https://tidyapp.co.za` only
- [ ] Helmet security headers are enabled (automatic in production mode)
- [ ] Rate limiting is enabled (automatic)

## Build & Deploy Steps

### Backend Deployment

1. **Set environment variables** on your hosting platform
2. **Install dependencies**: `npm install --production`
3. **Start server**: `npm start`
4. **Verify**: Check that server logs show:
   - ✅ MongoDB connected
   - 🔒 Production security headers enabled
   - 🌍 Environment: production

### Frontend Deployment

1. **Build for production**: `npm run build`
2. **Deploy `dist/` folder** to your hosting platform (Vercel, Netlify, etc.)
3. **Configure routing**: Set up SPA fallback (all routes → index.html)
4. **Environment variables**: Set `VITE_API_URL` if backend is on different domain

## Post-Deployment Verification

### Backend Health Checks

- [ ] Root endpoint accessible: `https://tidyapp.co.za/api` or your backend URL
- [ ] CORS working: Frontend can make API requests
- [ ] Rate limiting active: Multiple requests show rate limit headers
- [ ] Email verification working: Test registration and email delivery
- [ ] MongoDB connection stable: Check logs for connection errors

### Frontend Health Checks

- [ ] Website loads: `https://tidyapp.co.za`
- [ ] API requests work: Login, register, data fetching
- [ ] Email verification links work: Links redirect correctly
- [ ] No console errors in browser dev tools
- [ ] Mobile responsive: Test on mobile devices

## Architecture Notes

### Current Setup Assumptions

- **Same Domain Deployment**: Frontend and backend served from `tidyapp.co.za`
  - Frontend: `https://tidyapp.co.za`
  - Backend: `https://tidyapp.co.za/api`
  - Uses reverse proxy (nginx, etc.) to route `/api` to backend

### Alternative: Separate Domains

If backend is on a different domain:

1. Frontend `.env`:

   ```bash
   VITE_API_URL=https://api.tidyapp.co.za/api
   ```

2. Backend CORS already configured for cross-domain requests

3. Ensure HTTPS on both domains

## Common Issues

### CORS Errors

- **Symptom**: "Origin not allowed by CORS" in browser console
- **Fix**: Verify `CORS_ORIGIN` in backend .env matches frontend domain exactly
- **Check**: `NODE_ENV=production` is set

### Email Not Sending

- **Symptom**: Users don't receive verification emails
- **Fix**: Verify `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `FRONTEND_URL` are set
- **Check**: Gmail app password is correct (not regular password)

### Rate Limiting Too Strict

- **Symptom**: Users getting rate limited frequently
- **Fix**: Adjust limits in `/backend/src/config/rateLimit.js`
- **Check**: MongoDB connection is stable (rate limits persist in DB)

### Build Errors

- **Frontend**: Run `npm run build` locally first to catch errors
- **Backend**: Ensure all dependencies are in `package.json` dependencies (not devDependencies)

## Monitoring Recommendations

- Monitor server logs for errors
- Set up MongoDB Atlas alerts for connection issues
- Monitor email delivery rates
- Track API response times
- Set up uptime monitoring (UptimeRobot, Pingdom, etc.)

## Rollback Plan

If deployment fails:

1. **Keep previous environment variables** backed up
2. **Git**: Revert to previous commit if needed
3. **Database**: Have MongoDB backup before major changes
4. **Frontend**: Previous build artifacts can be re-deployed quickly
