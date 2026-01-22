#!/bin/bash

echo "🔐 Cloudflare Worker Secret Setup"
echo "================================="
echo "This script will help you set the necessary secrets for your Cloudflare Worker."
echo ""

# Function to set a secret
set_secret() {
    local key=$1
    local description=$2
    
    echo "Please enter the value for $key ($description):"
    read -s value
    echo ""
    
    if [ -n "$value" ]; then
        echo "Setting $key..."
        echo "$value" | npx wrangler secret put "$key"
        echo "✅ $key set."
    else
        echo "⚠️  Skipping $key (empty input)."
    fi
    echo "---------------------------------"
}

echo "Checking if logged in..."
npx wrangler whoami
if [ $? -ne 0 ]; then
    echo "❌ You are not logged in to Cloudflare."
    echo "Please run 'npx wrangler login' first."
    exit 1
fi

echo ""
echo "Ready to set secrets. Press Ctrl+C to cancel at any time."
echo ""

set_secret "TURSO_DATABASE_URL" "The libsql:// URL from Turso"
set_secret "TURSO_AUTH_TOKEN" "The authentication token from Turso"
set_secret "JWT_SECRET" "Secret key for signing JWT tokens"

echo ""
echo "🎉 All secrets processed!"
echo "You can now deploy your application with: npm run deploy"
