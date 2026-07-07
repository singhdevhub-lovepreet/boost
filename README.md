# Boost

A collection of productivity tools for developers. Each tool lives in its own directory and can be installed independently.

## Website

The Boost marketing site is published at [https://singhdevhub-lovepreet.github.io/boost/](https://singhdevhub-lovepreet.github.io/boost/). The source for the site lives in [`docs/`](docs/).

## Features

### [tmux-auto-adjust](./tmux-auto-adjust/)

Auto-group tmux panes by git branch. When you work across multiple git worktrees, panes are automatically organized into columns — one per branch — within a single tmux window. Each pane is labeled and color-coded by its `repo/branch`, and when you `cd` into a different worktree the pane moves to the correct column on its own.

```
      feature-login            bugfix-nav
   +------------------+------------------+
   | myapp/feature %0 | myapp/bugfix  %1 |
   |                  +------------------+
   |                  | myapp/bugfix  %2 |
   +------------------+------------------+
```

**Highlights:**
- Per-pane branch labels with color coding
- Automatic regrouping on directory change
- Worktree-aware (groups by branch, not folder)
- Non-destructive — manual pane resizing is preserved

See the [tmux-auto-adjust README](./tmux-auto-adjust/README.md) for full documentation, installation, and usage.

## License

MIT — see [LICENSE](LICENSE).
