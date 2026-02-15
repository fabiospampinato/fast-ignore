# Fast Ignore

A fast parser and processor for `.gitignore` files.

## Install

```sh
npm install fast-ignore
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

# Some directory-only ignores
dir/
`;

// Let's create our ignore function

const ignore = fastIgnore ( gitignore );

// Now we can check if a relative path should be ignored

ignore ( 'foo/bar.js' ); // false
ignore ( 'node_modules/foo/bar.js' ); // true
ignore ( 'dist/foo/bar.js' ); // true

// Directory-only globs are supported _automatically_ when the situation is unambiguous
// In the following scenario we know for sure that "dir" must be a directory, so it's ignored

ignore ( 'dir/foo.js' ); // true

// Directory-only globs are supported _manually_ when the situation is ambiguous
// In the following scenario we can't know for sure if "dir" is a file or a directory
// We are going to assume it's not a directory, but if it is you need to tell the library by passing "true" as the second argument

ignore ( 'dir' ); // false
ignore ( 'dir', true ); // true

// We can also work with multiple ignore files at once, which is faster than handling them individually
// This goes roughly as fast as just concatenating the files together, but with the semantics of separate files
// The difference is that an ignore file that comes later won't be able to un-ignore something that was ignored by a previous one
// As a result please note that writing `fastIgnore ([ 'dist', '!dist' ])` may work differently than you expected

const prettierignore = `
**/test
**/__test__

# The following globs are effectively useless
# because they can't un-ignore something that was ignored by any previous ignore files
!dist
!node_modules
`;

const comboIgnore = fastIgnore ([ gitignore, prettierignore ]);

comboIgnore ( 'foo/bar.js' ); // false
comboIgnore ( 'node_modules/foo/bar.js' ); // true
comboIgnore ( 'dist/foo/bar.js' ); // true
comboIgnore ( 'test/foo/bar.js' ); // true
```

## License

MIT © Fabio Spampinato
