"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const events_1 = require("events");
const server_1 = require("../../src/notes/server/server");
const client_1 = require("../../src/notes/client/client");
// vv COMMENT THE LINE BELLOW TO ENABLE CONSOLE.LOGS FROM THE FUNCTIONS (DISABLED BECAUSE BLOATS THE TESTS REPORT ) vvvv
console.log = function () { };
// ^^ COMMENT THE LINE ABOVE TO ENABLE CONSOLE.LOGS FROM THE FUNCTIONS (DISABLED BECAUSE BLOATS THE TESTS REPORT ) ^^^^
describe('CommandEventEmitterServer', () => {
    it('Should emit a message event once it gets a complete message', (done) => {
        const socket = new events_1.EventEmitter();
        const client = new server_1.CommandEventEmitterServer(socket);
        client.on('request', (message) => {
            (0, chai_1.expect)(message).to.be.eql({ 'type': 'result', 'data': 13 });
            done();
        });
        socket.emit('data', '{"type": "result", "data": 13}');
        socket.emit('data', '\n');
    });
});
describe('NotesServer', () => {
    it('When receiving an add request it should emit the add response', (done) => {
        const server = new server_1.NotesServer(60300);
        const add = { 'type': 'add', 'user': 'edusegre', 'title': 'Red note', 'body': 'This is a red note', 'color': 'red' };
        const client1 = new client_1.NotesClient(add, 60300);
        server.on('add', (message) => {
            (0, chai_1.expect)(message).to.be.eql(JSON.stringify(add));
            server.close();
            done();
        });
    });
    it('When receiving a modify request it should emit the modify response', (done) => {
        const server = new server_1.NotesServer(60300);
        const modify = { 'type': 'modify', 'user': 'edusegre', 'title': 'Red note', 'body': 'This is a red note', 'color': 'red' };
        const client2 = new client_1.NotesClient(modify, 60300);
        server.on('modify', (message) => {
            (0, chai_1.expect)(message).to.be.eql(JSON.stringify(modify));
            server.close();
            done();
        });
    });
    it('When receiving a delete request it should emit the delete response', (done) => {
        const server = new server_1.NotesServer(60300);
        const deleteCommand = { 'type': 'delete', 'user': 'edusegre', 'title': 'Red note' };
        const client3 = new client_1.NotesClient(deleteCommand, 60300);
        server.on('delete', (message) => {
            (0, chai_1.expect)(message).to.be.eql(JSON.stringify(deleteCommand));
            server.close();
            done();
        });
    });
    it('When receiving a read request it should emit the read response', (done) => {
        const server = new server_1.NotesServer(60300);
        const read = { 'type': 'read', 'user': 'edusegre', 'title': 'Red note' };
        const client4 = new client_1.NotesClient(read, 60300);
        server.on('read', (message) => {
            (0, chai_1.expect)(message).to.be.eql(JSON.stringify(read));
            server.close();
            done();
        });
    });
    it('When receiving a list request it should emit the list response', (done) => {
        const server = new server_1.NotesServer(60300);
        const list = { 'type': 'list', 'user': 'edusegre' };
        const client5 = new client_1.NotesClient(list, 60300);
        server.on('list', (message) => {
            (0, chai_1.expect)(message).to.be.eql(JSON.stringify(list));
            server.close();
            done();
        });
    });
    it('When receiving an end request it should emit the end response', (done) => {
        const server = new server_1.NotesServer(60300);
        const end = { 'type': 'end' };
        const client6 = new client_1.NotesClient(end, 60300);
        server.on('end', (message) => {
            (0, chai_1.expect)(message).to.be.eql(JSON.stringify(end));
            server.close();
            done();
        });
    });
});
