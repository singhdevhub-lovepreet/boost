# tmux-branch-panes — auto-label/group panes by git worktree branch (zsh).
# Source this from ~/.zshrc:  source /path/to/hook.zsh
if [[ -n "$TMUX" ]] && command -v tmux-branch-group >/dev/null 2>&1; then
  autoload -Uz add-zsh-hook
  _tbp_group() { tmux-branch-group >/dev/null 2>&1 }
  add-zsh-hook chpwd _tbp_group   # run on every directory change
  _tbp_group                      # and once now, for this pane
fi
