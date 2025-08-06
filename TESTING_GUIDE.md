# Testing Guide for PLP Telegram Bot

## Overview

This project uses Jest for unit testing with TypeScript support. Tests are automatically run before pushing to GitHub via Git hooks.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode (used by GitHub Actions)
npm run test:ci
```

## Test Structure

```
__tests__/
├── unit/
│   ├── api/          # API route tests
│   ├── components/   # React component tests
│   └── lib/          # Library and utility tests
└── integration/      # Integration tests
```

## What's Tested

### 1. Telegram Handlers (`lib/telegram/handlers.ts`)
- Message handling (text, photo, video, document)
- Member join/leave events
- Bot added/removed from groups
- Group and user creation
- Analytics event tracking

### 2. Utility Functions
- `cn()` utility for className merging
- Validation schemas (Zod)

### 3. API Routes
- Webhook endpoint handling
- Error handling

## Pre-push Hook

A Git hook automatically runs tests before pushing to ensure code quality:
- Runs all tests
- Runs ESLint
- Prevents push if tests or linting fail

## GitHub Actions CI

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

The CI pipeline:
1. Runs tests on Node.js 18.x and 20.x
2. Checks code coverage
3. Runs linting
4. Builds the application

## Writing New Tests

### Example Unit Test

```typescript
import { functionToTest } from '@/lib/utils';

describe('functionToTest', () => {
  it('should handle normal cases', () => {
    const result = functionToTest('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(() => functionToTest(null)).toThrow();
  });
});
```

### Mocking Dependencies

```typescript
// Mock Prisma
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock external APIs
jest.mock('@/lib/telegram/bot', () => ({
  bot: {
    handleUpdate: jest.fn(),
  },
}));
```

## Coverage Reports

After running `npm run test:coverage`, check:
- `coverage/lcov-report/index.html` for detailed HTML report
- Console output for summary

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Test Names**: Use descriptive test names that explain what's being tested
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Don't make real API calls in unit tests
5. **Test Edge Cases**: Include error scenarios and boundary conditions

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Ensure `tsconfig.json` paths are configured correctly
   - Check that Jest's `moduleNameMapper` matches your path aliases

2. **Environment variable errors**
   - Test environment variables are set in `jest.setup.ts`
   - Add new required variables there

3. **Async test timeouts**
   - Increase timeout for slow tests: `jest.setTimeout(10000)`
   - Ensure all promises are properly awaited

## Next Steps

To add more test coverage:
1. Add component tests for React components
2. Add integration tests for full API flows
3. Add E2E tests using Playwright or Cypress
4. Set up mutation testing with Stryker