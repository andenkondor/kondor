## [0.9.3] - 2026-06-09

### ⚙️ Miscellaneous Tasks

- Fix changelog generation step
## [0.9.2] - 2026-06-09

### ⚙️ Miscellaneous Tasks

- Automated changelog generation
## [0.9.1] - 2026-06-08

### 🚀 Features

- Show errors in dedicated panel

### 📚 Documentation

- Init README
- Keep README.md up to date
## [0.9.0] - 2026-06-07

### 🚀 Features

- Set fzf to exact on default
- Add file opener
- Allow cli for file opening
- Open with shortcut
- Better popup visibility due to overlay color

### 🐛 Bug Fixes

- Don't lose input focus on open popup

### 💼 Other

- Tooling should ignore worktrees

### ⚙️ Miscellaneous Tasks

- Remove IDEA opening
## [0.8.1] - 2026-06-04

### 🐛 Bug Fixes

- Refresh functionality
- Home/end does not interfere with input

### 💼 Other

- Exclude worktrees from build
## [0.8.0] - 2026-06-03

### 🚀 Features

- Allow mouse control
- Set fzf to exact on default
## [0.7.3] - 2026-06-02

### 🐛 Bug Fixes

- Prevent rg crash on malformed result
## [0.7.2] - 2026-06-01

### 🐛 Bug Fixes

- Exception handling on non-parseable input
## [0.7.1] - 2026-05-31

### ⚙️ Miscellaneous Tasks

- Build on mac latest
## [0.7.0] - 2026-05-31

### 🚀 Features

- Show only one match per result
- Add rg -u/unrestricted options

### 🐛 Bug Fixes

- Smaller fixes
- Trim search and filter inputs

### 💼 Other

- Add build to justfile

### 📚 Documentation

- Add AGENTS.md

### ⚙️ Miscellaneous Tasks

- Bundle opentui lib in build
- Add typecheck step
- Introduce linting
- Sanity checks before push
## [0.6.7] - 2026-05-29

### 💼 Other

- Pin versions
## [0.6.6] - 2026-05-28

### 🚀 Features

- Smoother status indicator
## [0.6.5] - 2026-05-28

### 🚀 Features

- Add loading spinner

### 🐛 Bug Fixes

- Wrong highlighting
## [0.6.4] - 2026-05-27

### 🐛 Bug Fixes

- Missing result items when scroll page + fzf filter

### 💼 Other

- Update bun.lock

### ⚙️ Miscellaneous Tasks

- Update pipeline
## [0.6.3] - 2026-05-26

### 🚀 Features

- Rg path sorting is not configurable

### 🐛 Bug Fixes

- Wrong result line chopping in non-preview mode
## [0.6.2] - 2026-05-25

### 🚀 Features

- Show marked count in status border
- Toggle all marked items
- Selection symbol comes from config

### 🚜 Refactor

- Better 1st match access
## [0.6.1] - 2026-05-25

### 💼 Other

- Fix due to multiple created assets
## [0.6.0] - 2026-05-25

### 🚀 Features

- Preview delay decreased
- Allow result sorting
- Rg and fzf controls are responsive
- Open multiple marked

### 💼 Other

- Update some packages

### 🚜 Refactor

- Split ApplicationStateContext into multiple hooks

### ⚡ Performance

- Use opentui instead of ink
## [0.5.1] - 2026-05-19

### 🚀 Features

- Allow faster navigation

### 🐛 Bug Fixes

- Don't reset ignoredResultIds on rg refresh
## [0.5.0] - 2026-05-18

### 🚀 Features

- Manually remove results
- Manually refresh rg search

### ⚡ Performance

- Speed up tool usage

### ⚙️ Miscellaneous Tasks

- Duplicated fzf invocation
## [0.4.1] - 2026-05-17

### 🚀 Features

- Add rg --max-count option

### 🐛 Bug Fixes

- Extra space in result line content
- Problem when searching for flags
- Temp fix for new line in TitledBox

### ⚙️ Miscellaneous Tasks

- Fix config type
- Align parameter display
## [0.4.0] - 2026-05-14

### 🚀 Features

- Make borderType configurable

### 🐛 Bug Fixes

- Rendering issue on preview
- Broken word navigation in TextInput
- Selection lags when preview open

### ⚙️ Miscellaneous Tasks

- Update ink
## [0.3.1] - 2026-05-13

### 🚀 Features

- Improve id generation

### 🐛 Bug Fixes

- Broken lines due to tabs
## [0.3.0] - 2026-05-12

### 🚀 Features

- Improve coloring
- Add preview
- Add rg casing option
- Add rg word-regexp option
- Add fzf filter column
- Add short cut descriptions to inputs

### 🐛 Bug Fixes

- Open first item in list on init

### 🚜 Refactor

- Get rid of ResultText
## [0.2.1] - 2026-05-10

### 🚀 Features

- Show line number in result list
- Show result statistics
- Move cursor whole words in input
- Empty result list on loading
- Reset selection on new search
- Show current index indicator

### 🐛 Bug Fixes

- Not selectable elements due to height mismatch
- Gaps in result lines

### 🚜 Refactor

- Integrate focus context into application state context
- Introduce useInput hook

### ⚡ Performance

- Kill old rg/fzf processes on new search

### ⚙️ Miscellaneous Tasks

- Better id for SearchResult
## [0.2.0] - 2026-05-07

### 🚀 Features

- Different color for result filename
- Add key extractor in virtual list

### 🐛 Bug Fixes

- Allow shift in inputs
- Wrong title on fzf input
- Missing key error in result list
- Line breaks due to leading tabs
- Fzf searches now also in filename
- Improve input debouncing

### 🚜 Refactor

- Improve input component naming

### ⚡ Performance

- Improve rg search
## [0.1.0] - 2026-05-06

### 🐛 Bug Fixes

- Line number in idea
- Resolve memory leak by switching to ink-virtual-list
## [0.0.3] - 2026-05-06

### 🐛 Bug Fixes

- Config resolution
## [0.0.2] - 2026-05-06

### 🐛 Bug Fixes

- Make kondor executable
## [0.0.1] - 2026-05-05
