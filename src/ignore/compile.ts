
/* IMPORT */

import matcher from '../glob/matcher';
import type {Glob, Node, Options} from '../types';

/* MAIN */

const compile = ( globs: Glob[], options: Options ): Node => {

  const caseSensitive = options.caseSensitive ?? false;
  const root: Node = { id: '', globstar: false, negative: false, strength: -1, match: () => false, children: [] };

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
      const strength = ( terminal ? globs[gi].strength : -1 );
      const match = matcher ( id, caseSensitive );
      const children: Node[] = [];
      const node = { id, globstar, negative, strength, match, children };
      const nodeExisting = parent.children.find ( node => node.id === id );

      if ( nodeExisting ) {

        if ( strength >= nodeExisting.strength ) { // Existing weaker node, overriding it

          nodeExisting.negative = negative;
          nodeExisting.strength = strength;

        }

        parent = nodeExisting;

      } else {

        parent.children.push ( node );

        parent = node;

      }

    }

  }

  return root;

};

/* EXPORT */

export default compile;
