# Contributing Guide

## Code Standards

### File Structure
```
/src
  /component
    ├── Component.js        # Main file
    ├── Component.test.js   # Tests
    └── README.md          # Component docs
```

### Naming Conventions
- **Files**: PascalCase for classes, camelCase for utilities
- **Functions**: camelCase, verb-based (getUrl, createShortUrl)
- **Constants**: SCREAMING_SNAKE_CASE
- **Routes**: kebab-case (/api/short-url)

### Code Style
```javascript
// Use async/await
async function fetchData() {
  try {
    const result = await service.process();
    return result;
  } catch (error) {
    logger.error('Failed to fetch', { error });
    throw error;
  }
}

// Always use const/let, never var
const url = req.body.url;
let counter = 0;

// Use meaningful variable names
const isUrlValid = validator.isURL(url);
const userAgent = req.get('user-agent');
```

### Comments
```javascript
/**
 * Brief description of what function does
 * 
 * Longer explanation if needed:
 * - Point 1
 * - Point 2
 * 
 * @param {type} paramName - Description
 * @returns {type} What it returns
 * @throws {ErrorType} When this is thrown
 * @example
 * const result = functionName(param);
 */
function functionName(paramName) {
  // Implementation
}
```

## Testing Requirements

- All new features must have tests
- Aim for >80% code coverage
- Use descriptive test names
- Test both happy path and error cases

```javascript
describe('Feature Name', () => {
  it('should do X when Y happens', async () => {
    // Arrange
    const input = createTestData();
    
    // Act
    const result = await function(input);
    
    // Assert
    expect(result).toBe(expected);
  });

  it('should throw error when invalid', async () => {
    expect(async () => {
      await function(invalidInput);
    }).rejects.toThrow(InvalidError);
  });
});
```

## Git Workflow

### Branching
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `release/*` - Release preparation

### Commits
```bash
# Commit message format
[TYPE] Brief description

Detailed explanation if needed:
- Change 1
- Change 2

# Types
[FEATURE] Add new capability
[BUGFIX] Fix existing issue
[DOCS] Documentation update
[REFACTOR] Code improvement
[TEST] Add/update tests
[CHORE] Build/config changes
```

## Pull Request Process

1. Create feature branch from `develop`
2. Write tests for new code
3. Update documentation
4. Commit with clear messages
5. Push and create PR
6. Respond to reviews
7. Merge when approved

### PR Template
```markdown
## Description
What does this PR do?

## Related Issues
Closes #123

## Testing
- [ ] Added tests
- [ ] All tests pass
- [ ] Manual testing

## Checklist
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No console.log() left
- [ ] No hardcoded values
```

## Release Process

```bash
# 1. Update version in package.json
npm version minor

# 2. Update CHANGELOG.md
# 3. Create release branch
git checkout -b release/v1.1.0

# 4. Commit version bump
git commit -m "Bump version to 1.1.0"

# 5. Merge to main with tag
git checkout main
git merge release/v1.1.0
git tag -a v1.1.0 -m "Release version 1.1.0"

# 6. Push
git push origin main --tags
```

## Performance Guidelines

- Keep middleware response time < 10ms
- Database queries < 100ms
- API endpoints < 500ms
- Cache frequently accessed data

```javascript
// Use .select() to limit fields
const urls = await URLMapping.find({}).select('shortCode clickCount');

// Use .lean() for read-only queries
const urls = await URLMapping.find({}).lean();

// Use pagination for large datasets
.skip((page - 1) * limit).limit(limit)

// Use indexes for frequently filtered fields
urlMappingSchema.index({ shortCode: 1, isActive: 1 });
```

## Security Checklist

- [ ] Validate all user inputs
- [ ] Use parameterized queries (Mongoose handles this)
- [ ] Never log sensitive data (passwords, tokens)
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Sanitize error messages
- [ ] Keep dependencies updated

```bash
# Check for vulnerabilities
npm audit

# Update packages
npm update

# Check outdated packages
npm outdated
```

---

**Last Updated:** January 2026
