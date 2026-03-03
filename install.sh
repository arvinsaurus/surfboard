#!/bin/bash

set -e

echo ""
echo "🏄 Installing Surfboard for Raycast..."
echo ""

# Install Homebrew if missing
if ! command -v brew &>/dev/null; then
    echo "📦 Installing Homebrew (this may take a few minutes)..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Add Homebrew to PATH for Apple Silicon
    if [[ -f /opt/homebrew/bin/brew ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi

# Install Node if missing
if ! command -v node &>/dev/null; then
    echo "📦 Installing Node.js..."
    brew install node
fi

# Get the directory this script lives in
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📦 Installing dependencies..."
npm install --silent

echo "🔨 Building extension..."
npm run build

echo ""
echo "✅ Done! One last step:"
echo ""
echo "   1. Open Raycast"
echo "   2. Go to Settings → Extensions → +"
echo "   3. Click 'Add Local Extension'"
echo "   4. Select this folder:"
echo "      $SCRIPT_DIR"
echo ""

# Try to open Raycast settings automatically
open raycast://extensions/raycast/raycast/import-extension 2>/dev/null || true
