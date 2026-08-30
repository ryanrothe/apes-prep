#!/bin/bash
# Deploy Terra (apes-prep) to GitHub Pages.
# iCloud is where you author; this clone is only a deploy target.
set -euo pipefail
cd "$(dirname "$0")"
SRC="$HOME/Library/Mobile Documents/com~apple~CloudDocs/karl/outputs/personal/apes-prep/"
rsync -a --delete --exclude .git --exclude deploy.sh --exclude .claude "$SRC" .
git add -A
if git diff --cached --quiet; then echo "Nothing to deploy."; exit 0; fi
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git push
echo "Pushed. Pages redeploys in ~30-60s."
