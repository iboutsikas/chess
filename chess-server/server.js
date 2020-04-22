const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const logger = require('./logger');

let result = dotenv.config();

if (result.error) {
    logger.info('Could not load .env file. Using default values');
}


(async () => {
    console.log(process.argv);

    let port = process.env.PORT || 3000;

    if (process.argv[2]) {
        port = parseInt(process.argv[2]);
    }
 
    const server = http.createServer(app);

    server.listen(port, () => {
        logger.info(`Now listening on port ${port}...`);
    });
})();
