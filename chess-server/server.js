const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const logger = require('./logger');

let result = dotenv.config();

if (result.error) {
    logger.error('Failed loading env');
}


(async () => {
    const port = process.env.PORT || 3000;

    const server = http.createServer(app);

    server.listen(port, () => {
        logger.info(`Now listening on port ${port}...`);
    });
})();
