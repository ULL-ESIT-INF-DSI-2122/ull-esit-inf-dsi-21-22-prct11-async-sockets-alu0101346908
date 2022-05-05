import * as net from 'net';
import {EventEmitter} from 'events';


export class CommandClient {
  constructor(private command:string, private argumentList:string) {
    const socketCopy = net.connect({port: 60300});
    const client = new MessageEventEmitterClient(socketCopy);
    console.log(`Requesting execution of command ${command} with arguments ${argumentList}`);
    socketCopy.write(JSON.stringify({'type': 'requestCommand', 'command': command, 'arguments': argumentList}) +
    '\n');
    client.on('message', (response) => {
      if (response.type === 'status') {
        console.log('Server: '+response.data);
      }
      if (response.type === 'result') {
        console.log('Command execution result: \n' +response.data);
        socketCopy.write(JSON.stringify({'type': 'exit', 'data': 'Data received'}) +
        '\n');
      }
    });
  }
}

export class MessageEventEmitterClient extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;
      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('message', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}
let command: string = process.argv[2];
let argumentsList:string = process.argv[3];

console.log(process.argv);
console.log(command+ '  ' + argumentsList);
let client:CommandClient = new CommandClient(command, argumentsList);
