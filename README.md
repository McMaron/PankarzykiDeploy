![CC.TTFootball](/frontend/public/images/nowelogo.jpg)

# CC.TTFootball
Po naszemu - Piłkarzyki

## How to install dependency modules

```bash
npm i
```

## How to run development react/server concurrently

```sh
npm run dev
```

## How to run eslint

```sh
npm run lint
```

## How to run prettier format

```sh
npm run format
```

## How to setup git pre-commit hook
```sh
cp .git/hooks/pre-commit.sample .git/hooks/pre-commit

# Open .git/hooks/pre-commit with editor and replace last line with:

set -e
npm run lint && npm run format
exec git diff-index --check --cached $against --
```