import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {CommandClient, MessageEventEmitterClient} from '../../src/mod/client';
import {CommandServer, CommandEventEmitterServer} from '../../src/mod/server';

describe('MessageEventEmitterClient', () => {
  it('Should emit a message event once it gets a complete message', (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);

    client.on('message', (message) => {
      expect(message).to.be.eql({'type': 'result', 'data': 13});
      done();
    });

    socket.emit('data', '{"type": "result", "data": 13}');
    socket.emit('data', '\n');
  });
});
