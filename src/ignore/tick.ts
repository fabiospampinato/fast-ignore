
/* IMPORT */

import type {Node, Tick} from '../types';

/* MAIN */

// This function basically moves a pointer forward on the trie by just 1 non-globstar step, if possible

const tickNode = ( result: Tick, node: Node, segment: string, isSegmentDirectory: boolean ): void => {

  const {children} = node;

  for ( let i = 0, l = children.length; i < l; i++ ) { // Matching children

    const child = children[i];

    if ( !child.match ( segment ) ) continue;

    if ( child.strength >= result.strength && ( !child.directory || isSegmentDirectory ) ) { // Stronger result found

      result.negative = child.negative;
      result.strength = child.strength;

    }

    if ( child.children.length ) { // Generating next and forked pointers, if we have somewhere to go

      if ( child.globstar ) { // Keep going for this pointer within this tick

        tickNode ( result, child, segment, isSegmentDirectory );

      } else { // Stopping for this pointer within this tick

        result.nodes.push ( child );

      }

    }

  }

  if ( node.globstar ) { // Keep matching self

    if ( node.strength >= result.strength && ( !node.directory || isSegmentDirectory ) ) { // Stronger result found

      result.negative = node.negative;
      result.strength = node.strength;

    }

    result.nodes.push ( node );

  }

};

// This function basically moves each pointer forward on the trie by just 1 non-globstar step, if possible

const tick = ( nodes: Node[], segment: string, isSegmentDirectory: boolean ): Tick => {

  const result: Tick = { nodes: [], negative: false, strength: -1 };

  for ( let i = 0, l = nodes.length; i < l; i++ ) { // Ticking from each node

    tickNode ( result, nodes[i], segment, isSegmentDirectory );

  }

  return result;

};

/* EXPORT */

export default tick;
