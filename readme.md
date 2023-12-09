# Fast Ignore

A fast parser and processor for `.gitignore` files.

Note: terminal slashes on globs are ignored for now.

## Install

```sh
npm install --save fast-ignore
```

## Usage

```ts
import fastIgnore from 'fast-ignore';

// Let's create the content of a .gitignore file

const gitignore = `
# Some always-ignore files
*~
*.err
*.log
._*
.cache
.fseventsd
.DocumentRevisions*
.DS_Store
.TemporaryItems
.Trashes
Thumbs.db

# Some project-specific ignores
dist
node_modules
`;

// Let's create our ignore function

const ignore = fastIgnore ( gitignore );

// Now we can check if a relative path should be ignored

ignore ( 'foo/bar.js' ); // false
ignore ( 'node_modules/foo/bar.js' ); // true
ignore ( 'dist/foo/bar.js' ); // true
```

## License

MIT © Fabio Spampinato
