import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {NotesServer, RequestType, ResponseType, CommandEventEmitterServer} from '../../src/notes/server/server';
import {NotesClient, MessageEventEmitterClient} from '../../src/notes/client/client';
import {NoteClass, notesColors} from '../../src/notes/server/notesApp/classes/noteClass';
import {Server} from 'http';


// vv COMMENT THE LINE BELLOW TO ENABLE CONSOLE.LOGS FROM THE FUNCTIONS (DISABLED BECAUSE BLOATS THE TESTS REPORT ) vvvv
console.log = function() {};
// ^^ COMMENT THE LINE ABOVE TO ENABLE CONSOLE.LOGS FROM THE FUNCTIONS (DISABLED BECAUSE BLOATS THE TESTS REPORT ) ^^^^
describe('CommandEventEmitterServer', () => {
  it('Should emit a message event once it gets a complete message', (done) => {
    const socket = new EventEmitter();
    const client = new CommandEventEmitterServer(socket);

    client.on('request', (message) => {
      expect(message).to.be.eql({'type': 'result', 'data': 13});
      done();
    });

    socket.emit('data', '{"type": "result", "data": 13}');
    socket.emit('data', '\n');
  });
});


describe('NotesServer', () => {
  it('When receiving an add request it should emit the add response', (done) => {
    const server:NotesServer = new NotesServer(60300);
    const add:RequestType = {'type': 'add', 'user': 'edusegre', 'title': 'Red note', 'body': 'This is a red note', 'color': 'red' as notesColors};
    const client1:NotesClient = new NotesClient(add, 60300);
    server.on('add', (message) => {
      expect(message).to.be.eql(JSON.stringify(add));
      server.close();
      done();
    });
  });
  it('When receiving a modify request it should emit the modify response', (done) => {
    const server:NotesServer = new NotesServer(60300);
    const modify:RequestType = {'type': 'modify', 'user': 'edusegre', 'title': 'Red note', 'body': 'This is a red note', 'color': 'red' as notesColors};
    const client2:NotesClient = new NotesClient(modify, 60300);
    server.on('modify', (message) => {
      expect(message).to.be.eql(JSON.stringify(modify));
      server.close();
      done();
    });
  });
  it('When receiving a delete request it should emit the delete response', (done) => {
    const server:NotesServer = new NotesServer(60300);
    const deleteCommand:RequestType = {'type': 'delete', 'user': 'edusegre', 'title': 'Red note'};
    const client3:NotesClient = new NotesClient(deleteCommand, 60300);
    server.on('delete', (message) => {
      expect(message).to.be.eql(JSON.stringify(deleteCommand));
      server.close();
      done();
    });
  });
  it('When receiving a read request it should emit the read response', (done) => {
    const server:NotesServer = new NotesServer(60300);
    const read:RequestType = {'type': 'read', 'user': 'edusegre', 'title': 'Red note'};
    const client4:NotesClient = new NotesClient(read, 60300);
    server.on('read', (message) => {
      expect(message).to.be.eql(JSON.stringify(read));
      server.close();
      done();
    });
  });
  it('When receiving a list request it should emit the list response', (done) => {
    const server:NotesServer = new NotesServer(60300);
    const list:RequestType = {'type': 'list', 'user': 'edusegre'};
    const client5:NotesClient = new NotesClient(list, 60300);
    server.on('list', (message) => {
      expect(message).to.be.eql(JSON.stringify(list));
      server.close();
      done();
    });
  });
  it('When receiving an end request it should emit the end response', (done) => {
    const server:NotesServer = new NotesServer(60300);
    const end:RequestType = {'type': 'end'};
    const client6:NotesClient = new NotesClient(end, 60300);
    server.on('end', (message) => {
      expect(message).to.be.eql(JSON.stringify(end));
      server.close();
      done();
    });
  });
});
