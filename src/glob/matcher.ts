
/* IMPORT */

import escapeRegExp from 'string-escape-regex';
import parse from './parse';

/* HELPERS */

const STAR_RE = /^\*+$/;
const STATIC_RE = /^[ a-zA-Z0-9/._-]*$/;
const FLEXIBLE_START_RE = /^\*+([ a-zA-Z0-9/._-]*)$/;
const FLEXIBLE_END_RE = /^([ a-zA-Z0-9/._-]*)\*+$/;

/* MAIN */

const matcher = ( glob: string, caseSensitive: boolean ): (( segment: string ) => boolean) => {

  /* STAR SPECIAL-CASE */

  if ( STAR_RE.test ( glob ) ) {

    return () => true;

  }

  /* STATIC SPECIAL-CASE */

  if ( STATIC_RE.test ( glob ) ) {

    if ( caseSensitive ) {

      return ( segment: string ) => segment === glob;

    } else {

      const re = new RegExp ( `^${escapeRegExp ( glob )}$`, 'i' );
      const globLength = glob.length;

      return ( segment: string ) => segment.length === globLength && re.test ( segment );

    }

  }

  /* FLEXIBLE START SPECIAL-CASE */

  const end = FLEXIBLE_START_RE.exec ( glob )?.[1];

  if ( end ) {

    if ( caseSensitive ) {

      return ( segment: string ) => segment.endsWith ( end );

    } else {

      const re = new RegExp ( `${escapeRegExp ( end )}$`, 'i' );
      const endLength = end.length;

      return ( segment: string ) => segment.length >= endLength && re.test ( segment );

    }

  }

  /* FLEXIBLE END SPECIAL-CASE */

  const start = FLEXIBLE_END_RE.exec ( glob )?.[1];

  if ( start ) {

    if ( caseSensitive ) {

      return ( segment: string ) => segment.startsWith ( start );

    } else {

      const re = new RegExp ( `^${escapeRegExp ( start )}`, 'i' );
      const startLength = start.length;

      return ( segment: string ) => segment.length >= startLength && re.test ( segment );

    }

  }

  /* GENERAL CASE */

  const re = parse ( glob, caseSensitive );

  return ( segment: string ) => re.test ( segment );

};

/* EXPORT */

export default matcher;
