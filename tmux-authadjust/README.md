# tmux-branch-panes

**Auto-group your tmux panes by git branch — one column per branch, stacked inside a single window, each pane labeled and color-coded by its branch.**

If you work across several [git worktrees](https://git-scm.com/docs/git-worktree) of the same repo, you end up with a bunch of shells in one tmux window and no idea which pane is on which branch. `tmux-branch-panes` fixes that: every pane wears its `repo/branch` label on its top border, panes on the same branch are collected into a shared column, and when a pane's shell `cd`s into a different branch it **moves to that branch's column automatically** — all without ever spawning a new window/tab.

```
      feature-login            bugfix-nav
   ┌──────────────────┬──────────────────┐
   │ myapp/feature %0 │ myapp/bugfix  %1 │
   │                  ├──────────────────┤
   │                  │ myapp/bugfix  %2 │
   └──────────────────┴──────────────────┘
     one column per branch; same-branch panes stacked within it
```

---

## What it does

- **Per-pane branch labels.** Each pane's top border shows `repo/branch` (from its shell's current directory), colored by a hash of the branch name so a branch is instantly recognizable.
- **Branch columns.** Panes on the same branch are grouped into a single vertical column and stacked; different branches sit in side-by-side columns — all in **one window**.
- **Automatic regrouping.** When a pane changes branch (e.g. you `cd` into another worktree), that pane leaves its old column and joins/creates the column for its new branch. It never gets ripped out into a separate window.
- **Worktree-aware.** Repo identity is the *shared* `.git` (git's "common dir"), so multiple worktrees of one repo group by **branch**, not by folder.
- **Non-destructive.** Manual pane resizing is preserved — a re-layout only happens when the grouping actually changes (tracked via a per-window signature). Windows that are too small to fit the columns gracefully fall back to a tiled layout.

## How it works

Three small pieces:

| File | Role |
|------|------|
| `bin/tmux-branch-group` | The engine (bash). Computes each pane's `repo/branch`, labels it, and rebuilds the window into branch columns. |
| `lib/layout.py` | Generates a tmux **custom layout string** (`{columns}` of `[stacks]`) with the exact geometry and tmux's `layout_checksum` so `select-layout` accepts it. |
| `shell/hook.zsh` / `hook.bash` | Fires the engine on every directory change (zsh `chpwd`; bash `PROMPT_COMMAND`) and once at shell start. |

The interesting bit is the layout string. tmux encodes a window's split tree as e.g.
`4efd,200x50,0,0[200x24,0,0{99x24,0,0,0,100x24,100,0,1},200x25,0,25,2]` where `{}` is a
left/right split, `[]` is a top/bottom split, each leaf ends in its **pane id**, and the
leading `4efd` is a checksum. `layout.py` builds that tree — one `{}` column per branch,
each multi-pane branch as a nested `[]` stack — distributes the window's width/height with
1-unit separators between cells, and computes the checksum tmux expects. The engine then
applies it with a single `tmux select-layout "<string>"`, so panes are repositioned by id
without any `join-pane`/`break-pane` shuffling.

Grouping key: `basename(dirname(git rev-parse --git-common-dir)) + "/" + <branch>`.

## Requirements

- **tmux** ≥ 2.9 (uses `pane-border-status`, `select-pane -T`, custom layouts; developed on 3.6)
- **git** ≥ 2.31 (for `rev-parse --path-format=absolute --git-common-dir`)
- **python3** (layout-string generation)
- **zsh** or **bash**

## Install

```sh
git clone https://github.com/<you>/tmux-branch-panes
cd tmux-branch-panes
./install.sh
```

`install.sh` copies `tmux-branch-group` to `~/.local/bin` and the helper/hooks to
`~/.config/tmux-branch-panes`. Then, as it prints:

1. Ensure `~/.local/bin` is on your `PATH`.
2. Enable the tmux settings:
   ```sh
   cat tmux/branch-panes.tmux.conf >> ~/.tmux.conf
   tmux source-file ~/.tmux.conf
   ```
3. Enable the shell hook:
   ```sh
   # zsh
   echo 'source ~/.config/tmux-branch-panes/hook.zsh' >> ~/.zshrc
   # bash
   echo 'source ~/.config/tmux-branch-panes/hook.bash' >> ~/.bashrc
   ```
4. Open a new shell, or inside tmux press **`prefix + g`** to group everything now.

### Manual / run-from-clone

You don't have to install. Add `bin/` to your `PATH` (the engine finds `lib/layout.py`
relative to itself), source `shell/hook.zsh`, and append `tmux/branch-panes.tmux.conf`
to your tmux config (fix the `prefix + g` path to point at your clone's `bin/`).

## Usage

- Just work. Open shells, `cd` between worktrees — labels and columns update on their own.
- **`prefix + g`** — regroup every pane in the current session on demand (also the way to
  label pre-existing shells that were started before the hook was installed).
- `tmux-branch-group --print [dir]` — print the label a directory maps to (debugging).

## Configuration

- **Colors** — edit the `PALETTE` array in `bin/tmux-branch-group` (256-color codes).
- **Label format / position** — edit `pane-border-format` in `tmux/branch-panes.tmux.conf`.
- **Minimum cell size before falling back to tiled** — `FLOOR` in `lib/layout.py`.
- **Explicit helper path** — set `TBP_LAYOUT_HELPER=/path/to/layout.py` if auto-resolution
  doesn't find it.

## Uninstall

```sh
rm ~/.local/bin/tmux-branch-group
rm -rf ~/.config/tmux-branch-panes
```
Remove the `source .../hook.*` line from your shell rc and the `tmux-branch-panes`
block from `~/.tmux.conf`.

## Limitations / notes

- Layout is **columns of stacks** (one column per branch). Rows-per-branch and sorted-tiled
  variants are easy to add in `layout.py` but not shipped.
- Regrouping is automatic on branch change; there is no per-session on/off toggle yet.
- The bash hook uses `PROMPT_COMMAND` diffing (bash has no native `chpwd`); the zsh path is
  the primary, more thoroughly exercised one.
- Designed around git worktrees, but works for any git repo (a plain repo is just one
  branch → one column) and non-git dirs (labeled by directory basename).

## License

MIT — see [LICENSE](LICENSE).
