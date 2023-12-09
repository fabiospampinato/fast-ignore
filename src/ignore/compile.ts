
/* IMPORT */

import matcher from '../glob/matcher';
import type {Glob, Node, Options} from '../types';

/* MAIN */

const compile = ( tiers: Glob[][], options: Options ): Node => {

  const caseSensitive = options.caseSensitive ?? false;
  const root: Node = { id: '', globstar: false, negative: false, strength: -1, tier: -1, match: () => false, children: [] };

  let scounter = 0;

  for ( let ti = 0, tl = tiers.length; ti < tl; ti++ ) {

    const globs = tiers[ti];
    const tier = ti;

    for ( let gi = 0, gl = globs.length; gi < gl; gi++ ) {

      let content = globs[gi].content;
      let parent = root;

      content = content.replace ( /\/$/, '' ); //TODO: Handle this instead
      content = content.replace ( /(^|\/)\*\*\/(?:\*\*(\/|$))+/g, '$1**$2' );
      content = content.startsWith ( '/' ) ? content.slice ( 1 ) : ( content.startsWith ( '**/' ) || content.slice ( 0, -1 ).includes ( '/' ) ? content : `**/${content}` );

      const segments = content.split ( '/' );

      for ( let si = 0, sl = segments.length; si < sl; si++ ) {

        const id = segments[si];
        const globstar = ( id === '**' );
        const terminal = ( si === sl - 1 );
        const negative = globs[gi].negative;
        const strength = ( terminal ? scounter++ : -1 );
        const match = matcher ( id, caseSensitive );
        const children: Node[] = [];
        const node = { id, globstar, negative, strength, tier, match, children };
        const nodeExisting = parent.children.find ( node => node.id === id );

        if ( nodeExisting ) {

          if ( ( tier === nodeExisting.tier && strength >= nodeExisting.strength ) || ( tier > nodeExisting.tier && ( nodeExisting.strength < 0 || nodeExisting.negative ) ) ) { // Existing node, overridable by tier/strength/negativity // Basically we are making sure that files ignored in previous tiers can't be re-included back in later tiers

            nodeExisting.negative = negative;
            nodeExisting.strength = strength;
            nodeExisting.tier = tier;

          }

          parent = nodeExisting;

        } else {

          parent.children.push ( node );

          parent = node;

        }

      }

    }

  }

  return root;

};

/* EXPORT */

export default compile;
