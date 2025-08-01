# Supabase Setup Guide for Daily Amazement Competition

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name:** daily-amazement-competition
   - **Database Password:** (create a strong password)
   - **Region:** Choose closest to you
6. Click "Create new project"

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Create Database Tables

### Table 1: competition_entries
```sql
CREATE TABLE competition_entries (
  id BIGSERIAL PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  youtubeName TEXT NOT NULL,
  codeword TEXT NOT NULL,
  email TEXT NOT NULL,
  submittedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, codeword)
);
```

### Table 2: winners
```sql
CREATE TABLE winners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  youtubeName TEXT NOT NULL,
  email TEXT NOT NULL,
  codeword TEXT NOT NULL,
  wonAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 3: valid_codewords
```sql
CREATE TABLE valid_codewords (
  id BIGSERIAL PRIMARY KEY,
  codeword TEXT UNIQUE NOT NULL,
  addedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 4: Update Your Code

Replace the placeholder values in both files:

### In `index.html` (line ~87):
```javascript
const supabaseUrl = 'YOUR_PROJECT_URL_HERE';
const supabaseKey = 'YOUR_ANON_KEY_HERE';
```

### In `admin.html` (line ~5):
```javascript
const supabaseUrl = 'YOUR_PROJECT_URL_HERE';
const supabaseKey = 'YOUR_ANON_KEY_HERE';
```

## Step 5: Test the System

1. **Test form submission:**
   - Go to your main site
   - Fill out the competition form
   - Submit and check if it saves to Supabase

2. **Test admin panel:**
   - Go to admin panel
   - Upload YouTube subscriber CSV
   - Click "Pick Random Winner"
   - Verify winner is saved to database

## Features

✅ **Form submissions** automatically save to Supabase  
✅ **One entry per email** (prevents duplicates)  
✅ **Admin panel** loads entries from database  
✅ **Winner selection** excludes previous winners  
✅ **Lifetime winner tracking** (one win per person)  
✅ **YouTube subscriber matching** for valid entries  

## Security Notes

- The anon key is safe to use in frontend code
- Row Level Security (RLS) is enabled by default
- Consider adding authentication for admin panel in production

## Troubleshooting

If you get errors:
1. Check your API keys are correct
2. Verify tables are created properly
3. Check browser console for error messages
4. Ensure Supabase project is active

## Next Steps

Once setup is complete:
1. Your form will save entries to Supabase
2. Admin panel will load entries automatically
3. Winner selection will work with subscriber matching
4. All winners are tracked for lifetime exclusion 