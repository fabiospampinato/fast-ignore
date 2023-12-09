
/* IMPORT */

import {parse} from 'grammex';
import Grammar from './grammar';

/* MAIN */

const _parse = ( glob: string, caseSensitive: boolean ): RegExp => {

  const source = parse ( glob, Grammar, { memoization: false } ).join ( '' );
  const flags = caseSensitive ? '' : 'i';
  const re = new RegExp ( `^${source}$`, flags );

  return re;

};

/* EXPORT */

export default _parse;
