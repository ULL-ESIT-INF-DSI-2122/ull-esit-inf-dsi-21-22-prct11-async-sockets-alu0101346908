import * as yargs from 'yargs';
import {NotesClient, RequestType} from './client';
import {notesColors} from '../server/notesApp/classes/noteClass';
/**
 * Yarg command to add a note to a user even if the user doesnt exist, this petition is sent to a server listening on port 60300
 * Example: yargsCommands.js add --user="user" --title="Yellow note" --body="This is a yellow note" --color="yellow"
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // eslint-disable-next-line max-len
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      // eslint-disable-next-line max-len
      const command:RequestType = {'type': 'add', 'user': argv.user, 'title': argv.title, 'body': argv.body, 'color': argv.color as notesColors};
      const client:NotesClient = new NotesClient(command, 60300);
    }
  },
});
/**
 * Yarg command to modify an existing note of an existing given user, this petition is sent to a server listening on port 60300
 * Example: yargsCommands.js modify --user="user" --title="Yellow note" --body="This is a yellow note" --color="yellow"
 */
yargs.command({
  command: 'modify',
  describe: 'Modify an existing note from a user',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // eslint-disable-next-line max-len
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      const command:RequestType = {'type': 'modify', 'user': argv.user, 'title': argv.title, 'body': argv.body, 'color': argv.color as notesColors};
      const client:NotesClient = new NotesClient(command, 60300);
    }
  },
});
/**
 * Yarg command to delete an existing note from an existing given user, this petition is sent to a server listening on port 60300
 * Example: yargsCommands.js delete --user="user" --title="Yellow note"
 */
yargs.command({
  command: 'delete',
  describe: 'Remove an existing note from a user ',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const command:RequestType = {'type': 'delete', 'user': argv.user, 'title': argv.title};
      const client:NotesClient = new NotesClient(command, 60300);
    }
  },
});
/**
 * Yarg command to list all existing notes from an existing given user, this petition is sent to a server listening on port 60300
 * Example: yargsCommands.js list --user="user"
 */
yargs.command({
  command: 'list',
  describe: 'List the titles of the notes of a given user',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const command:RequestType = {'type': 'list', 'user': argv.user};
      const client:NotesClient = new NotesClient(command, 60300);
    }
  },
});
/**
 * Yarg command to print an existing notes given its title from an existing given user, this petition is sent to a server listening on port 60300
 * Example: yargsCommands.js read --user="user" --title="Yellow note"
 */
yargs.command({
  command: 'read',
  describe: 'Shows an existing note contents given a user and a title',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const command:RequestType = {'type': 'read', 'user': argv.user, 'title': argv.title};
      const client:NotesClient = new NotesClient(command, 60300);
    }
  },
});

/**
 * Its mandantory to include this line in the start point or main file to get yargs to process the arguments
 */
yargs.parse();
