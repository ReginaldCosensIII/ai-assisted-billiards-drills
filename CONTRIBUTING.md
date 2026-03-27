# Contributing to ai-assisted-billiards-drills

Thank you for your interest in this project. Please read the following guidelines before contributing.

## Current Phase

This project is in **Foundation Setup (Mission 1)**. During this phase:

- **Do not implement product features.** All feature work is blocked until scoping is complete.
- **Do not introduce final framework or technology choices.** Decisions will be documented in `docs/architecture/` first.
- **Do not add speculative architecture, wireframes, or prototype code.**

## Branching

- Use `main` as the stable trunk.
- Create feature branches from `main` using descriptive names: `docs/scope-draft`, `tooling/editorconfig`, etc.
- Open a pull request and request review before merging.

## Commit Style

Write clear, imperative commit messages:

```
docs: add master-brief placeholder
tooling: add editorconfig
chore: initialize gitignore
```

## Code Style

- EditorConfig is enforced at the project root — ensure your editor respects it.
- Additional linting and formatting rules will be defined in `tooling/` once a framework is selected.

## Documentation

- All architectural decisions must be recorded as ADRs in `docs/adrs/`.
- Scope changes must be captured in `docs/scope/`.
- Do not add documentation directly to source directories — use the appropriate `docs/` subfolder.

## Questions

If you are unsure whether a change is appropriate for the current phase, hold it until the scope and architecture phases are complete.
