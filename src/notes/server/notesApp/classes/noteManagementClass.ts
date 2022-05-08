import * as fs from 'fs';
import chalk = require('chalk');
import {NoteClass, notesColors} from './noteClass';

/**
 * Class that models a Manager of Notes, offers functionality to manipulate notes, creating,
 * modifing and reading them from a common folder where notes are stored given an user
 */
export class NoteManager {
  /**
   * Function that servers the purpose of adding a new note to an existing user or, in the case the user is missing,
   * its created before creating the note. If the note exists, no new note is added.
   * @param user Username used to search the folder that stores the notes.
   * @param note Note object to be stored in the user folder.
   * @returns Boolean True in case there's havent been any issues.
   */
  addNote(user:string, note:NoteClass):boolean {
    process.stdout.write(chalk.green(this.getStatusMessage(1))+ '\n');
    if (this.userExists(user)) {
      process.stdout.write(chalk.green(this.getStatusMessage(8))+ '\n');
    } else {
      process.stderr.write(chalk.red(this.getStatusMessage(9))+ '\n');
      process.stdout.write(chalk.green(this.getStatusMessage(10) + ` ${user}`)+ '\n');
      fs.mkdirSync(`./notesFolder/${user}`, {recursive: true});
      fs.writeFileSync(`./notesFolder/${user}/${note.getTitle()}.json`, JSON.stringify(note));
      process.stdout.write(chalk.green(this.getStatusMessage(2))+ '\n');
      process.stdout.write(chalk.green(this.getStatusMessage(0))+ '\n');
      return true;
    }
    if (fs.existsSync(`./notesFolder/${user}/${note.getTitle()}.json`)) {
      process.stderr.write(chalk.red(this.getStatusMessage(4))+ '\n');
      process.stderr.write(chalk.red(this.getStatusMessage(0))+ '\n');
      return false;
    } else {
      fs.writeFileSync(`./notesFolder/${user}/${note.getTitle()}.json`, JSON.stringify(note));
      process.stdout.write(chalk.green(this.getStatusMessage(2))+ '\n');
      process.stdout.write(chalk.green(this.getStatusMessage(0)) + '\n');
      return true;
    }
  }
  /**
 * Function that servers the purpose of modifying an existing note of an existing user ,
 * If the note doesnt exists nor the user does, the note isnt modified.
 * @param user Username used to search the folder that stores the notes.
 * @param note Note object to be used to replace the existing note.
 * @returns Boolean True in case there's havent been any issues.
 */
  modifyNote(user:string, note:NoteClass):boolean {
    process.stdout.write(chalk.green(this.getStatusMessage(1))+ '\n');
    if (this.userExists(user)) {
      process.stdout.write(chalk.green(this.getStatusMessage(8))+ '\n');
    } else {
      process.stderr.write(chalk.red(this.getStatusMessage(9))+ '\n');
      process.stderr.write(chalk.red(this.getStatusMessage(0))+ '\n');
      return false;
    }
    if (fs.existsSync(`./notesFolder/${user}/${note.getTitle()}.json`)) {
      fs.writeFileSync(`./notesFolder/${user}/${note.getTitle()}.json`, JSON.stringify(note));
      process.stdout.write(chalk.green(this.getStatusMessage(6))+ '\n');
      process.stdout.write(chalk.green(this.getStatusMessage(0))+ '\n');
      return true;
    } else {
      process.stderr.write(chalk.red(this.getStatusMessage(5))+ '\n');
      process.stderr.write(chalk.red(this.getStatusMessage(0))+ '\n');
      return false;
    }
  }
  /**
 * Function that servers the purpose of deleting an existing note of an existing user ,
 * If the note doesnt exists nor the user does, the note cant be deleted.
 * @param user Username used to search the folder that stores the notes.
 * @param note Note name to be deleted.
 * @returns Boolean True in case there's havent been any issues.
 */
  deleteNote(user:string, note:string):boolean {
    process.stdout.write(chalk.green(this.getStatusMessage(1))+ '\n');
    if (this.userExists(user)) {
      process.stdout.write(chalk.green(this.getStatusMessage(8))+ '\n');
    } else {
      process.stderr.write(chalk.red(this.getStatusMessage(9))+ '\n');
      process.stderr.write(chalk.red(this.getStatusMessage(0))+ '\n');
      return false;
    }
    if (fs.existsSync(`./notesFolder/${user}/${note}.json`)) {
      fs.rmSync(`./notesFolder/${user}/${note}.json`);
      process.stdout.write(chalk.green(this.getStatusMessage(3))+ '\n');
      process.stdout.write(chalk.green(this.getStatusMessage(0))+ '\n');
      return true;
    } else {
      process.stderr.write(chalk.red(this.getStatusMessage(5))+ '\n');
      process.stderr.write(chalk.red(this.getStatusMessage(0))+ '\n');
      return false;
    }
  }
  /**
 * Function that servers the purpose of listing all existing notes titles of an existing user ,
 * If the user doesnt exists, no notes will be listed.
 * @param user Username used to search the folder that stores the notes.
 * @returns Boolean True in case there's havent been any issues.
 */
  listTitles(user:string):boolean {
    process.stdout.write(chalk.green(this.getStatusMessage(1))+ '\n');
    if (this.userExists(user)) {
      process.stdout.write(chalk.green(this.getStatusMessage(8))+ '\n');
      process.stdout.write(chalk.green(this.getStatusMessage(12)+` ${user}`)+ '\n');
      const fileNames = fs.readdirSync(`./notesFolder/${user}/`);
      fileNames.forEach((fileName, index) => {
        const note = JSON.parse(fs.readFileSync(`./notesFolder/${user}/` + fileName).toString());
        process.stdout.write(JSON.stringify(note));
      });
      process.stdout.write(chalk.green(this.getStatusMessage(0))+ '\n');
      return true;
    } else {
      process.stderr.write(chalk.red(this.getStatusMessage(9))+ '\n');
      process.stderr.write(chalk.red(this.getStatusMessage(0))+ '\n');
      return false;
    }
  }
  /**
 * Function that servers the purpose of printing an existing note of an existing user ,
 * If the note doesnt exists nor the user does, the note cant be listed.
 * @param user Username used to search the folder that stores the notes.
 * @param note Note name to be listed.
 * @returns Boolean True in case there's havent been any issues.
 */
  printColorizedNote(user:string, note:string):boolean {
    process.stdout.write(chalk.green(this.getStatusMessage(1))+ '\n');
    if (this.userExists(user)) {
      process.stdout.write(chalk.green(this.getStatusMessage(8))+ '\n');
    } else {
      process.stderr.write(chalk.red(this.getStatusMessage(9))+ '\n');
      process.stderr.write(chalk.red(this.getStatusMessage(0))+ '\n');
      return false;
    }
    if (fs.existsSync(`./notesFolder/${user}/${note}.json`)) {
      process.stdout.write(chalk.green(this.getStatusMessage(11)+ ` ${note}.json`)+ '\n');
      const readNote = JSON.parse(fs.readFileSync(`./notesFolder/${user}/${note}.json`).toString());
      process.stdout.write(JSON.stringify(readNote));
      process.stdout.write(chalk.green(this.getStatusMessage(0))+ '\n');
      return true;
    } else {
      process.stderr.write(chalk.red(this.getStatusMessage(5))+ '\n');
      process.stderr.write(chalk.red(this.getStatusMessage(0))+ '\n');
      return false;
    }
  }
  /**
 * Auxiliary function used to get a colorized note string used in printColorizedNote.
 * @param note Note read from a file as a generic object.
 * @returns string containing the colorized note's attributes.
 */
  getColorizedNote(note:any):string {
    let coloredTitle: string = '';
    let coloredBody: string = '';
    let coloredColor: string = '';
    switch (note.color) {
      case notesColors.red:
        coloredTitle = chalk.red(note.title);
        coloredBody = chalk.red(note.body);
        coloredColor = chalk.red('red');
        break;
      case notesColors.green:
        coloredTitle = chalk.green(note.title);
        coloredBody = chalk.green(note.body);
        coloredColor = chalk.green('green');
        break;
      case notesColors.yellow:
        coloredTitle = chalk.yellow(note.title);
        coloredBody = chalk.yellow(note.body);
        coloredColor = chalk.yellow('yellow');
        break;
      case notesColors.blue:
        coloredTitle = chalk.blue(note.title);
        coloredBody = chalk.blue(note.body);
        coloredColor = chalk.blue('blue');
        break;
    }
    return ` Title: ${coloredTitle} \n Body: ${coloredBody} \n Color: ${coloredColor} `;
  }
  /**
 * Auxiliary function used to get the colorized note's title string used in listTitles.
 * @param note Note read from a file as a generic object.
 * @returns string containing the colorized note's title.
 */
  getColorizedNoteTitle(note:any):string {
    let coloredTitle: string = '';
    switch (note.color) {
      case notesColors.red:
        coloredTitle = chalk.red(note.title);
        break;
      case notesColors.green:
        coloredTitle = chalk.green(note.title);
        break;
      case notesColors.yellow:
        coloredTitle = chalk.yellow(note.title);
        break;
      case notesColors.blue:
        coloredTitle = chalk.blue(note.title);
        break;
    }
    return coloredTitle;
  }
  /**
 * Boolean function used to check if the user exists.
 * @param user Username used to see if the user's folder exists.
 * @returns boolean True if user exists.
 */
  userExists(user:string):boolean {
    return fs.existsSync(`./notesFolder/${user}`);
  }
  /**
 * Dictionary function that returns a status message given a code.
 * @param code Code of the message to return.
 * @returns string Status message.
 */
  getStatusMessage(code: number):string {
    const statusCodes: string[] = ['Exiting', 'NotesApp started', 'Note created', 'Note removed', 'Note exists',
      'Note doesnt exist', 'Note modified', 'Note cant be modified', 'User exist', 'User doesnt exist',
      'Creating user', 'Reading note', 'Listing notes titles for'];
    return statusCodes[code];
  }
}
