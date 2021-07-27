### Installations primaries

- npm init
- npm i -D typescript
- touch tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "react",
    "rootDir": "src",
    "baseUrl": "src",
    "allowJs": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noEmit": true
  },
  "include": [
    "src"
  ]
}
```
- npm i -D eslint eslint-config-standard-with-typescript@11 eslint-plugin-import eslint-plugin-promise 
eslint-plugin-standard @typescript-eslint/eslint-plugin eslint-plugin-node
- touch eslintrc.json
- configure with next structure
```json
{
  "extends": "standard-with-typescript",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/strict-boolean-expresions": "off"
  }
}
```
-touch .eslintignore
- install npm i -D lint-staged husky
- touch .lintstagedrc.json
```json
{
  "*.{ts,tsx}": [
    "eslint 'src/**' --fix"
  ]
}
```
- touch .huskyrc.json
```json
{
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```
- npx husky install
- touch pre-commit.sh in folder in .husky
-Add next code 
```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```
- npm i -D jest @types/jest ts-jest
- touch jest.config.js
- define in this file next object
```
module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.(ts|tsx)$': 'ts-jest'
  }
}
```