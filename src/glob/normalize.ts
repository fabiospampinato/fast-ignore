
/* MAIN */

const normalize = ( glob: string ): string => {

  // Unescaping leading "!" or "#"
  glob = glob.replace ( /^\\(!|#)/, '$1' );
  // Trimming unescaped trailing whitespace
  glob = glob.replace ( /((?:\\\s)*)\s*$/, ( $0, $1 ) => $1.replaceAll ( '\\', '' ) );
  // Trimming trailing slash //TODO: Handle this instead
  glob = glob.replace ( /\/$/, '' );
  // Collapsing globstars
  glob = glob.replace ( /(^|\/)\*\*\/(?:\*\*(\/|$))+/g, '$1**$2' );
  // Normalizing glob start
  glob = glob.startsWith ( '/' ) ? glob.slice ( 1 ) : ( glob.startsWith ( '**/' ) || glob.slice ( 0, -1 ).includes ( '/' ) ? glob : `**/${glob}` );

  return glob;

};

/* EXPORT */

export default normalize;
