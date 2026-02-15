
/* IMPORT */

import type {Node, Tick} from '../types';

/* MAIN */

// This function basically moves each pointer forward on the trie by just 1 non-globstar step, if possible

const tick = ( _nodes: Node[], segment: string ): Tick => {

  const result: Tick = { nodes: [], negative: false, strength: -1 };
  const nodes: Node[] = _nodes.slice ();

  for ( let ni = 0; ni < nodes.length; ni++ ) { // Ticking from each node

    const node = nodes[ni];
    const {children} = node;

    for ( let ci = 0, cl = children.length; ci < cl; ci++ ) { // Matching children

      const nodeNext = children[ci];

      if ( !nodeNext.match ( segment ) ) continue;

      if ( nodeNext.strength >= result.strength ) { // Stronger result found

        result.negative = nodeNext.negative;
        result.strength = nodeNext.strength;

      }

      if ( nodeNext.children.length ) { // Generating next and forked pointers, if we have somewhere to go

        if ( nodeNext.globstar ) { // Keep going for this pointer within this tick

          nodes.push ( nodeNext );

        } else { // Stopping for this pointer within this tick

          result.nodes.push ( nodeNext );

        }

      }

    }

    if ( node.globstar ) { // Keep matching self

      if ( node.strength >= result.strength ) { // Stronger result found

        result.negative = node.negative;
        result.strength = node.strength;

      }

      result.nodes.push ( node );

    }

  }

  return result;

};

/* EXPORT */

export default tick;
