# Push to GitHub - Step by Step

## Method 1: Personal Access Token (Recommended)

### Step 1: Create Personal Access Token
1. Go to [GitHub.com](https://github.com) → Settings
2. Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Select scope: ✅ `repo` (Full control of private repositories)
5. Copy the token (starts with `ghp_` or `gho_`)

### Step 2: Push Code
```bash
# In your terminal, run:
git push -u origin main

# When prompted:
# Username: Dandandan2024
# Password: [paste your personal access token]
```

## Method 2: GitHub Desktop (Easiest)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Clone repository: `Dandandan2024/Stepbystepfamilylaw`
4. Copy all files from your project folder
5. Commit and push through GitHub Desktop

## Method 3: Manual Upload

1. Go to your GitHub repository: https://github.com/Dandandan2024/Stepbystepfamilylaw
2. Click "uploading an existing file"
3. Drag and drop all files from your project folder
4. Commit with message: "Initial commit: Step by Step Family Law website"

## Method 4: SSH Key (Advanced)

1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```

2. Add to GitHub:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - GitHub → Settings → SSH and GPG keys → New SSH key

3. Change remote URL:
   ```bash
   git remote set-url origin git@github.com:Dandandan2024/Stepbystepfamilylaw.git
   git push -u origin main
   ```

## Troubleshooting

- **403 Error:** Authentication issue - use personal access token
- **Permission denied:** Make sure you're the owner of the repository
- **Repository not found:** Check the repository name and URL

## After Successful Push

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy automatically
4. Configure custom domain (optional)

Your website will be live at: `https://stepbystepfamilylaw.vercel.app`