#!/usr/bin/env bash
# Install tmux-branch-panes into ~/.local/bin and ~/.config/tmux-branch-panes.
# Override targets with TBP_BIN_DIR / TBP_LIB_DIR.
set -euo pipefail

REPO_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
BIN_DIR="${TBP_BIN_DIR:-$HOME/.local/bin}"
LIB_DIR="${TBP_LIB_DIR:-$HOME/.config/tmux-branch-panes}"

mkdir -p "$BIN_DIR" "$LIB_DIR"
install -m 0755 "$REPO_DIR/bin/tmux-branch-group" "$BIN_DIR/tmux-branch-group"
install -m 0644 "$REPO_DIR/lib/layout.py"         "$LIB_DIR/layout.py"
install -m 0644 "$REPO_DIR/shell/hook.zsh"        "$LIB_DIR/hook.zsh"
install -m 0644 "$REPO_DIR/shell/hook.bash"       "$LIB_DIR/hook.bash"

cat <<EOF

Installed:
  $BIN_DIR/tmux-branch-group
  $LIB_DIR/layout.py
  $LIB_DIR/hook.zsh
  $LIB_DIR/hook.bash

Next steps
  1) Make sure $BIN_DIR is on your PATH.
  2) tmux config:
       cat "$REPO_DIR/tmux/branch-panes.tmux.conf" >> ~/.tmux.conf
       tmux source-file ~/.tmux.conf
  3) Shell hook:
       zsh:  echo 'source $LIB_DIR/hook.zsh'  >> ~/.zshrc
       bash: echo 'source $LIB_DIR/hook.bash' >> ~/.bashrc
  4) Open a new shell, or inside tmux press:  prefix + g

Requirements: tmux >= 2.9, git >= 2.31, python3, zsh or bash.
EOF
