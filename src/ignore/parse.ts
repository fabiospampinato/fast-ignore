
/* IMPORT */

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

    content = content.replace ( /^\\(!|#)/, '$1' );
    content = content.replace ( /((?:\\\s)*)\s*$/, ( $0, $1 ) => $1.replaceAll ( '\\', '' ) );
    content = negative ? content.slice ( 1 ) : content;

    const glob = { content, negative };

    globs.push ( glob );

  }

  return globs;

};

/* EXPORT */

export default parse;
