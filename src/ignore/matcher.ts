
/* IMPORT */

import compile from './compile';
import parse from './parse';
import tick from './tick';
import type {Node, Options} from '../types';

/* MAIN */

const matcher = ( ignore: string | string[], options: Options = {} ): (( fileRelativePath: string ) => boolean) => {

  const ignores = Array.isArray ( ignore ) ? ignore : [ignore];
  const tiers = ignores.map ( parse );
  const root = compile ( tiers, options );
  const cache: [segment: string, [nodesNext: Node[], negative: boolean, strength: number]][] = []; //TODO: What is this kind of cache called??

  return ( fileRelativePath: string ): boolean => { //TODO: Add an "isDirectory" option here, to properly account for globs ending with a slash

    const segments = fileRelativePath.split ( /[\\/]+/g );

    let nodes = [root];
    let cacheable = true;

    for ( let i = 0, l = segments.length; i < l; i++ ) {

      const segment = segments[i];
      const cached = ( i < cache.length - 1 ) ? cache[i] : undefined;
      const cachedResult: [Node[], boolean, number] | undefined = cacheable && cached && cached[0] === segment ? cached[1] : undefined;
      const result = cachedResult || tick ( nodes, segment );

      cacheable = !!cachedResult;

      if ( !cachedResult ) {
        if ( cached ) {
          cached[0] = segment;
          cached[1] = result;
        } else {
          cache[i] = [segment, result];
        }
      }

      if ( result[2] >= 0 && !result[1] ) return true;

      nodes = result[0];

      if ( !nodes.length ) return false;

    }

    return false;

  };

};

/* EXPORT */

export default matcher;
