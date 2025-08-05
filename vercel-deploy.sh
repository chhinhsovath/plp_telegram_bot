#!/bin/bash

echo "Deploying to Vercel with environment variables..."

# Set environment variables for the deployment
vercel --prod --yes \
  --env DATABASE_URL="postgresql://admin:P@ssw0rd@157.10.73.52:5432/plp_telegram_bot?schema=public" \
  --env NEXTAUTH_URL="https://telebot.openplp.com" \
  --env NEXTAUTH_SECRET="FdqSt9sEmMFnsBvzyKxh424wrhLccMtoJmS4V838/jM=" \
  --env TELEGRAM_BOT_TOKEN="8307675454:AAFDatyf-qU-OnQOTZsMXZJkCjI9smT3_ho" \
  --env TELEGRAM_WEBHOOK_SECRET="cf1be1187a34ee8d6a5131c741596ec068adaf11590b522fb826ac9a46865b0a"

echo "Deployment complete!"