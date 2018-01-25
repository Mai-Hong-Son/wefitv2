/**
 * I18n translations helpers
 */

// Built-in modules
import fs from 'fs';

// Gulp modules
import gulp from 'gulp';
import clean from 'gulp-clean';
import file from 'gulp-file';

// Helper modules
import csv from 'csv';
import _ from 'lodash';

const LOCALES_DIR = './app/i18n/locales';
const LANGUAGES = ['vi', 'en'];
const COLUMN_TITLES = ['Key path', ...LANGUAGES];
const NOT_AVAILABLE = '__n_a__';

/* eslint-disable no-console */

/**
 * 
 * Flatten paths of multiple-level nested object
 * used when extracting strings from I18n localization files
 * 
 * Input: nested object with structures like this
 * ```
 *   {
 *     a: {
 *       b: 'c',
 *       d: 'e',
 *     },
 *     f: {
 *       g: {
 *         h: 'i',
 *         j: 'k',
 *       },
 *     },
 *   }
 * ```
 * 
 * Output: array of flatten paths
 * ```
 *   [
 *     'a.b',
 *     'a.d',
 *     'f.g.h',
 *     'f.g.j',
 *   ]
 * ```
 * 
 * @export
 * @param {Object} obj 
 * @param {string} [parentKey=''] 
 * @returns {Array}
 * @memberof I18nUtils
 */
function flattenPaths(obj, parentKey = '') {
  return _.flatMap(obj, (value, key) => {
    if (_.isString(value))
      return `${parentKey}${key}`;
    return flattenPaths(value, `${parentKey}${key}.`);
  });
}

/**
 * 
 * Revert process of `flattenPaths`:
 * convert an array of flatten paths into an object
 * that can be used as template to set values with `_.set()`
 * 
 * Input: array of flatten paths
 * ```
 *   [
 *     'a.b',
 *     'a.d',
 *     'f.g.h',
 *     'f.g.j',
 *   ]
 * ```
 * 
 * Output: template with structures like this
 * ```
 *   {
 *     a: {
 *       b: '',
 *       d: '',
 *     },
 *     f: {
 *       g: {
 *         h: '',
 *         j: '',
 *       },
 *     },
 *   }
 * ```
 * 
 * @param {Object} obj 
 * @param {Array} [keys=[]] 
 * @returns 
 * @memberof I18nUtils
 */
function nestKeys(obj, keys = []) {
  if (_.isEmpty(keys)) return;

  const [firstKey, ...restKeys] = keys;
  const placeholder = _.isEmpty(restKeys) ? '' : {};
  
  if (obj[firstKey] == null) obj[firstKey] = placeholder;
  nestKeys(obj[firstKey], restKeys);
}

function buildCurrentLocales() {
  const localesData = _.map(LANGUAGES, lang => {
    const fileData = fs.readFileSync(`${LOCALES_DIR}/${lang}.json`);
    return JSON.parse(String(fileData));
  });
  
  return _.zipObject(LANGUAGES, localesData);
}

gulp.task('i18n:clean-up', () => {
  gulp.src(['./gulp-helpers/i18n/translations*.csv', './gulp-helpers/i18n/locales/*'])
    .pipe(clean());
});

gulp.task('i18n:from-csv', () => {
  const currentLocalesData = buildCurrentLocales();
  
  const input = String(fs.readFileSync('./gulp-helpers/i18n/translations_inp.csv'));
  csv.parse(input, (error, records) => {
    if (error != null) {
      console.log(error);
      return;
    }

    _.each(LANGUAGES, (lang, index) => {
      const { [lang]: locales } = currentLocalesData;

      _.each(records, ([path]) => nestKeys(locales, _.split(path, '.')));
      _.each(records, ([path, ...langsData]) => {
        const data = _.replace(_.trim(langsData[index]), /\s*\r\n/ig, '\n');
        _.set(locales, path, data);
      });
      
      const output = JSON.stringify(locales, null, 2);
      file(`${lang}.json`, output, { src: true })
        .pipe(gulp.dest('./gulp-helpers/i18n/locales'));
    });
  });
});

gulp.task('i18n:to-csv', () => {
  const locales = buildCurrentLocales();
 
  const paths = flattenPaths(locales.vi);

  const records = _.map(paths, path => {
    const row = _.map(LANGUAGES, lang => {
      const value = _.get(locales[lang], path);
      return _.startsWith(value, NOT_AVAILABLE) ? '' : value;
    });
    return [path, ...row];
  });
 
  csv.stringify(records, { columns: COLUMN_TITLES, header: true }, (err, result) => {
    file('translations_out.csv', result, { src: true })
      .pipe(gulp.dest('./gulp-helpers/i18n'));
  });
});

/* eslint-enable no-console */
