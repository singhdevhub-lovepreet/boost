# tmux-branch-panes — auto-label/group panes by git worktree branch (bash).
# Source this from ~/.bashrc:  source /path/to/hook.bash
# Bash has no chpwd hook, so we run before each prompt and act only when $PWD changed.
if [ -n "$TMUX" ] && command -v tmux-branch-group >/dev/null 2>&1; then
  _tbp_group() {
    if [ "$PWD" != "${_TBP_LAST_PWD:-}" ]; then
      _TBP_LAST_PWD="$PWD"
      tmux-branch-group >/dev/null 2>&1
    fi
  }
  case "${PROMPT_COMMAND:-}" in
    *_tbp_group*) : ;;                                              # already installed
    *) PROMPT_COMMAND="_tbp_group${PROMPT_COMMAND:+; $PROMPT_COMMAND}" ;;
  esac
  _tbp_group   # once now, for this pane
fi
