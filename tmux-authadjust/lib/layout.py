#!/usr/bin/env python3
# Build a tmux "columns of stacks" custom layout string from grouped panes.
#
# stdin:
#   line 1 : "<W> <H>"                         window width/height
#   line n : "<pane-id-number>\t<group-label>" one per pane, in window order
# stdout   : "<checksum>,<body>"  or  "FALLBACK" if the geometry cannot fit.
#
# Layout = one LEFTRIGHT column per group (first-seen order); a group with >1 pane
# becomes a TOPBOTTOM stack inside its column. Matches tmux's own layout grammar:
#   leaf  WxH,X,Y,id      columns {a,b}      stacks [a,b]     1-unit separators.
#
# The checksum reproduces tmux's layout_checksum() (layout-custom.c) exactly, so the
# string is accepted by `select-layout`.
import sys

FLOOR = 2  # min cell width/height (title row + content); below this -> FALLBACK


def dist(total, n):
    """Split `total` across n cells separated by n-1 single-unit borders."""
    avail = total - (n - 1)
    if avail < n:            # can't give every cell at least 1
        return None
    base, rem = divmod(avail, n)
    return [base + (1 if i < rem else 0) for i in range(n)]


def leaf(w, h, x, y, pid):
    return f"{w}x{h},{x},{y},{pid}"


def stack(panes, w, h, x, y):
    hs = dist(h, len(panes))
    if hs is None or min(hs) < FLOOR:
        raise ValueError("stack too small")
    parts, yy = [], y
    for ph, p in zip(hs, panes):
        parts.append(leaf(w, ph, x, yy, p))
        yy += ph + 1
    return f"{w}x{h},{x},{y}[{','.join(parts)}]"


def build(groups, W, H):
    if len(groups) == 1:
        g = groups[0]
        return leaf(W, H, 0, 0, g[0]) if len(g) == 1 else stack(g, W, H, 0, 0)
    ws = dist(W, len(groups))
    if ws is None or min(ws) < FLOOR:
        raise ValueError("columns too narrow")
    parts, x = [], 0
    for w, g in zip(ws, groups):
        parts.append(leaf(w, H, x, 0, g[0]) if len(g) == 1 else stack(g, w, H, x, 0))
        x += w + 1
    return f"{W}x{H},0,0{{{','.join(parts)}}}"


def checksum(body):
    c = 0
    for ch in body.encode():
        c = ((c >> 1) + ((c & 1) << 15)) & 0xffff
        c = (c + ch) & 0xffff
    return f"{c:04x}"


def main():
    data = sys.stdin.read().splitlines()
    if not data:
        print("FALLBACK"); return
    try:
        W, H = (int(x) for x in data[0].split())
    except ValueError:
        print("FALLBACK"); return
    order, groups_by = [], {}
    for line in data[1:]:
        if not line.strip():
            continue
        pid, _, label = line.partition("\t")
        if label not in groups_by:
            groups_by[label] = []
            order.append(label)
        groups_by[label].append(pid)
    groups = [groups_by[l] for l in order]
    if not groups:
        print("FALLBACK"); return
    try:
        body = build(groups, W, H)
    except ValueError:
        print("FALLBACK"); return
    print(f"{checksum(body)},{body}")


if __name__ == "__main__":
    main()
