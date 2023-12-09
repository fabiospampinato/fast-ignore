
/* MAIN */

type Glob = {
  content: string,
  negative: boolean,
  strength: number
};

type Node = {
  id: string,
  globstar: boolean,
  negative: boolean,
  strength: number,
  match: ( segment: string ) => boolean,
  children: Node[]
};

type Options = {
  caseSensitive?: boolean
};

/* EXPORT */

export type {Glob, Node, Options};
