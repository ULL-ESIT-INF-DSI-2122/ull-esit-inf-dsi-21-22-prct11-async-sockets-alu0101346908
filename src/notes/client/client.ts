import * as net from 'net';
import {EventEmitter} from 'events';
import chalk = require('chalk');
import {NoteClass, notesColors} from '../server/notesApp/classes/noteClass';

/**
 * Type that models a request generated on the client to be sent to the server
 */
export type RequestType = {
  type: 'add' | 'modify' | 'delete' | 'read' | 'list' | 'end';
  user?: string;
  title?: string;
  body?: string;
  color?: notesColors;
}
/**
 * Type that models a response generated on the server to be received on the client
 */
export type ResponseType = {
  type: 'add' | 'modify' | 'delete' | 'read' | 'list';
  success: boolean;
  message: string;
  err?: string;
  notes?: NoteClass[];
}
/**
 * Class that models a client that makes petitions to a notesApp server, its port is the 60300 and recieves and sends messages through sockets
 */
export class NotesClient {
  constructor(private request:RequestType, port:number) {
    const socketCopy = net.connect({port: port});
    const client = new MessageEventEmitterClient(socketCopy);
    console.log(`Sending request ${JSON.stringify(request, null, 4)}`);
    socketCopy.write(JSON.stringify(request) +
    '\n');
    client.on('message', (response) => {
      if (response.success === true) {
        console.log(chalk.green('Successful response'));
        switch (response.type) {
          case 'add':
            console.log('Add request response: \n' + chalk.green(response.message));
            socketCopy.write(JSON.stringify({'type': 'end'}) +
            '\n');
            break;
          case 'modify':
            console.log('Modify request response: \n' + chalk.green(response.message));
            socketCopy.write(JSON.stringify({'type': 'end'}) +
            '\n');
            break;
          case 'delete':
            console.log('Delete request response: \n' + chalk.green(response.message));
            socketCopy.write(JSON.stringify({'type': 'end'}) +
            '\n');
            break;
          case 'read':
            console.log('Read request response: \n' + chalk.green(response.message));
            console.log(`Printing note : \n`);
            let readNote:NoteClass = new NoteClass(response.notes[0].title, response.notes[0].body, response.notes[0].color);
            console.log(readNote.print());
            socketCopy.write(JSON.stringify({'type': 'end'}) +
            '\n');
            break;
          case 'list':
            console.log('List request response: \n' + chalk.green(response.message));
            console.log(`Printing notes : \n`);
            let notesString:string = '';
            response.notes.forEach((note:any, index:number) => {
              const readNote:NoteClass = new NoteClass(note.title, note.body, note.color);
              notesString += (`Note ${index}:\n` + readNote.print()+'\n');
            });
            console.log(notesString);
            socketCopy.write(JSON.stringify({'type': 'end'}) +
            '\n');
            break;
        }
        console.log('\nRequesting server to terminate connection...\n');
      }
      if (response.success === false) {
        console.log(chalk.red('\nBad request or issues with notesApp: \n'));
        console.log('What went ok: \n' + chalk.green(response.message));
        console.log('What went bad: \n' + chalk.red(response.err));
        socketCopy.write(JSON.stringify({'type': 'end', 'data': 'Data received'}) +
        '\n');
        console.log('\nRequesting server to terminate connection...\n');
      }
    });
    socketCopy.on('end', () => {
      console.log('Server terminated connection');
    });
  }
}

/**
 * Class that models a protocol for the communication between NotesClient and NotesServer
 * using a delimiter \n to safely say that the message has concluded
 */
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

