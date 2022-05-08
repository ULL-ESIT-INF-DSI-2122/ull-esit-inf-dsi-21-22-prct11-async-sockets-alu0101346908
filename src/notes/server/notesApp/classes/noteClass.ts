import chalk = require('chalk');
// eslint-disable-next-line no-unused-vars
export enum notesColors {red = 'red', green = 'green', blue = 'blue', yellow = 'yellow'};
/**
 * NoteClass that models a Note with attributes like title, body and color.
 */
export class NoteClass {
  private color: notesColors;
  /**
   * Contructor that receives the title, body as string and a color supported.
   * To check that condition the received value is checked against the notesColors enum.
   * @param title String used to store the title of the note.
   * @param body String used to store the body of the note.
   * @param color notesColors value used to store the color of the note.
   */
  constructor(private title: string, private body: string, color: notesColors) {
    if (Object.values(notesColors).includes(color)) {
      this.color = color;
    } else {
      throw new Error(`Color ${color} not allowed in NoteClass (allowed ${JSON.stringify(notesColors)})`);
    }
  }
  /**
   * Getter for the title attribute.
   * @returns String containing the title.
   */
  getTitle():string {
    return this.title;
  }
  /**
 * Getter for the body attribute.
 * @returns String containing the body.
 */
  getBody():string {
    return this.body;
  }
  /**
 * Getter for the color attribute.
 * @returns notesColor value representing a supported color.
 */
  getColor():notesColors {
    return this.color;
  }
  /**
   * Setter of the title attribute
   * @param title String containing the new title
   */
  setTitle(title:string) {
    this.title = title;
  }
  /**
 * Setter of the body attribute
 * @param body String containing the new body
 */
  setBody(body:string) {
    this.body = body;
  }
  /**
   * Setter of the color attribute.
   * @param color notesColor value representing a supported color.
   */
  setColor(color: notesColors) {
    this.color = color;
  }
  print():string {
    let coloredTitle: string = '';
    let coloredBody: string = '';
    let coloredColor: string = '';
    switch (this.color) {
      case notesColors.red:
        coloredTitle = chalk.red(this.title);
        coloredBody = chalk.red(this.body);
        coloredColor = chalk.red('red');
        break;
      case notesColors.green:
        coloredTitle = chalk.green(this.title);
        coloredBody = chalk.green(this.body);
        coloredColor = chalk.green('green');
        break;
      case notesColors.yellow:
        coloredTitle = chalk.yellow(this.title);
        coloredBody = chalk.yellow(this.body);
        coloredColor = chalk.yellow('yellow');
        break;
      case notesColors.blue:
        coloredTitle = chalk.blue(this.title);
        coloredBody = chalk.blue(this.body);
        coloredColor = chalk.blue('blue');
        break;
    }
    return ` Title: ${coloredTitle} \n Body: ${coloredBody} \n Color: ${coloredColor} `;
  }
}
