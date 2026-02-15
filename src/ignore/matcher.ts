
/* IMPORT */

import compile from './compile';
import parse from './parse';
import tick from './tick';
import type {Options, PathOptions, Tick} from '../types';

/* MAIN */

const matcher = ( ignore: string | string[], options: Options = {} ): (( relativePath: string, options?: PathOptions ) => boolean) => {

  const ignores = Array.isArray ( ignore ) ? ignore : [ignore];
  const tiers = ignores.map ( parse ).filter ( tier => !!tier.length );

  if ( !tiers.length ) return () => false;

  const root = compile ( tiers, options );
  const cache: { result: Tick, segment: string, isSegmentDirectory: boolean }[] = []; // Prefix-caching tick outputs by segment

  return ( relativePath: string, options?: PathOptions ): boolean => {

    const isDirectory = options?.isDirectory ?? false;

    const sep = relativePath.includes ( '/' ) ? '/' : '\\';
    const length = relativePath.length;

    let nodes = [root];
    let cacheable = true;

    let segmentIndex = 0;
    let segmentIndexNext = 0;
    let segmentNth = -1;
    let segment = '';
    let isSegmentDirectory = false;

    while ( segmentIndex < length ) {

      segmentIndexNext = relativePath.indexOf ( sep, segmentIndex );
      segmentIndexNext = ( segmentIndexNext === -1 ) ? length : segmentIndexNext;

      segment = relativePath.slice ( segmentIndex, segmentIndexNext );
      segmentIndex = segmentIndexNext + 1;
      isSegmentDirectory = ( segmentIndex < length ) || isDirectory;

      if ( !segment.length ) continue; // Consecutive slash

      segmentNth += 1;

      const cached = ( segmentNth < cache.length - 1 ) ? cache[segmentNth] : undefined;
      const cachedResult: Tick | undefined = cacheable && cached && cached.segment === segment && cached.isSegmentDirectory === isSegmentDirectory ? cached.result : undefined;
      const result: Tick = cachedResult || tick ( nodes, segment, isSegmentDirectory );

      cacheable = !!cachedResult;

      if ( !cachedResult ) {
        if ( cached ) {
          cached.result = result;
          cached.segment = segment;
          cached.isSegmentDirectory = isSegmentDirectory;
        } else {
          cache[segmentNth] = { result, segment, isSegmentDirectory };
        }
      }

      if ( result.strength >= 0 && !result.negative ) return true;

      nodes = result.nodes;

      if ( !nodes.length ) return false;

    }

    return false;

  };

};

/* EXPORT */

export default matcher;
