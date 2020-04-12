const express = require('express');
const app = express();
const fs = require('fs').promises;
const logger = require('./logger.js');

const STATE_UPDATE = '01\n';
const test_state = "BRBNBBBQBKBBBNBRBPBPBPBPBPBPBPBP****************************************************************WPWPWPWPWPWPWPWPWRWNWBWQWKWBWNWR";


function charToBlackPiece(c) {
    switch (c) {
        case 'R':
            return '&#9820;';
        case 'N':
            return '&#9822;';
        case 'B':
            return '&#9821;';
        case 'K':
            return '&#9819;';
        case 'Q':
            return '&#9818;';
        case 'P':
            return '&#9823;';
    }
}

function charToWhitePiece(c) {
    switch (c) {
        case 'R':
            return '&#9814;';
        case 'N':
            return '&#9816;';
        case 'B':
            return '&#9815;';
        case 'K':
            return '&#9813;';
        case 'Q':
            return '&#9812;';
        case 'P':
            return '&#9817;';
    }
}

function convertStateString(state) {
    let rv = [];

    for(let y = 0; y < 8; ++y) {
        for(let x = 0; x < 8; ++x) {
            let index = y * 16 + (x * 2);
            let block = { };

            block.letter = String.fromCharCode(0x41 + x);
            block.number = y + 1;
            
            if (state[index] == '*') {
                block.color = ''; 
                block.ascii = ' ';
                rv.push(block);
                continue;
            }

            if (state[index] == 'W') {
                block.color = 'white';
                block.ascii = charToWhitePiece(state[index + 1]);
            }
            else if (state[index] == 'B') {
                block.color = 'black';
                block.ascii = charToBlackPiece(state[index + 1]);
            }
            rv.push(block);
        }
    }

    return rv;
}


function catchAsyncErrors(fn) {
    return (req, res, next) => {
        const fnPromise = fn(req, res, next);
        if (fnPromise.catch) {
            fnPromise.catch(err => {
                console.error(err.stack);
                next(err);
            });
        }
    }
}

// app.use(cors());
// app.options('/', cors());

app.use(express.json());

app.get("/", catchAsyncErrors((req, res, any) => {
    res.status(200).json({ "message": "I am still alive!" });
}));

app.post("/", catchAsyncErrors(async (req, res, any) => {
    const file_path = process.env.DRIVER_FILE || '/dev/chess';

    const command = req.body.command;

    if (!command) {
        const error = new Error("No command given");
        error.status = 400;
        throw error;
    }
    try {
        let file = await fs.open(file_path, 'r+');

        logger.debug(`Got command: ${command}. Length: ${command.length}`)
        let {bytesWritten} = await file.write(command);
        logger.debug(`Wrote ${bytesWritten} bytes to file`);
        
        let commandReply = Buffer.alloc(256);
        let {bytesRead} = await file.read(commandReply, 0, 256, 0);
        logger.debug(`Driver replied with: ${commandReply.toString()}. Length: ${bytesRead}`);

        await file.write(STATE_UPDATE);

        let stateBuffer = Buffer.alloc(256);
        let thing = await file.read(stateBuffer, 0, 256, 0);
        let state = stateBuffer.toString().slice(0, thing.bytesRead - 1);
        logger.debug(`State is: ${state}. Length: ${thing.bytesRead}`);

        file.close();

        let reply = {
            command: command,
            reply: commandReply.toString().slice(0, bytesRead),
            state: convertStateString(state)
        }

        res.status(200).json(reply);
    }
    catch (err) {
        throw err;
    }

    return res.status(200).send();
}));

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    logger.error(`Unhandled error: ${error.message}`);

    res.status(error.status || 500);
    res.json({
        "error": { "message": error.message }
    });
});


module.exports = app;