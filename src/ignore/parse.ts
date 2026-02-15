
/* IMPORT */

import normalize from '../glob/normalize';
import type {Glob} from '../types';

/* MAIN */

const parse = ( ignore: string ): Glob[] => {

  const lines = ignore.split ( /\r?\n|\r/g );
  const globs: Glob[] = [];

  for ( let i = 0, l = lines.length; i < l; i++ ) {

    let content = lines[i];

    if ( !content.trim () ) continue;
    if ( content.startsWith ( '#' ) ) continue;

    const negative = content.startsWith ( '!' );
    const directory = content.endsWith ( '/' );

    content = negative ? content.slice ( 1 ) : content;
    content = directory ? content.slice ( 0, -1 ) : content;
    content = normalize ( content );

    const glob = { content, directory, negative };

    globs.push ( glob );

  }

  return globs;

};

/* EXPORT */

export default parse;
