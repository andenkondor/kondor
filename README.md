# kondor

> [!NOTE]
> Heavily inspired by:
>
> - https://junegunn.github.io/fzf/tips/ripgrep-integration/

<br/>

A terminal-based interactive full-text search tool.

<br/>

![Kondor](assets/kondor.png)

## Summary

- Combines ripgrep's search power with fzf's easy-to-use [filter syntax](https://github.com/junegunn/fzf?tab=readme-ov-file#search-syntax).
- Add a simple search term and refine the results via word by word filtering in fzf - goodbye regex editing sessions.
- Prefix a filter term with `!` to exclude matching results.
- By default, fzf filters across file paths and line content simultaneously. Constrain to either with the filter column toggle.
- rg and fzf both use smart casing on default: Lowercase matches ignore case; uppercase forces case sensitivity.
- Different rg and fzf options simplify your current search task.

## Installation

### Brew

```sh
brew tap andenkondor/zapfhahn
brew install andenkondor/zapfhahn/kondor
```

## rg Options

These control how `ripgrep` scans the filesystem. Toggled from a toolbar row (keyboard or mouse):

| Key     | Option                 | Description                                            |
| ------- | ---------------------- | ------------------------------------------------------ |
| `Opt-1` | **Case Sensitivity**   | Toggle `--smart-case` / `--case-sensitive`             |
| `Opt-2` | **Word Regexp**        | Toggle `--word-regexp` (whole word matching)           |
| `Opt-3` | **Results Per File**   | Toggle `--max-count` (max. 1 result/file vs. no limit) |
| `Opt-4` | **Matches Per Result** | Toggle single match vs. all matches per result line    |
| `Opt-5` | **Unrestricted**       | Cycle unrestricted level (`-u`, `-uu`)                 |

## fzf Options

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
| `Ctrl-=`      | Cycle preview layout (right / bottom)                                  |
| `Ctrl-a`      | Toggle select all / deselect all marks                                 |
| `Ctrl-g`      | Toggle input focus between Rg search term and Fzf filter term          |
| `Ctrl-p`      | Toggle preview pane on/off                                             |
| `Ctrl-r`      | Refresh / re-run the current rg search                                 |
| `Ctrl-x`      | Delete (ignore) the selected result from the list                      |

## Configuration

Settings are stored in `~/.config/kondor/kondor-settings.yaml`. All fields are optional.

```yaml
# Preview pane
preview:
  showOnStart: false # show preview on startup (boolean)
  layout: right # location of the preview pane ("right" | "bottom")

# Custom openers (accessible via Shift+Enter popup)
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
