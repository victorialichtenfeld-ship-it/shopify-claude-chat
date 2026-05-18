# How to Deploy Your Claude Shopify Chatbot

## STEP 1 — Upload to GitHub (2 min)
1. Go to github.com and sign up / log in (free)
2. Click the "+" icon → "New repository"
3. Name it: shopify-claude-chat
4. Click "Create repository"
5. Click "uploading an existing file"
6. Drag the entire `shopify-claude-chat` folder contents into the upload area
7. Click "Commit changes"

## STEP 2 — Deploy to Vercel (2 min)
1. Go to vercel.com and sign up with your GitHub account (free)
2. Click "Add New Project"
3. Click "Import" next to shopify-claude-chat
4. Click "Deploy" (leave all settings as-is)
5. Once deployed, copy your URL — it looks like: https://shopify-claude-chat-xxx.vercel.app

## STEP 3 — Add your API Key to Vercel (1 min)
1. In Vercel, go to your project → Settings → Environment Variables
2. Add:
   - Name: ANTHROPIC_API_KEY
   - Value: (paste your sk-ant-... key here)
3. Click Save
4. Go to Deployments → click the 3 dots → Redeploy

## STEP 4 — Add the chat widget to Shopify (3 min)
1. Edit the file `public/widget.js`:
   - Replace REPLACE_WITH_YOUR_VERCEL_URL with your Vercel URL from Step 2
   - Replace REPLACE_WITH_YOUR_STORE_NAME with your store name
2. In Shopify Admin → Online Store → Themes
3. Click "..." → "Edit code"
4. Open `layout/theme.liquid`
5. Find `</body>` near the bottom
6. Paste this ABOVE the `</body>` tag:

<script>
  (function() {
    var s = document.createElement('script');
    s.src = 'https://YOUR_VERCEL_URL/widget.js';
    document.body.appendChild(s);
  })();
</script>

Replace YOUR_VERCEL_URL with your actual Vercel URL.
7. Click Save

## Done! 
Your Claude AI chat assistant is now live on your store.
