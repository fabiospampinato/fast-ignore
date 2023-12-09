
/* IMPORT */

import type {Node} from '../types';

/* MAIN */

// This function basically moves each pointer forward on the trie by just 1 non-globstar step, if possible

const tick = ( nodes: Node[], segment: string ): [nodesNext: Node[], negative: boolean, strenght: number] => {

  const nodesCurr: Node[] = nodes.slice ();
  const nodesNext: Node[] = [];

  let negative = false;
  let strength = -1;

  for ( let ni = 0; ni < nodesCurr.length; ni++ ) {

    const node = nodesCurr[ni];
    const {children} = node;

    for ( let ci = 0, cl = children.length; ci < cl; ci++ ) { // Matching children

      const nodeNext = children[ci];

      if ( !nodeNext.match ( segment ) ) continue;

      if ( nodeNext.strength >= strength ) { // Stronger result found

        negative = nodeNext.negative;
        strength = nodeNext.strength;

      }

      if ( nodeNext.children.length ) { // Generating next and forked pointers, if we have somewhere to go

        if ( nodeNext.globstar ) { // Keep going for this pointer within this tick

          nodesCurr.push ( nodeNext );

        } else { // Stopping for this pointer within this tick

          nodesNext.push ( nodeNext );

        }

      }

    }

    if ( node.globstar ) { // Keep matching self

      if ( node.strength >= strength ) { // Stronger result found

        negative = node.negative;
        strength = node.strength;

      }

      nodesNext.push ( node );

    }

  }

  return [nodesNext, negative, strength];

};

/* EXPORT */

export default tick;
