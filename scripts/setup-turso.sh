#!/bin/bash

# Check if turso CLI is installed
if ! command -v turso &> /dev/null; then
    echo "❌ Turso CLI is not installed."
    echo "👉 Please install it by running:"
    echo "   curl -sSfL https://get.tur.so/install.sh | bash"
    echo "   source ~/.bashrc  # (or your shell config)"
    exit 1
fi

echo "✅ Turso CLI found."

# Check if logged in
if ! turso auth token &> /dev/null; then
    echo "❌ You are not logged in to Turso."
    echo "👉 Please run: turso auth login"
    exit 1
fi

echo "✅ You are logged in."
echo ""
echo "🚀 Next steps manually:"
echo "1. Create a database: turso db create <your-db-name>"
echo "2. Get the database URL: turso db show <your-db-name> --url"
echo "3. Create an auth token: turso db tokens create <your-db-name>"
echo "4. Update your .env file with:"
echo "   TURSO_DATABASE_URL=libsql://..."
echo "   TURSO_AUTH_TOKEN=..."
echo ""
echo "Once done, you can run migrations with: bun prisma migrate deploy"
