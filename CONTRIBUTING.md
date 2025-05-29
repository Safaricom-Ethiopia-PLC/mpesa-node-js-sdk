# Contributing to the SDK

Thanks for taking the time to improve M-Pesa for Node.js! This is a small document to get you started. Before submitting a new issue or PR, check if it already exists in issues or PRs.

### Areas you can contribute

**Issues**

Probably the best way to get going is to see if there is open issues acknowledged by the team. Feel free to open an issue if you found a bug or a missing feature you'd like to work on, and there aren't any issues mentioning it.

**New Core Features**

Before you start working on a new core feature it's better to open an issue first. Once you have a green light you can get started. If you start working on something larger, it's a good idea to create a draft (WIP) PR at an early stage so that we can guide you in the right direction.

### A Few Guidelines to keep in mind

- Rather than extensive configurations, focus instead on providing opinionated, best-practice defaults.
- Everything should be type-safe and embrace typescript magic when necessary.

## Development

1. Fork the repo
2. clone your fork.
3. install node.js (preferable latest LTS).
4. create a `.env` file (if it doesn't exist)
5. run `npm i` in your terminal to install dependencies.
6. create a branch.
7. build the project using `npm build`
8. create a draft pull request. link the relevant issue by referring to it in the PR's description. Eg.closes #123 will link the PR to issue/pull request #123.
9. implement your changes.

## Testing

- Add your tests in the `__tests__` folder with a `.test.ts` extention.
- Only use jest for testing.
