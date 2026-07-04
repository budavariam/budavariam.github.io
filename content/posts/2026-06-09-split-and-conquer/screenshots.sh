#!/usr/bin/env bash
# screenshots.sh — sets up each scenario for capturing post images
# Run from the post directory: bash screenshots.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}==>${NC} $*"; }
warn() { echo -e "${YELLOW}  →${NC} $*"; }

pause() {
  echo ""
  echo -e "${YELLOW}Drag to select the region to capture, then press Enter...${NC}"
  read -r
}

capture() {
  local filename="$1"
  screencapture -i "$SCRIPT_DIR/$filename"
  log "Saved: $SCRIPT_DIR/$filename"
}

cleanup() {
  tmux kill-session -t split-demo 2>/dev/null || true
  tmux kill-session -t nav-demo   2>/dev/null || true
}
trap cleanup EXIT

echo ""
echo "Screenshot helper — split-and-conquer post"
echo "==========================================="
echo ""

# ---------------------------------------------------------------------------
# 1. splits-overview.png
#    Vim with two vertical splits open + a plain shell pane beside it.
# ---------------------------------------------------------------------------
log "Screenshot 1/3: splits-overview.png"
warn "Creates a tmux session with vim (3 vertical splits) and a shell pane."

cleanup

tmux new-session  -d -s split-demo -x 220 -y 50
tmux send-keys    -t split-demo "vim -O ~/.vimrc ~/.bashrc ~/.zshrc" Enter
sleep 1
# narrow shell pane on the right
tmux split-window -h -t split-demo -p 30
tmux send-keys    -t split-demo "ls ~" Enter

echo ""
warn "Attach in a NEW terminal tab:"
echo "  tmux attach -t split-demo"
echo ""
warn "Resize the iTerm2 window as desired, then come back here."
pause
capture "splits-overview.png"
tmux kill-session -t split-demo

# ---------------------------------------------------------------------------
# 2. iterm-tmux-cc.png
#    tmux -CC must be launched from inside iTerm2 — manual setup required.
# ---------------------------------------------------------------------------
log "Screenshot 2/3: iterm-tmux-cc.png"
warn "tmux -CC only works when launched from inside iTerm2 — manual steps needed."
echo ""
echo "  1. Open a fresh iTerm2 tab"
echo "  2. Run:  tmux -CC new -s cc-demo"
echo "  3. Press Cmd+D  — iTerm2 creates a native split backed by tmux"
echo "  4. Run vim in one pane, leave a shell prompt in the other"
echo "  5. Come back here and press Enter"
echo ""
pause
capture "iterm-tmux-cc.png"

# ---------------------------------------------------------------------------
# 3. vim-tmux-nav.png
#    Vim split on the left, tmux shell pane on the right, cursor mid-jump.
# ---------------------------------------------------------------------------
log "Screenshot 3/3: vim-tmux-nav.png"
warn "Shows vim-tmux-navigator: jumping between a vim split and a tmux pane."

tmux new-session  -d -s nav-demo -x 220 -y 50
tmux send-keys    -t nav-demo "vim -O ~/.vimrc ~/.bashrc" Enter
sleep 1
tmux split-window -h -t nav-demo -p 35
tmux send-keys    -t nav-demo "printf 'tmux pane\nCtrl+h  →  jump into vim\nCtrl+l  →  jump back\n'" Enter

echo ""
warn "Attach in a NEW terminal tab:"
echo "  tmux attach -t nav-demo"
echo ""
warn "Navigate into vim with Ctrl+h, then back with Ctrl+l."
warn "Capture at a moment where one pane is clearly focused."
pause
capture "vim-tmux-nav.png"

echo ""
log "All done. Images written to:"
echo "  $SCRIPT_DIR/"
