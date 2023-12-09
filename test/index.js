
/* IMPORT */

import {describe} from 'fava';
import toGlobMatch from '../dist/glob/matcher.js';
import toIgnoreMatch from '../dist/ignore/matcher.js';

/* HELPERS */

const glob = ( glob, segment ) => toGlobMatch ( glob, true )( segment );
const ignore = ( ignore, fileRelativePath, caseSensitive ) => toIgnoreMatch ( ignore, { caseSensitive } )( fileRelativePath );

/* MAIN */

describe ( 'Fast Ignore', () => {

  describe ( 'glob', it => {

    it ( 'works', t => {

      t.is ( glob ( '', '' ), true );
      t.is ( glob ( '', 'a' ), false );

      t.is ( glob ( 'foo', 'foo' ), true );
      t.is ( glob ( 'foo', 'fo2' ), false );
      t.is ( glob ( 'foo', 'foo2' ), false );

      t.is ( glob ( '\\?', '' ), false );
      t.is ( glob ( '\\?', 'a' ), false );
      t.is ( glob ( '\\?', '?' ), true );

      t.is ( glob ( '?', '' ), true );
      t.is ( glob ( '?', 'a' ), true );
      t.is ( glob ( '?', 'aaa' ), false );

      t.is ( glob ( 'foo?bar', 'foobar' ), true );
      t.is ( glob ( 'foo?bar', 'fooabar' ), true );
      t.is ( glob ( 'foo?bar', 'fooaaabar' ), false );

      t.is ( glob ( '\\*', '' ), false );
      t.is ( glob ( '\\*', 'a' ), false );
      t.is ( glob ( '\\*', '*' ), true );

      t.is ( glob ( '*', '' ), true );
      t.is ( glob ( '*', 'a' ), true );
      t.is ( glob ( '*', 'aaa' ), true );

      t.is ( glob ( 'foo*bar', 'foobar' ), true );
      t.is ( glob ( 'foo*bar', 'fooabar' ), true );
      t.is ( glob ( 'foo*bar', 'fooaaabar' ), true );

      t.is ( glob ( 'foo**bar', 'foobar' ), true );
      t.is ( glob ( 'foo**bar', 'fooabar' ), true );
      t.is ( glob ( 'foo**bar', 'fooaaabar' ), true );

      t.is ( glob ( 'foo[a-z]bar', 'fooabar' ), true );
      t.is ( glob ( 'foo[a-z]bar', 'foozbar' ), true );
      t.is ( glob ( 'foo[a-z]bar', 'fooAbar' ), false );
      t.is ( glob ( 'foo[a-z]bar', 'fooZbar' ), false );
      t.is ( glob ( 'foo[a-z]bar', 'fooaabar' ), false );

      t.is ( glob ( 'foo[A-Z]bar', 'fooAbar' ), true );
      t.is ( glob ( 'foo[A-Z]bar', 'fooZbar' ), true );
      t.is ( glob ( 'foo[A-Z]bar', 'fooabar' ), false );
      t.is ( glob ( 'foo[A-Z]bar', 'foozbar' ), false );
      t.is ( glob ( 'foo[A-Z]bar', 'fooaabar' ), false );

      t.is ( glob ( 'foo[0-5]bar', 'foo0bar' ), true );
      t.is ( glob ( 'foo[0-5]bar', 'foo5bar' ), true );
      t.is ( glob ( 'foo[0-5]bar', 'foo6bar' ), false );
      t.is ( glob ( 'foo[0-5]bar', 'foo7bar' ), false );
      t.is ( glob ( 'foo[0-5]bar', 'foo00bar' ), false );

      t.is ( glob ( 'foo[0-z]bar', 'fooabar' ), true );
      t.is ( glob ( 'foo[0-z]bar', 'fooAbar' ), true );
      t.is ( glob ( 'foo[0-z]bar', 'foo9bar' ), true );
      t.is ( glob ( 'foo[0-z]bar', 'foo>bar' ), true );
      t.is ( glob ( 'foo[0-z]bar', 'fooaabar' ), false );

      t.is ( glob ( 'foo[a-zA-Z0-9]bar', 'fooabar' ), true );
      t.is ( glob ( 'foo[a-zA-Z0-9]bar', 'fooAbar' ), true );
      t.is ( glob ( 'foo[a-zA-Z0-9]bar', 'foo9bar' ), true );
      t.is ( glob ( 'foo[a-zA-Z0-9]bar', 'foo>bar' ), false );
      t.is ( glob ( 'foo[a-zA-Z0-9]bar', 'fooaabar' ), false );

      t.is ( glob ( 'foo[abc]bar', 'fooabar' ), true );
      t.is ( glob ( 'foo[abc]bar', 'foobbar' ), true );
      t.is ( glob ( 'foo[abc]bar', 'fooAbar' ), false );
      t.is ( glob ( 'foo[abc]bar', 'fooBbar' ), false );
      t.is ( glob ( 'foo[abc]bar', 'fooaabar' ), false );

      t.is ( glob ( 'foo[!abc]bar', 'fooabar' ), false );
      t.is ( glob ( 'foo[!abc]bar', 'foobbar' ), false );
      t.is ( glob ( 'foo[!abc]bar', 'fooAbar' ), true );
      t.is ( glob ( 'foo[!abc]bar', 'fooBbar' ), true );
      t.is ( glob ( 'foo[!abc]bar', 'fooaabar' ), false );

      t.is ( glob ( 'foo[^abc]bar', 'fooabar' ), false );
      t.is ( glob ( 'foo[^abc]bar', 'foobbar' ), false );
      t.is ( glob ( 'foo[^abc]bar', 'fooAbar' ), true );
      t.is ( glob ( 'foo[^abc]bar', 'fooBbar' ), true );
      t.is ( glob ( 'foo[^abc]bar', 'fooaabar' ), false );

      t.is ( glob ( '(foo|bar)', '(foo|bar)' ), true );
      t.is ( glob ( '(foo|bar)', 'foo' ), false );
      t.is ( glob ( '(foo|bar)', 'bar' ), false );

    });

  });

  describe ( 'ignore', it => {

    it ( 'works with a single tier', t => {

      t.is ( ignore ( 'foo.js', 'foo.js' ), true );
      t.is ( ignore ( 'foo.js', 'deep/foo.js' ), true );
      t.is ( ignore ( 'foo.js', 'deep/deeper/foo.js' ), true );
      t.is ( ignore ( 'foo.js', 'bar.js' ), false );

      t.is ( ignore ( '/foo.js', 'foo.js' ), true );
      t.is ( ignore ( '/foo.js', 'deep/foo.js' ), false );
      t.is ( ignore ( '/foo.js', 'deep/deeper/foo.js' ), false );
      t.is ( ignore ( '/foo.js', 'bar.js' ), false );

      t.is ( ignore ( 'foo.js\n!foo.js', 'foo.js' ), false );
      t.is ( ignore ( 'foo.js\n!foo.js', 'deep/foo.js' ), false );
      t.is ( ignore ( 'foo.js\n!foo.js', 'deep/deeper/foo.js' ), false );
      t.is ( ignore ( 'foo.js\n!foo.js', 'bar.js' ), false );

      t.is ( ignore ( 'foo.js\n!/foo.js', 'foo.js' ), false );
      t.is ( ignore ( 'foo.js\n!/foo.js', 'deep/foo.js' ), true );
      t.is ( ignore ( 'foo.js\n!/foo.js', 'deep/deeper/foo.js' ), true );
      t.is ( ignore ( 'foo.js\n!/foo.js', 'bar.js' ), false );

      t.is ( ignore ( '#foo.js', 'foo.js' ), false );
      t.is ( ignore ( '#foo.js', 'deep/foo.js' ), false );
      t.is ( ignore ( '#foo.js', 'deep/deeper/foo.js' ), false );
      t.is ( ignore ( '#foo.js', 'bar.js' ), false );
      t.is ( ignore ( '#foo.js', '#foo.js' ), false );

      t.is ( ignore ( '\\#foo.js', 'foo.js' ), false );
      t.is ( ignore ( '\\#foo.js', 'deep/foo.js' ), false );
      t.is ( ignore ( '\\#foo.js', 'deep/deeper/foo.js' ), false );
      t.is ( ignore ( '\\#foo.js', 'bar.js' ), false );
      t.is ( ignore ( '\\#foo.js', '#foo.js' ), true );

      t.is ( ignore ( '\\!foo.js', 'foo.js' ), false );
      t.is ( ignore ( '\\!foo.js', 'deep/foo.js' ), false );
      t.is ( ignore ( '\\!foo.js', 'deep/deeper/foo.js' ), false );
      t.is ( ignore ( '\\!foo.js', 'bar.js' ), false );
      t.is ( ignore ( '\\!foo.js', '!foo.js' ), true );

      t.is ( ignore ( 'foo.js  ', 'foo.js' ), true );
      t.is ( ignore ( 'foo.js  ', 'foo.js ' ), false );
      t.is ( ignore ( 'foo.js\\  ', 'foo.js' ), false );
      t.is ( ignore ( 'foo.js\\  ', 'foo.js ' ), true );

      t.is ( ignore ( 'deep', 'foo.js' ), false );
      t.is ( ignore ( 'deep', 'deep/foo.js' ), true );
      t.is ( ignore ( 'deep', 'deep/deeper/foo.js' ), true );
      t.is ( ignore ( 'deep', 'bar.js' ), false );
      t.is ( ignore ( 'deep\n!deep/foo.js', 'deep/foo.js' ), true );

      t.is ( ignore ( 'deep/deeper', 'deep/deeper/foo.js' ), true );
      t.is ( ignore ( 'deep/deeper', 'other/deep/deeper/foo.js' ), false );
      t.is ( ignore ( '/deep/deeper', 'deep/deeper/foo.js' ), true );
      t.is ( ignore ( '/deep/deeper', 'other/deep/deeper/foo.js' ), false );
      t.is ( ignore ( '/deep/deeper/', 'deep/deeper/foo.js' ), true );
      t.is ( ignore ( '/deep/deeper/', 'other/deep/deeper/foo.js' ), false );

      t.is ( ignore ( 'deep/**', 'foo.js' ), false );
      t.is ( ignore ( 'deep/**', 'deep/foo.js' ), true );
      t.is ( ignore ( 'deep/**', 'deep/deeper/foo.js' ), true );
      t.is ( ignore ( 'deep/**', 'bar.js' ), false );

      t.is ( ignore ( '**/deep', 'foo.js' ), false );
      t.is ( ignore ( '**/deep', 'deep/foo.js' ), true );
      t.is ( ignore ( '**/deep', 'deep/deeper/foo.js' ), true );
      t.is ( ignore ( '**/deep', 'bar.js' ), false );

      t.is ( ignore ( '**/deep/**', 'foo.js' ), false );
      t.is ( ignore ( '**/deep/**', 'deep/foo.js' ), true );
      t.is ( ignore ( '**/deep/**', 'deep/deeper/foo.js' ), true );
      t.is ( ignore ( '**/deep/**', 'bar.js' ), false );

      t.is ( ignore ( '**/deep/**.js', 'foo.js' ), false );
      t.is ( ignore ( '**/deep/**.js', 'deep/foo.js' ), true );
      t.is ( ignore ( '**/deep/**.js', 'deep/deeper/foo.txt' ), false );
      t.is ( ignore ( '**/deep/**.js', 'bar.js' ), false );

      t.is ( ignore ( '**/**/**', 'foo.js' ), true );
      t.is ( ignore ( '**/**/**', 'deep/foo.js' ), true );
      t.is ( ignore ( '**/**/**', 'deep/deeper/foo.txt' ), true );
      t.is ( ignore ( '**/**/**', 'bar.js' ), true );

      t.is ( ignore ( 'd*p/foo.js', 'deep/foo.js', false ), true );
      t.is ( ignore ( 'd*p/foo.js', 'DeEp/FoO.jS', false ), true );

      t.is ( ignore ( 'd*p/foo.js', 'deep/foo.js', true ), true );
      t.is ( ignore ( 'd*p/foo.js', 'DeEp/FoO.jS', true ), false );

    });

    it ( 'works with multiple tiers', t => {

      t.is ( ignore ( ['foo.js', 'bar.js'], 'foo.js' ), true );
      t.is ( ignore ( ['foo.js', 'bar.js'], 'bar.js' ), true );
      t.is ( ignore ( ['foo.js', 'bar.js'], 'baz.js' ), false );

      t.is ( ignore ( ['foo.js', '!foo.js'], 'foo.js' ), true );
      t.is ( ignore ( ['foo.js', '!foo.js'], 'bar.js' ), false );
      t.is ( ignore ( ['foo.js', '!foo.js'], 'baz.js' ), false );

      t.is ( ignore ( ['foo.js\n!foo.js', 'foo.js'], 'foo.js' ), true );
      t.is ( ignore ( ['foo.js\n!foo.js', 'foo.js'], 'bar.js' ), false );
      t.is ( ignore ( ['foo.js\n!foo.js', 'foo.js'], 'baz.js' ), false );

      t.is ( ignore ( ['foo.js\n!foo.js', 'bar.js'], 'foo.js' ), false );
      t.is ( ignore ( ['foo.js\n!foo.js', 'bar.js'], 'bar.js' ), true );
      t.is ( ignore ( ['foo.js\n!foo.js', 'bar.js'], 'baz.js' ), false );

      t.is ( ignore ( ['deep\n!deep', 'deep/foo.js'], 'deep/foo.js' ), true );
      t.is ( ignore ( ['deep\n!deep', 'deep/foo.js'], 'deeper/deep/foo.js' ), false );
      t.is ( ignore ( ['deep\n!deep', 'deep/foo.js'], 'deeper/deep/bar.js' ), false );

      t.is ( ignore ( ['deep', 'deep/foo.js'], 'deep/foo.js' ), true );
      t.is ( ignore ( ['deep', 'deep/foo.js'], 'deeper/deep/foo.js' ), true );
      t.is ( ignore ( ['deep', 'deep/foo.js'], 'deeper/deep/bar.js' ), true );

      t.is ( ignore ( ['deep', '!deep/foo.js'], 'deep/foo.js' ), true );
      t.is ( ignore ( ['deep', '!deep/foo.js'], 'deeper/deep/foo.js' ), true );
      t.is ( ignore ( ['deep', '!deep/foo.js'], 'deeper/deep/bar.js' ), true );

    });

  });

});
