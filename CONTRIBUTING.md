
# Contributing to Virtual Legal Scribe

## Getting Started

1. Fork the repository
2. Clone your forked repository
3. Create a new branch for your feature or bugfix

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
npm run dev
```

## Workflow Process

We use GitHub Issues and Projects to track our development process:

1. **Issues**: All tasks, bugs, and feature requests are tracked as GitHub Issues
   - Use the appropriate issue template when creating a new issue
   - Include detailed descriptions, acceptance criteria, and examples
   - Apply labels to categorize the issue (bug, enhancement, frontend, etc.)

2. **Project Board**: We use GitHub Projects with a Kanban board approach
   - **To Do**: Issues that are ready to be worked on
   - **In Progress**: Issues currently being worked on
   - **Review**: Pull requests waiting for review
   - **Done**: Completed issues and merged PRs

3. **Branching Strategy**:
   - Create feature branches from `main` using the naming convention:
     - `feature/issue-number-brief-description` for new features
     - `bugfix/issue-number-brief-description` for bug fixes
   - Example: `feature/42-add-client-filtering`

4. **Pull Requests**:
   - Create a PR when your changes are ready for review
   - Reference the issue number in the PR description using "Fixes #issue-number"
   - Fill out the PR template completely
   - Request reviews from team members

## Commit Guidelines

- Use meaningful, descriptive commit messages
- Follow Conventional Commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `refactor:` for code refactoring
  - `test:` for adding or modifying tests

Examples:
- `feat: add client filtering component (#42)`
- `fix: resolve document upload validation error (#53)`
- `docs: update README with project setup instructions`

## Code Review Process

1. All code changes require at least one reviewer's approval
2. Address all review comments and questions
3. Once approved, the PR can be merged

## Testing Requirements

- Add unit tests for new features
- Ensure all tests pass before submitting a PR
- Aim for high test coverage

## Reporting Issues

- Use GitHub Issues to report bugs or suggest enhancements
- Provide detailed information about the issue
- Include steps to reproduce, expected behavior, and actual behavior

## Code of Conduct

Be respectful, inclusive, and considerate of others.
