
/* MAIN */

type Glob = {
  content: string,
  negative: boolean
};

type Node = {
  id: string,
  globstar: boolean,
  negative: boolean,
  strength: number,
  tier: number,
  match: ( segment: string ) => boolean,
  children: Node[]
};

type Options = {
  caseSensitive?: boolean
};

type Tick = {
  nodes: Node[],
  negative: boolean,
  strength: number
};

/* EXPORT */

export type {Glob, Node, Options, Tick};
