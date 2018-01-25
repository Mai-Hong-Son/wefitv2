/**
 * CodePush helpers
 */

/* eslint-disable no-console */

// Built-in modules
import fs from 'fs';

// Gulp modules
import gulp from 'gulp';
import shell from 'gulp-shell';

// Helper modules
import semver from 'semver';
import yargs from 'yargs';

// Output commands to be executed via "--dry" flag
const DRY_RUN = !!yargs.argv.dry;

const DEPLOYMENT_NAME_STAGING = 'Staging';
const DEPLOYMENT_NAME_RELEASE = 'Production';
const DEPLOYMENT_NAMES = [DEPLOYMENT_NAME_RELEASE, DEPLOYMENT_NAME_STAGING];

const CONFIGS_FILE = './gulp-helpers/codepush/configs.json';
const RELEASE_DIR = './CodePushRelease';
const BUNDLE_FILE = {
  android: 'index.android.bundle',
  ios: 'main.jsbundle',
};
const ENTRY_FILE = {
  ios: 'index.ios.js',
  android: 'index.android.js',
};

/**
 * Helpers
 */
function readConfigs() {
  const configs = fs.readFileSync(CONFIGS_FILE);
  const { appName, buildNumber, deploymentName, mandatory, versionName } = JSON.parse(configs);

  console.assert(
    parseInt(buildNumber) > 0,
    `buildNumber must be natural number (current: ${buildNumber})`
  );

  console.assert(
    DEPLOYMENT_NAMES.indexOf(deploymentName) !== -1,
    `deploymentName must be either "${DEPLOYMENT_NAME_RELEASE}" or "${DEPLOYMENT_NAME_STAGING}" (current: ${deploymentName})`
  );

  console.assert(
    semver.valid(versionName),
    `versionName must be a valid semver (current: ${versionName})`
  );
  
  return {
    appName,
    buildNumber: parseInt(buildNumber),
    deploymentName,
    mandatory,
    versionName,
  };
}

function prepareCommand({ platform }) {
  const options = [
    { flag: 'assets-dest', value: RELEASE_DIR },
    { flag: 'bundle-output', value: `${RELEASE_DIR}/${BUNDLE_FILE[platform]}` },
    { flag: 'dev', value: false },
    { flag: 'entry-file', value: ENTRY_FILE[platform] },
    { flag: 'platform', value: platform },
  ];

  const command = 'react-native bundle';
  const compiledOptions = options.map(({ flag, value }) => `--${flag} ${value}`).join(' ');

  return `${command} ${compiledOptions}`;
}

function uploadCommand(configs) {
  const command = 'code-push release';
  
  const { appName, buildNumber, deploymentName, mandatory, versionName } = configs;

  const readableVersion = `${deploymentName} ${versionName} build-${buildNumber}`;
  const description = `Universal iOS & Android update (${readableVersion})`;

  const params = [appName, RELEASE_DIR, versionName];
  const compiledParams = params.join(' ');

  const options = [
    { flag: 'deploymentName', value: deploymentName },
    { flag: 'description', value: `'${description}'` },
    { flag: 'disabled', value: deploymentName === DEPLOYMENT_NAME_RELEASE },
    { flag: 'mandatory', value: mandatory === true },
  ];
  const compiledOptions = options.map(({ flag, value }) => `--${flag} ${value}`).join(' ');

  return `${command} ${compiledParams} ${compiledOptions}`;
}

function execCommands(...commands) {
  if (DRY_RUN)
    console.log(['Commands to be executed:\n', ...commands, '\n'].join('\n'));
  else
    gulp.src('.').pipe(shell(commands));
}

/**
 * Gulp tasks
 */
// Clean CodePush release folder & rebuild typescript sources
gulp.task('codepush:clean', () => execCommands(
  `rm -rf ${RELEASE_DIR}`,
  `mkdir -p ${RELEASE_DIR}`
));

// Prepare bundle files for both Android & iOS
gulp.task('codepush:prepare', () => execCommands(
  prepareCommand({ platform: 'android' }),
  prepareCommand({ platform: 'ios' })
));

// Upload to CodePush server
gulp.task('codepush:upload', () => execCommands(
  uploadCommand(readConfigs())
));

/* eslint-enable no-console */
