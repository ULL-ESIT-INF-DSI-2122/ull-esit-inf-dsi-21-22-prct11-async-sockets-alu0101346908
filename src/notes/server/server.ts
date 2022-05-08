import * as net from 'net';
import {spawn} from 'child_process';
import {EventEmitter} from 'events';
import {NoteClass, notesColors} from './notesApp/classes/noteClass';

/**
 * Type that models a response generated on the server to be sent to the client
 */
export type ResponseType = {
  type: 'add' | 'modify' | 'delete' | 'read' | 'list';
  success: boolean;
  message: string;
  err?: string;
  notes?: NoteClass[];
}
/**
 * Type that models a request generated on the client to be received on the server
 */
export type RequestType = {
  type: 'add' | 'modify' | 'delete' | 'read' | 'list' | 'end';
  user?: string;
  title?: string;
  body?: string;
  color?: notesColors;
}

/**
 * Class that models a server that process notesApp commands, its port is the 60300 and recieves and sends messages through sockets
 */
export class NotesServer extends EventEmitter {
  private serverSocket:net.Server = new net.Server();
  constructor(port:number) {
    super();
    this.serverSocket = net.createServer((connection) => {
      const socket = new CommandEventEmitterServer(connection);
      console.log('A client has connected.');
      connection.write(JSON.stringify({'type': 'status', 'data': 'Waiting for requests'}) +'\n');
      socket.on('request', (request:RequestType) => {
        let commandOutput: string = '';
        let errOutput: string = '';
        let terminatedProperly: boolean = false;
        let notesAppProcess;
        switch (request.type) {
          case 'add':
            console.log('Add request came in...\n');
            this.emit('add', JSON.stringify(request));
            // eslint-disable-next-line max-len
            notesAppProcess = spawn(`node`, [`dist/notes/server/notesApp/yargsCommands.js`, `add`, `--user="${request.user}"`, `--title="${request.title}"`, `--body="${request.body}"`, `--color="${request.color}"`]);
            commandOutput = '';
            errOutput = '';
            terminatedProperly = false;
            notesAppProcess.stderr.on('data', (piece) => {
              errOutput += piece;
              terminatedProperly = false;
            });
            notesAppProcess.stdout.on('data', (piece) => {
              commandOutput += piece;
              terminatedProperly = true;
            });
            notesAppProcess.on('close', () =>{
              console.log('Sending response....\n');
              if (errOutput == '') {
                const response:ResponseType = {'type': 'add', 'success': terminatedProperly, 'message': commandOutput};
                console.log(`Response: \n`+ JSON.stringify(response, null, 4));
                connection.write(JSON.stringify(response) + '\n');
              } else {
                const response:ResponseType = {'type': 'add', 'success': terminatedProperly, 'message': commandOutput, 'err': errOutput};
                console.log(`Response: \n` + JSON.stringify(response, null, 4));
                connection.write(JSON.stringify(response) + '\n');
              }
            });
            break;
          case 'modify':
            console.log('Modify request came in...\n');
            this.emit('modify', JSON.stringify(request));
            // eslint-disable-next-line max-len
            commandOutput = '';
            errOutput = '';
            terminatedProperly = false;
            notesAppProcess = spawn(`node`, [`dist/notes/server/notesApp/yargsCommands.js`, `modify`, `--user="${request.user}"`, `--title="${request.title}"`, `--body="${request.body}"`, `--color="${request.color}"`]);
            notesAppProcess.stderr.on('data', (piece) => {
              errOutput += piece;
              terminatedProperly = false;
            });
            notesAppProcess.stdout.on('data', (piece) => {
              commandOutput += piece;
              terminatedProperly = true;
            });
            notesAppProcess.on('close', () =>{
              console.log('Sending response....\n');
              if (errOutput == '') {
                const response:ResponseType = {'type': 'modify', 'success': terminatedProperly, 'message': commandOutput};
                console.log(`Response: \n`+ JSON.stringify(response, null, 4));
                connection.write(JSON.stringify(response) + '\n');
              } else {
                const response:ResponseType = {'type': 'modify', 'success': terminatedProperly, 'message': commandOutput, 'err': errOutput};
                console.log(`Response: \n` + JSON.stringify(response, null, 4));
                connection.write(JSON.stringify(response) + '\n');
              }
            });
            break;
          case 'delete':
            console.log('Delete request came in...\n');
            this.emit('delete', JSON.stringify(request));
            // eslint-disable-next-line max-len
            commandOutput = '';
            errOutput = '';
            terminatedProperly = false;
            notesAppProcess = spawn(`node`, [`dist/notes/server/notesApp/yargsCommands.js`, `delete`, `--user="${request.user}"`, `--title="${request.title}"`]);
            notesAppProcess.stderr.on('data', (piece) => {
              errOutput += piece;
              terminatedProperly = false;
            });
            notesAppProcess.stdout.on('data', (piece) => {
              commandOutput += piece;
              terminatedProperly = true;
            });
            notesAppProcess.on('close', () =>{
              console.log('Sending response....\n');
              if (errOutput == '') {
                const response:ResponseType = {'type': 'delete', 'success': terminatedProperly, 'message': commandOutput};
                console.log(`Response: \n`+ JSON.stringify(response, null, 4));
                connection.write(JSON.stringify(response) + '\n');
              } else {
                const response:ResponseType = {'type': 'delete', 'success': terminatedProperly, 'message': commandOutput, 'err': errOutput};
                console.log(`Response: \n` + JSON.stringify(response, null, 4));
                connection.write(JSON.stringify(response) + '\n');
              }
            });
            break;
          case 'read':
            console.log('Read request came in...\n');
            this.emit('read', JSON.stringify(request));
            // eslint-disable-next-line max-len
            commandOutput = '';
            errOutput = '';
            terminatedProperly = false;
            notesAppProcess = spawn(`node`, [`dist/notes/server/notesApp/yargsCommands.js`, `read`, `--user="${request.user}"`, `--title="${request.title}"`]);
            notesAppProcess.stderr.on('data', (piece) => {
              errOutput += piece;
              terminatedProperly = false;
            });
            notesAppProcess.stdout.on('data', (piece) => {
              commandOutput += piece;
              terminatedProperly = true;
            });
            notesAppProcess.on('close', () =>{
              console.log('Sending response....\n');
              if (errOutput == '') {
                let noNoteOutput:string = commandOutput.replace(commandOutput.substring(commandOutput.search('{'), commandOutput.search('}')+1),'');
                const response:ResponseType = {'type': 'read', 'success': terminatedProperly, 'message': noNoteOutput, 'notes': [JSON.parse(commandOutput.substring(commandOutput.search('{'), commandOutput.search('}')+1))]};
                console.log(`Response: \n`+ JSON.stringify(response, null, 4));
                connection.write(JSON.stringify(response) + '\n');
              } else {
                const response:ResponseType = {'type': 'read', 'success': terminatedProperly, 'message': commandOutput, 'err': errOutput};
                console.log(`Response: \n` + JSON.stringify(response, null, 4));
                connection.write(JSON.stringify(response) + '\n');
              }
            });
            break;
          case 'list':
            console.log('List request came in...\n');
            this.emit('list', JSON.stringify(request));
            // eslint-disable-next-line max-len
            commandOutput = '';
            errOutput = '';
            terminatedProperly = false;
            notesAppProcess = spawn(`node`, [`dist/notes/server/notesApp/yargsCommands.js`, `list`, `--user="${request.user}"`]);
            notesAppProcess.stderr.on('data', (piece) => {
              errOutput += piece;
              terminatedProperly = false;
            });
            notesAppProcess.stdout.on('data', (piece) => {
              commandOutput += piece;
              terminatedProperly = true;
            });
            notesAppProcess.on('close', () =>{
              console.log('Sending response....\n');
              if (errOutput == '') {
                const notes: any[] = [];
                while (commandOutput.search('{') !== -1) {
                  notes.push(JSON.parse(commandOutput.substring(commandOutput.search('{'), commandOutput.search('}')+1)));
                  commandOutput = commandOutput.replace(commandOutput.substring(commandOutput.search('{'), commandOutput.search('}')+1),'');
                }
                const response:ResponseType = {'type': 'list', 'success': terminatedProperly, 'message': commandOutput, 'notes': notes};
                console.log(`Response: \n`+ JSON.stringify(response, null, 4));
                connection.write(JSON.stringify(response) + '\n');
              } else {
                const response:ResponseType = {'type': 'list', 'success': terminatedProperly, 'message': commandOutput, 'err': errOutput};
                console.log(`Response: \n` + JSON.stringify(response, null, 4));
                connection.write(JSON.stringify(response) + '\n');
              }
            });
            break;
          case 'end':
            this.emit('end', JSON.stringify(request));
            console.log('Terminate connection request came in...\n');
            console.log('Client received response, ending connection...\n');
            connection.end();
            break;
        }
      });
      connection.on('close', () => {
        console.log('A client has disconnected.');
      });
    }).listen(port, () => {
      console.log('Waiting for clients to connect.');
    });
  }
  /**
   * Function to close the server on demmand
   */
  close() {
    this.serverSocket.close();
  }
}

/**
 * Class that models a protocol for the communication between CommandClient and CommandServers
 * using a delimiter \n to safely say that the message has concluded
 */
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
        this.emit('request', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}

