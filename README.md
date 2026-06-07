# kondor

> [!NOTE]
> Heavily inspired by:
>
> - https://junegunn.github.io/fzf/tips/ripgrep-integration/
> - https://github.com/folke/snacks.nvim

<br/>

A terminal-based interactive full-text search tool. Combines [ripgrep](https://github.com/BurntSushi/ripgrep) (rg) for fast filesystem searches with [fzf](https://github.com/junegunn/fzf) for in-memory filtering.

<br/>

![Kondor](assets/kondor.png)

## Purpose

- **Plain text filtering**: Ripgrep uses regex syntax — Kondor's fzf layer lets you filter results by typing plain words. No escaping, no quantifiers, no lookaheads.
- **Smart case**: Lowercase matches ignore case; uppercase forces case sensitivity — all inferred from your input.
- **Multi-column search**: By default, fzf filters across file paths and line content simultaneously. Constrain to either with the filter column toggle.
- **Inverted search**: Prefix a term with `!` to exclude matching results.
- **Conversational refinement**: Turn search refinement into a word-by-word process instead of a regex editing session.
- **Full fzf syntax**: See the [fzf README](https://github.com/junegunn/fzf?tab=readme-ov-file#search-syntax) for all search syntax details.

## Installation

### Brew

```sh
brew tap andenkondor/zapfhahn
brew install andenkondor/zapfhahn/kondor
```

## Rg Options

These control how `ripgrep` scans the filesystem. Toggled from a toolbar row (keyboard or mouse):

| Key     | Option                 | Description                                         |
| ------- | ---------------------- | --------------------------------------------------- |
| `Opt-1` | **Case Sensitivity**   | Toggle `--smart-case` / `--case-sensitive`          |
| `Opt-2` | **Word Regexp**        | Toggle `--word-regexp` (whole word matching)        |
| `Opt-3` | **Results Per File**   | Toggle `--max-count` (1 result/file vs. no limit)   |
| `Opt-4` | **Matches Per Result** | Toggle single match vs. all matches per result line |
| `Opt-5` | **Unrestricted**       | Cycle unrestricted level (`-u`, `-uu`)              |

## Fzf Options

These control how `fzf` filters the rg results. Toggled from a second toolbar row (keyboard or mouse):

| Key     | Option            | Description                                      |
| ------- | ----------------- | ------------------------------------------------ |
| `Opt-6` | **Filter Column** | Cycle through "all" / "filePath" / "lineContent" |
| `Opt-7` | **Exact Match**   | Toggle exact vs. fuzzy matching                  |

## Remaining Shortcuts

### Navigation

| Key                   | Action                    |
| --------------------- | ------------------------- |
| `Up` / `Down`         | Move selection            |
| `PageUp` / `PageDown` | Move selection by 5 lines |
| `Home`                | Jump to first result      |
| `End`                 | Jump to last result       |

### Actions

| Key           | Action                                                                 |
| ------------- | ---------------------------------------------------------------------- |
| `Enter`       | Open result(s) in Neovim (single result or quickfix list for multiple) |
| `Shift+Enter` | Show "Open with" popup to pick a custom opener                         |
| `Tab`         | Toggle mark on the selected result                                     |
| `Ctrl-A`      | Toggle select all / deselect all marks                                 |
| `Ctrl-X`      | Delete (ignore) the selected result from the list                      |
| `Ctrl-P`      | Toggle preview pane on/off                                             |
| `Ctrl-G`      | Toggle input focus between Rg search term and Fzf filter term          |
| `Ctrl-R`      | Refresh / re-run the current rg search                                 |

## Configuration

Settings are stored in `~/.config/kondor/kondor-settings.yaml`:

### `openers`

A list of custom programs to open the selected result with, accessible via the `Shift+Enter` popup.

```yaml
openers:
  - description: "vim"
    command: 'vim {{.SelectedFile.Name}} -c "call cursor({{.SelectedFile.LineNumber}}, {{.SelectedFile.ColumnNumber}}"'
    terminal: true
  - description: "Zed"
    command: "zed . {{.SelectedFile.Name}}:{{.SelectedFile.LineNumber}}:{{.SelectedFile.ColumnNumber}}"
```

| Placeholder                      | Description               |
| -------------------------------- | ------------------------- |
| `{{.SelectedFile.Name}}`         | File path (shell-escaped) |
| `{{.SelectedFile.LineNumber}}`   | Line number               |
| `{{.SelectedFile.ColumnNumber}}` | Column number             |

Set `terminal: true` for CLI programs that need to take over the terminal. Omit it or set `false` for GUI apps that launch in the background.
