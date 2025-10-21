module.exports = {
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
    'git add'
  ],
  '*.{json,md,yml,yaml}': [
    'prettier --write',
    'git add'
  ],
  '*.{css,scss}': [
    'prettier --write',
    'git add'
  ]
}