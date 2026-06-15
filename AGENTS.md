# Agents

## Build/Test/Lint

- See [`package.json`](package.json) for scripts,
- [`justfile`](justfile) for recipes

## Configuration

- Config is a merge of [`config.json`](config.json) defaults with CLI args — see `index.tsx`.

## Code Conventions

- See [`tsconfig.json`](tsconfig.json) for TypeScript config
- [`biome.json`](biome.json) for linter/formatter rules.

- Use named exports for all components, hooks, and utilities.

- Components and hooks communicate via global state (`ApplicationStateContext`) rather than prop drilling.

## General guidelines
- Performance is critical — keep memory and CPU footprint low.
- Keep [`README.md`](README.md) up to date with every change.
- All dependency versions must be pinned to exact versions (no `^` or `~` ranges).

## Directory Structure

```
src/
├── components/     UI components
│   ├── rg/         Rg control widgets (search term, case, word-regexp, ...)
│   ├── fzf/        Fzf control widgets (filter term, filter column)
│   ├── App.tsx, ResultList, Preview, ...
├── contexts/       React context providers (ApplicationState, Config)
├── definitions/    Core types/classes (SearchResult, Focus)
├── hooks/          State & lifecycle (useRg, useFzf, useInput, useSelection, ...)
└── tools/          External tool wrappers (Rg, Fzf, Editor, Bat, Idea)
```
