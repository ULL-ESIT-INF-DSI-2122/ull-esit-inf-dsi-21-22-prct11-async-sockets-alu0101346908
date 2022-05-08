import * as yargs from 'yargs';
import {NoteClass, notesColors} from './classes/noteClass';
import {NoteManager} from './classes/noteManagementClass';

/**
 * Yarg command to add a note to a user even if the user doesnt exist
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
      const manager: NoteManager = new NoteManager();
      try {
        const newNote: NoteClass = new NoteClass(argv.title, argv.body, argv.color as notesColors);
        manager.addNote(argv.user, newNote);
      } catch (error) {
        console.log(error);
      }
    }
  },
});
/**
 * Yarg command to modify an existing note of an existing given user
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
      const manager: NoteManager = new NoteManager();
      try {
        const newNote: NoteClass = new NoteClass(argv.title, argv.body, argv.color as notesColors);
        manager.modifyNote(argv.user, newNote);
      } catch (error) {
        console.log(error);
      }
    }
  },
});
/**
 * Yarg command to delete an existing note from an existing given user
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
      const manager: NoteManager = new NoteManager();
      manager.deleteNote(argv.user, argv.title);
    }
  },
});
/**
 * Yarg command to list all existing notes from an existing given user
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
      const manager: NoteManager = new NoteManager();
      manager.listTitles(argv.user);
    }
  },
});
/**
 * Yarg command to print an existing notes given its title from an existing given user
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
      const manager: NoteManager = new NoteManager();
      manager.printColorizedNote(argv.user, argv.title);
    }
  },
});

/**
 * Its mandantory to include this line in the start point or main file to get yargs to process the arguments
 */
yargs.parse();
