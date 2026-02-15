
/* MAIN */

const normalize = ( glob: string ): string => {

  // Trimming unescaped trailing whitespace
  glob = glob.replace ( /((?:\\\s)*)\s*$/, ( $0, $1 ) => $1.replaceAll ( '\\', '' ) );
  // Unescaping non-special characters
  glob = glob.replace ( /\\([^*?\[\]])/g, '$1' );
  // Collapsing globstars
  glob = glob.replace ( /(^|\/)\*\*\/(?:\*\*(\/|$))+/g, '$1**$2' );
  // Normalizing glob start
  glob = glob.startsWith ( '/' ) ? glob.slice ( 1 ) : ( glob.startsWith ( '**/' ) || glob.slice ( 0, -1 ).includes ( '/' ) ? glob : `**/${glob}` );

  return glob;

};

/* EXPORT */

export default normalize;
