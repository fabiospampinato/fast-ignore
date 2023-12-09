
/* IMPORT */

import benchmark from 'benchloop';
import fs from 'node:fs';
import path from 'node:path';
import toIgnore from '../dist/index.js';

/* HELPERS */

const rootPath = path.resolve ( 'tasks/babel' );
const gitignorePath = path.join ( rootPath, '.gitignore' );
const gitignoreContent = fs.readFileSync ( gitignorePath, 'utf8' );
const prettierignorePath = path.join ( rootPath, '.prettierignore' );
const prettierignoreContent = fs.readFileSync ( prettierignorePath, 'utf8' );
const comboContent = gitignoreContent + '\n' + prettierignoreContent;
const filesPaths = fs.readdirSync ( rootPath, { recursive: true } ).sort ();

/* MAIN */

benchmark.config ({
  iterations: 10
});

benchmark ({
  name: '.gitignore',
  fn: () => {
    const ignore = toIgnore ( gitignoreContent );
    filesPaths.forEach ( ignore );
  }
});

benchmark ({
  name: '.prettierignore',
  fn: () => {
    const ignore = toIgnore ( prettierignoreContent );
    filesPaths.forEach ( ignore );
  }
});

benchmark ({
  name: '.gitignore + .prettierignore (individual)',
  fn: () => {
    const ignore1 = toIgnore ( gitignoreContent );
    const ignore2 = toIgnore ( prettierignoreContent );
    filesPaths.forEach ( ignore1 );
    filesPaths.forEach ( ignore2 );
  }
});

benchmark ({
  name: '.gitignore + .prettierignore (concat)',
  fn: () => {
    const ignore = toIgnore ( comboContent );
    filesPaths.forEach ( ignore );
  }
});

benchmark ({
  name: '.gitignore + .prettierignore (combo)',
  fn: () => {
    const ignore = toIgnore ([ gitignoreContent, prettierignoreContent ]);
    filesPaths.forEach ( ignore );
  }
});

benchmark.summary ();
