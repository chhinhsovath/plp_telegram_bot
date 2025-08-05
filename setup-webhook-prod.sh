#!/bin/bash

# Telegram Bot Configuration
BOT_TOKEN="8307675454:AAFDatyf-qU-OnQOTZsMXZJkCjI9smT3_ho"
WEBHOOK_URL="https://telebot.openplp.com/api/telegram/webhook"
WEBHOOK_SECRET="cf1be1187a34ee8d6a5131c741596ec068adaf11590b522fb826ac9a46865b0a"

echo "Setting up Telegram webhook..."

# Delete existing webhook
echo "Deleting existing webhook..."
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook"

echo ""
echo "Setting new webhook..."
# Set new webhook with secret token
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"${WEBHOOK_URL}\",
    \"secret_token\": \"${WEBHOOK_SECRET}\",
    \"allowed_updates\": [\"message\", \"edited_message\", \"channel_post\", \"edited_channel_post\", \"inline_query\", \"chosen_inline_result\", \"callback_query\", \"my_chat_member\", \"chat_member\"],
    \"drop_pending_updates\": true
  }")

echo "Response: $RESPONSE"

echo ""
echo "Getting webhook info..."
# Get webhook info
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo" | python3 -m json.tool

echo ""
echo "Testing bot info..."
# Get bot info
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getMe" | python3 -m json.tool