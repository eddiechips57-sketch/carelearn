#!/usr/bin/env bash
# Detects session-environment reverts (Lucide imports re-appearing) and restores MD3 backups.
BACKUPS="/tmp/cc-agent/42260821/project/.claude/md3-backups"
PAGES="/tmp/cc-agent/42260821/project/src/pages"

for name in RoleDetail News Support Profile; do
  src="$PAGES/${name}.tsx"
  bak="$BACKUPS/${name}.tsx"
  if [ -f "$src" ] && [ -f "$bak" ] && grep -q "from 'lucide-react'" "$src" 2>/dev/null; then
    cp "$bak" "$src"
  fi
done
