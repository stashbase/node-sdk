# Contributing

Thanks for your interest in contributing to Stashbase.

Contributions are welcome, including:

- Bug fixes
- Documentation improvements
- DX improvements

## Development

1. Fork the repository
2. Create a branch
3. Make your changes
4. Open a pull request

For larger changes, consider opening an issue first.

## Tests

- `bun run test` runs the hermetic unit test suite.
- `bun run test:integration` runs live API integration tests from `tests/integration/` and skips cleanly when required test credentials are not configured.

## Commit messages

This project follows Conventional Commits.

Examples:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code improvements without changing behavior

Example:

- `feat: add webhook retries`
