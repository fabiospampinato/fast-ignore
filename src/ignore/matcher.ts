
/* IMPORT */

import compile from './compile';
import parse from './parse';
import tick from './tick';
import type {Node, Options} from '../types';

/* MAIN */

const matcher = ( ignore: string | string[], options: Options = {} ): (( fileRelativePath: string ) => boolean) => {

  const ignores = Array.isArray ( ignore ) ? ignore : [ignore];
  const tiers = ignores.map ( parse ).filter ( tier => !!tier.length );

  if ( !tiers.length ) return () => false;

  const root = compile ( tiers, options );
  const cache: [segment: string, [nodesNext: Node[], negative: boolean, strength: number]][] = []; //TODO: What is this kind of cache called??

  return ( fileRelativePath: string ): boolean => { //TODO: Add an "isDirectory" option here, to properly account for globs ending with a slash

    const sep = fileRelativePath.includes ( '/' ) ? '/' : '\\';
    const length = fileRelativePath.length;

    let nodes = [root];
    let cacheable = true;

    let segmentIndex = 0;
    let segmentIndexNext = 0;
    let segmentNth = -1;
    let segment = '';

    while ( segmentIndex < length ) {

      segmentIndexNext = fileRelativePath.indexOf ( sep, segmentIndex );
      segmentIndexNext = ( segmentIndexNext === -1 ) ? length : segmentIndexNext;

      segment = fileRelativePath.slice ( segmentIndex, segmentIndexNext );
      segmentIndex = segmentIndexNext + 1;

      if ( !segment.length ) continue; // Consecutive slash

      segmentNth += 1;

      const cached = ( segmentNth < cache.length - 1 ) ? cache[segmentNth] : undefined;
      const cachedResult: [Node[], boolean, number] | undefined = cacheable && cached && cached[0] === segment ? cached[1] : undefined;
      const result = cachedResult || tick ( nodes, segment );

      cacheable = !!cachedResult;

      if ( !cachedResult ) {
        if ( cached ) {
          cached[0] = segment;
          cached[1] = result;
        } else {
          cache[segmentNth] = [segment, result];
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
