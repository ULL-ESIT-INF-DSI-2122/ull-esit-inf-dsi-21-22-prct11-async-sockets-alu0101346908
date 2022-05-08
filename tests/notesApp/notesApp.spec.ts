import 'mocha';
import {expect} from 'chai';
import {NoteClass, notesColors} from '../../src/notes/server/notesApp/classes/noteClass';
import {NoteManager} from '../../src/notes/server/notesApp/classes/noteManagementClass';

// vv COMMENT THE LINE BELLOW TO ENABLE CONSOLE.LOGS FROM THE FUNCTIONS (DISABLED BECAUSE BLOATS THE TESTS REPORT ) vvvv
console.log = function() {};
// ^^ COMMENT THE LINE ABOVE TO ENABLE CONSOLE.LOGS FROM THE FUNCTIONS (DISABLED BECAUSE BLOATS THE TESTS REPORT ) ^^^^
describe('NoteClass tests', () => {
  const note: NoteClass = new NoteClass('Title', 'Body', notesColors.red);
  it('A note is an instance of NoteClass', () => {
    expect(note instanceof NoteClass).to.be.true;
  });
  it('Getters and Setters', () => {
    note.setTitle('NotATitle');
    expect(note.getTitle()).to.be.eq('NotATitle');
    note.setBody('NotABody');
    expect(note.getBody()).to.be.eq('NotABody');
    note.setColor(notesColors.green);
    expect(note.getColor()).to.be.eq(notesColors.green);
  });
});


describe('NotesManager tests', () => {
  const manager: NoteManager = new NoteManager();
  const note: NoteClass = new NoteClass('Title', 'Body', notesColors.red);
  const note2: NoteClass = new NoteClass('Title2', 'Body2', notesColors.yellow);
  const note3: NoteClass = new NoteClass('Title3', 'Body3', notesColors.green);
  const note4: NoteClass = new NoteClass('Title4', 'Body4', notesColors.red);
  const note5: NoteClass = new NoteClass('Title5', 'Body5', notesColors.blue);
  const note6: NoteClass = new NoteClass('Title6', 'Body6', notesColors.blue);
  try {
    // eslint-disable-next-line no-unused-vars
    const invalidNoteColor: NoteClass = new NoteClass('Title5', 'Body5', 'adawda' as notesColors);
  } catch (e) {

  }
  it('A manager is an instance of NoteManager', () => {
    expect(manager instanceof NoteManager).to.be.true;
  });
  it('addNote method must add a note if it doesnt exist', () => {
    expect(manager.addNote('user1', note)).to.be.true;
    expect(manager.addNote('user1', note)).to.be.false;
  });
  it('statusMessages method must provide status messages', () => {
    expect(manager.getStatusMessage(0)).to.be.equal('Exiting');
    expect(manager.getStatusMessage(1)).to.be.equal('NotesApp started');
    expect(manager.getStatusMessage(2)).to.be.equal('Note created');
    expect(manager.getStatusMessage(3)).to.be.equal('Note removed');
    expect(manager.getStatusMessage(4)).to.be.equal('Note exists');
    expect(manager.getStatusMessage(5)).to.be.equal('Note doesnt exist');
    expect(manager.getStatusMessage(6)).to.be.equal('Note modified');
    expect(manager.getStatusMessage(7)).to.be.equal('Note cant be modified');
    expect(manager.getStatusMessage(8)).to.be.equal('User exist');
    expect(manager.getStatusMessage(9)).to.be.equal('User doesnt exist');
  });
  it('modifyNote method must modify a note if it exist', () => {
    expect(manager.modifyNote('user1', note)).to.be.true;
    expect(manager.modifyNote('userMissing', note)).to.be.false;
    expect(manager.modifyNote('user1', note6)).to.be.false;
  });
  it('deleteNote method must delete a note if it exist', () => {
    expect(manager.deleteNote('user1', note.getTitle())).to.be.true;
    expect(manager.deleteNote('userMissing', note.getTitle())).to.be.false;
    expect(manager.deleteNote('user1', note6.getTitle())).to.be.false;
  });
  it('listTitles method must list the titles of the notes of a user using their color attribute', () => {
    manager.addNote('user1', note4);
    manager.addNote('user1', note2);
    manager.addNote('user1', note3);
    manager.addNote('user1', note5);
    expect(manager.listTitles('user1')).to.be.true;
    expect(manager.listTitles('userMissing')).to.be.false;
  });
  it('printColorizedNote method must print the contents of a note with its color if exists', () => {
    expect(manager.printColorizedNote('user1', note2.getTitle())).to.be.true;
    expect(manager.printColorizedNote('user1', note3.getTitle())).to.be.true;
    expect(manager.printColorizedNote('user1', note5.getTitle())).to.be.true;
    expect(manager.printColorizedNote('user1', note4.getTitle())).to.be.true;
    expect(manager.printColorizedNote('userMissing', note2.getTitle())).to.be.false;
    expect(manager.printColorizedNote('user1', note6.getTitle())).to.be.false;
  });
});

