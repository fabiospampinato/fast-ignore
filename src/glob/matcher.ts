
/* IMPORT */

import parse from './parse';

/* HELPERS */

const STAR_RE = /^\*+$/;
const STATIC_RE = /^[ a-zA-Z0-9/._-]*$/;

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

      const globLowerCase = glob.toLowerCase ();
      const globLength = globLowerCase.length;

      return ( segment: string ) => segment.length === globLength && segment.toLowerCase () === globLowerCase;

    }

  }

  /* GENERAL CASE */

  const re = parse ( glob, caseSensitive );

  return ( segment: string ) => re.test ( segment );

};

/* EXPORT */

export default matcher;
