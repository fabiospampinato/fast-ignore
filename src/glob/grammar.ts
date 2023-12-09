
/* IMPORT */

import {match, and, or, optional, star} from 'grammex';

/* HELPERS */

const escape = ( char: string ) => `\\${char}`;
const passthrough = ( match: string ) => match;

/* MAIN */

//TODO: Maybe avoid using grammex for this, to shave ~3kb off

const Escaped = match ( /\\./, passthrough );
const Escape = match ( /[$.*+?^(){}[\]\|]/, escape );
const Passthrough = match ( /./, passthrough );

const Star = match ( /\*+/, '.*' );

const Question = match ( '?', '.?' );

const ClassOpen = match ( '[', passthrough );
const ClassClose = match ( ']', passthrough );
const ClassNegation = match ( /[!^]/, '^' );
const ClassRange = match ( /[0-9a-z]-[0-9a-z]/i, passthrough );
const ClassEscape = match ( /[$.*+?^(){}[\|]/, escape );
const ClassPassthrough = match ( /[^\]]/, passthrough );
const ClassValue = or ([ Escaped, ClassEscape, ClassRange, ClassPassthrough ]);
const Class = and ([ ClassOpen, optional ( ClassNegation ), star ( ClassValue ), ClassClose ]);

const Grammar = star ( or ([ Star, Question, Class, Escaped, Escape, Passthrough ]) );

/* EXPORT */

export default Grammar;
