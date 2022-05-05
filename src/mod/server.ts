import * as net from 'net';
import {spawn} from 'child_process';
import {EventEmitter} from 'events';


export class CommandServer {
  constructor() {
    net.createServer((connection) => {
      const socket = new CommandEventEmitterServer(connection);
      console.log('A client has connected.');
      connection.write(JSON.stringify({'type': 'status', 'data': 'Waiting for commands'}) +'\n');
      socket.on('command', (message) => {
        if (message.type === 'requestCommand') {
          const requestedProcess = spawn(message.command, [message.arguments]);
          let commandOutput: string = '';
          requestedProcess.stderr.on('data', (piece) => commandOutput += piece);
          requestedProcess.stdout.on('data', (piece) => commandOutput += piece);
          requestedProcess.on('close', () =>{
            console.log('Sending result:\n' + commandOutput);
            connection.write(JSON.stringify({'type': 'result', 'data': commandOutput}) + '\n');
          });
        }
        if (message.type === 'exit') {
          connection.end();
        }
      });
      connection.on('close', () => {
        console.log('A client has disconnected.');
      });
    }).listen(60300, () => {
      console.log('Waiting for clients to connect.');
    });
  }
}

export class CommandEventEmitterServer extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('command', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}


const server: CommandServer = new CommandServer();