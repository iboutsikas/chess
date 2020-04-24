const http = require('http');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const app = require('./app');
const logger = require('./logger');
const compareVersions = require('compare-versions');

let result = dotenv.config();

if (result.error) {
    logger.info('Could not load .env file. Using default values');
}

const check_version = async (url) => {
    try {
        logger.info("Checking for newer versions...");
        const response = await fetch(url);
        const json = await response.json();
        const my_version = process.env.npm_package_version;
        const newest_version = json.server.version;

        if (compareVersions(newest_version, my_version) != 1) {
            logger.info("No newer versions found.");
        }
        else {
            logger.warn(`Current version is ${my_version}, but latest version is ${newest_version}. 
            Head to https://bluegrit.cs.umbc.edu/~iboutsi1 to download the newest version.`);
            
        }
    }
    catch(error) {
        logger.error("Unable to get version information.");
    }
};


(async () => {

    let url = process.env.UPDATE_URL || 'https://bluegrit.cs.umbc.edu/~iboutsi1/versioncheck.json'

    await check_version(url);

    let port = process.env.PORT || 3000;

    if (process.argv[2]) {
        port = parseInt(process.argv[2]);
    }
 
    const server = http.createServer(app);

    server.listen(port, () => {
        logger.info(`Now listening on port ${port}...`);
    });
})();
