# Hugging Face Deployment Guide

This guide explains how to deploy your Synopsis application entirely on Vercel using Hugging Face Inference API.

## Overview

Instead of running a separate Python backend, we now use **Hugging Face Inference API** which:
- ✅ Runs entirely on Vercel (no separate backend needed)
- ✅ Serverless - only pay for what you use
- ✅ Auto-scales with traffic
- ✅ Free tier available (30,000 requests/month)

---

## Step 1: Get Hugging Face API Token

### 1.1 Create Hugging Face Account
1. Go to [huggingface.co](https://huggingface.co)
2. Click "Sign Up" (free account)
3. Verify your email

### 1.2 Generate API Token
1. Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Name it: `synopsis-summarizer`
4. Type: **Read** (sufficient for inference)
5. Click "Generate"
6. **Copy the token** - you'll need it for Vercel

---

## Step 2: Choose Your Model

You have two options:

### Option A: Use Public T5-Small (Quick Start)
- Model: `t5-small`
- No upload needed
- Works immediately
- Good quality summaries

### Option B: Upload Your Custom Model (Best Quality)
If you want to use your fine-tuned model:

1. **Install Hugging Face CLI:**
   ```bash
   pip install huggingface_hub
   ```

2. **Login to Hugging Face:**
   ```bash
   huggingface-cli login
   ```
   (paste your token when prompted)

3. **Upload your model:**
   ```python
   from transformers import T5ForConditionalGeneration, T5TokenizerFast
   
   # Load your trained model
   model = T5ForConditionalGeneration.from_pretrained("./results_t5small/checkpoint-1000")
   tokenizer = T5TokenizerFast.from_pretrained("./results_t5small/checkpoint-1000")
   
   # Push to Hugging Face Hub
   model.push_to_hub("your-username/synopsis-t5-summarizer")
   tokenizer.push_to_hub("your-username/synopsis-t5-summarizer")
   ```

4. **Your model URL will be:**
   `your-username/synopsis-t5-summarizer`

---

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub
```bash
cd c:\Users\lityo\Desktop\Abstractive-Text-Summarizer
git add .
git commit -m "Switch to Hugging Face API"
git push
```

### 3.2 Import Project to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. **Important:** Set Root Directory to `synopsis`
5. Framework will auto-detect as Next.js

### 3.3 Configure Environment Variables

Before deploying, add these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `HUGGINGFACE_API_TOKEN` | Your HF token from Step 1 | ✅ Yes |
| `HUGGINGFACE_MODEL` | `t5-small` or `your-username/model-name` | Optional (defaults to t5-small) |

**How to add:**
1. In Vercel project settings
2. Go to "Environment Variables"
3. Add both variables
4. Select all environments (Production, Preview, Development)

### 3.4 Deploy
1. Click "Deploy"
2. Wait ~2-3 minutes for build
3. Your app is live! 🎉

---

## Step 4: Test Your Deployment

### 4.1 Visit Your Site
- Click on the deployment URL
- Navigate to Summarizer section

### 4.2 Test Summarization
1. Paste some text
2. Select a style (Harsh/Balanced/Detailed)
3. Click "Generate Summary"
4. **First request might take 10-20 seconds** (model loading)
5. Subsequent requests: 3-5 seconds

### 4.3 Check for Errors
If you get errors:
- Check Vercel Function logs
- Verify `HUGGINGFACE_API_TOKEN` is set correctly
- Try again (first request loads the model)

---

## Pricing

### Hugging Face Inference API

**Free Tier:**
- 30,000 requests/month
- Rate limit: 100 requests/minute
- Perfect for personal projects

**Pro ($9/month):**
- Unlimited requests
- Higher rate limits
- Priority support

### Vercel

**Hobby (Free):**
- Perfect for this project
- 100GB bandwidth
- Serverless function executions included

**Pro ($20/month) - Only if needed:**
- More bandwidth
- Better analytics
- Team features

### Total Cost
- **Free tier:** $0/month (30k summaries)
- **Heavy usage:** $9/month (unlimited)

---

## Performance Notes

### First Request (Cold Start)
- Takes 10-20 seconds
- Model needs to load into memory
- Only happens after ~15 minutes of inactivity

### Subsequent Requests
- 3-5 seconds per summary
- Model stays warm
- Much faster experience

### Tips for Better Performance
1. **Model stays loaded** for ~15 minutes after last use
2. **Keep it warm** with periodic health checks (optional)
3. **Use caching** for repeated summaries (optional)

---

## Environment Variables Summary

Create `.env.local` in `synopsis` folder for local development:

```env
HUGGINGFACE_API_TOKEN=hf_your_token_here
HUGGINGFACE_MODEL=t5-small
```

For production (Vercel dashboard):
- Same variables as above
- Added via Vercel UI

---

## Troubleshooting

### Error: "Hugging Face API token not configured"
- Make sure `HUGGINGFACE_API_TOKEN` is set in Vercel
- Check spelling of environment variable name
- Redeploy after adding environment variables

### Error: "Model is loading. Please try again"
- This is normal on first request after idle period
- Wait 10-20 seconds and try again
- Model will stay loaded after first successful request

### Error: "Failed to generate summary"
- Check Hugging Face dashboard for API status
- Verify your token is valid
- Check if you've exceeded rate limits

### Slow performance
- First request is always slower (model loading)
- Subsequent requests should be 3-5 seconds
- Consider upgrading to HF Pro for better performance

---

## Advantages of This Approach

✅ **Single deployment** - Everything on Vercel
✅ **No server management** - Fully serverless
✅ **Auto-scaling** - Handles traffic automatically
✅ **Free tier** - 30k requests/month free
✅ **Easy updates** - Just push to GitHub
✅ **Global CDN** - Fast worldwide
✅ **Zero infrastructure** - No DevOps needed

---

## Optional: Use Your Custom Model

If you uploaded your fine-tuned model to Hugging Face:

1. **Update environment variable:**
   ```
   HUGGINGFACE_MODEL=your-username/synopsis-t5-summarizer
   ```

2. **Redeploy on Vercel**

3. **Test with your custom model**

Your summaries will now use your fine-tuned model quality!

---

## Comparison: Local Backend vs Hugging Face

| Feature | Local Backend (Railway) | Hugging Face API |
|---------|------------------------|------------------|
| Setup Complexity | Complex | Simple |
| Cost | $5/month minimum | $0-9/month |
| Performance | Consistent | Cold starts |
| Scaling | Manual | Automatic |
| Maintenance | Required | None |
| Deployment | 2 services | 1 service |
| Your Model | ✅ Yes | ✅ Yes (upload to HF) |

---

## Next Steps

1. ✅ Get Hugging Face API token
2. ✅ Set environment variables in Vercel
3. ✅ Deploy to Vercel
4. ✅ Test summarization
5. 📤 (Optional) Upload custom model to HF
6. 🎉 Share your deployed app!

---

## Support

- **Hugging Face Issues:** [forum.huggingface.co](https://forum.huggingface.co)
- **Vercel Issues:** [vercel.com/docs](https://vercel.com/docs)
- **Model Upload Help:** [huggingface.co/docs](https://huggingface.co/docs)
