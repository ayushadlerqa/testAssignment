import 'dotenv/config'; // loads username/password from .env locally (ignored in CI, where they come from the job env)
import mochawesomeMerge from 'mochawesome-merge';
import marge from 'mochawesome-report-generator';
const { merge } = mochawesomeMerge;

// Set SLOW_MO (in milliseconds) to pause after each browser action so you can
// watch every step. Defaults to 1000ms locally, 0 in CI. Override anytime:
//   SLOW_MO=1500 npm run wdio
const SLOW_MO = process.env.SLOW_MO !== undefined
    ? Number(process.env.SLOW_MO)
    : (process.env.CI ? 0 : 1000);

// Commands worth watching (interactions + navigation). Read-only lookups are
// skipped so the run doesn't crawl on every internal query.
const SLOW_COMMANDS = [
    'click', 'doubleClick', 'setValue', 'addValue', 'clearValue',
    'selectByAttribute', 'selectByVisibleText', 'selectByIndex',
    'moveTo', 'scrollIntoView', 'dragAndDrop',
    'url', 'navigateTo', 'switchWindow'
];

// Run Chrome headless on CI (no display available); keep it visible locally.
const chromeArgs = ['--window-size=1920,1080'];
if (process.env.CI) {
    chromeArgs.push('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu');
}

export const config = {
    runner: 'local',
    logLevel: 'silent',
    specs: [
        './test/specs/**/*.js'
    ],
    exclude: [],
    maxInstances: 10,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: chromeArgs
        }
    }],
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ['visual'],
    framework: 'jasmine',
    reporters: [
        'spec',
        ['mochawesome', {
            outputDir: './mochawesome-report/.json',
            outputFileFormat: (opts) => `results-${opts.cid}.json`
        }]
    ],

    jasmineOpts: {
        defaultTimeoutInterval: 60000,
        expectationResultHandler: function (passed, assertion) {}
    },

    onComplete: async function () {
        try {
            const jsonReport = await merge({ files: ['./mochawesome-report/.json/*.json'] });
            await marge.create(jsonReport, {
                reportDir: './mochawesome-report',
                reportFilename: 'test-report',
                reportTitle: 'WebdriverIO Test Report',
                charts: true,
                overwrite: true,
            });
            console.log('\n✔ HTML report: mochawesome-report/test-report.html\n');
        } catch (err) {
            console.error('Failed to generate mochawesome HTML report:', err);
        }
    },

    // Pause after each meaningful action so steps are visible to the eye.
    afterCommand: async function (commandName, args, result, error) {
        if (SLOW_MO > 0 && SLOW_COMMANDS.includes(commandName)) {
            await browser.pause(SLOW_MO);
        }
    },

}
