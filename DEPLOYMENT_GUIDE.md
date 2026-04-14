# Vercel + Supabase Setup Instructions

## ✅ What's Been Done

1. ✅ Installed Supabase client library
2. ✅ Created environment files for API credentials
3. ✅ Created SupabaseService for database operations
4. ✅ Updated RSVP component to use Supabase
5. ✅ Added loading states and disabled states

## 🔑 Next Steps - Configure Your Credentials

### 1. Update Environment Files

After creating your Supabase project, update these files with your actual credentials:

**File: `app/src/environments/environment.ts`**
**File: `app/src/environments/environment.prod.ts`**

Replace:
- `YOUR_SUPABASE_URL` with your project URL (e.g., `https://xxxxx.supabase.co`)
- `YOUR_SUPABASE_ANON_KEY` with your anon public key

You can find these in:
Supabase Dashboard → Project Settings → API

### 2. Test Locally

```bash
cd app
ng serve
```

Visit `http://localhost:4200/rsvp` and test:
- Enter code: `SMITH2024`
- Select attendance
- Add message
- Click Submit

Check Supabase Dashboard → Table Editor to see the updates!

---

## 🌐 Deploy to Vercel

### Step 1: Build Your App

```bash
cd app
npm run build
```

### Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 3: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **(Your account)**
- Link to existing project? **No**
- Project name? **rsvp-invitation**
- Directory? **.** (current directory)
- Override settings? **No**

### Step 4: Deploy to Production

```bash
vercel --prod
```

You'll get a URL like: `https://rsvp-invitation.vercel.app`

### Step 5: Add Environment Variables in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `SUPABASE_URL` = Your Supabase URL
   - `SUPABASE_KEY` = Your Supabase anon key
5. Redeploy: `vercel --prod`

---

## 🎯 Testing Codes

Use these invitation codes to test:

- `SMITH2024` - John Smith, Jane Smith (2 guests)
- `JOHNSON2024` - Michael Johnson, Emily Johnson (2 guests)
- `BROWN2024` - Sarah Brown, James Brown (2 guests)
- `THOMAS2024` - William Thomas, Linda Thomas (2 guests)
- `LEE2024` - Christopher Lee (1 guest with existing message)
- `WILSON2024` - David Wilson (1 guest)

---

## 📊 Database Management

Access your data in Supabase:
- **Table Editor** - View/edit data manually
- **SQL Editor** - Run queries
- **Database** - See schema

---

## 🔒 Security Notes

Current setup allows public read/write. For production:

1. **Add authentication** (Supabase Auth)
2. **Update RLS policies** to require authentication
3. **Rate limit** in Supabase settings
4. **Add CORS** restrictions

---

## ✨ Benefits of This Setup

✅ **No server needed** - Supabase handles everything
✅ **Real-time updates** - Can add real-time features later
✅ **Automatic backups** - Built-in
✅ **Free hosting** - Both Vercel and Supabase free tiers
✅ **Always online** - No cold starts
✅ **Scalable** - Handles thousands of guests

---

## 🚨 Troubleshooting

### Error: "Failed to load guests"
- Check environment variables are set correctly
- Verify Supabase URL and key
- Check browser console for errors

### Error: "Failed to submit RSVP"
- Check RLS policies in Supabase
- Verify tables exist
- Check browser network tab

### Can't see submitted data
- Go to Supabase → Table Editor
- Select `guests` or `messages` table
- Refresh the view

---

## 📞 Support

If you need help:
1. Check browser console (F12) for errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify API keys are correct
4. Test SQL queries in Supabase SQL Editor

---

Ready to deploy! 🚀
