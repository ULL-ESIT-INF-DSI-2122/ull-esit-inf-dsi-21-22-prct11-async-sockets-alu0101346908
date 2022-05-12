"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const events_1 = require("events");
const client_1 = require("../../src/mod/client");
describe('MessageEventEmitterClient', () => {
    it('Should emit a message event once it gets a complete message', (done) => {
        const socket = new events_1.EventEmitter();
        const client = new client_1.MessageEventEmitterClient(socket);
        client.on('message', (message) => {
            (0, chai_1.expect)(message).to.be.eql({ 'type': 'result', 'data': 13 });
            done();
        });
        socket.emit('data', '{"type": "result", "data": 13}');
        socket.emit('data', '\n');
    });
});
