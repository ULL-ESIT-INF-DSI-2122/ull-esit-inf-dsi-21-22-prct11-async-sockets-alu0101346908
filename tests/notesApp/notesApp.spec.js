"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const noteClass_1 = require("../../src/notes/server/notesApp/classes/noteClass");
const noteManagementClass_1 = require("../../src/notes/server/notesApp/classes/noteManagementClass");
// vv COMMENT THE LINE BELLOW TO ENABLE CONSOLE.LOGS FROM THE FUNCTIONS (DISABLED BECAUSE BLOATS THE TESTS REPORT ) vvvv
console.log = function () { };
// ^^ COMMENT THE LINE ABOVE TO ENABLE CONSOLE.LOGS FROM THE FUNCTIONS (DISABLED BECAUSE BLOATS THE TESTS REPORT ) ^^^^
describe('NoteClass tests', () => {
    const note = new noteClass_1.NoteClass('Title', 'Body', noteClass_1.notesColors.red);
    it('A note is an instance of NoteClass', () => {
        (0, chai_1.expect)(note instanceof noteClass_1.NoteClass).to.be.true;
    });
    it('Getters and Setters', () => {
        note.setTitle('NotATitle');
        (0, chai_1.expect)(note.getTitle()).to.be.eq('NotATitle');
        note.setBody('NotABody');
        (0, chai_1.expect)(note.getBody()).to.be.eq('NotABody');
        note.setColor(noteClass_1.notesColors.green);
        (0, chai_1.expect)(note.getColor()).to.be.eq(noteClass_1.notesColors.green);
    });
});
describe('NotesManager tests', () => {
    const manager = new noteManagementClass_1.NoteManager();
    const note = new noteClass_1.NoteClass('Title', 'Body', noteClass_1.notesColors.red);
    const note2 = new noteClass_1.NoteClass('Title2', 'Body2', noteClass_1.notesColors.yellow);
    const note3 = new noteClass_1.NoteClass('Title3', 'Body3', noteClass_1.notesColors.green);
    const note4 = new noteClass_1.NoteClass('Title4', 'Body4', noteClass_1.notesColors.red);
    const note5 = new noteClass_1.NoteClass('Title5', 'Body5', noteClass_1.notesColors.blue);
    const note6 = new noteClass_1.NoteClass('Title6', 'Body6', noteClass_1.notesColors.blue);
    try {
        // eslint-disable-next-line no-unused-vars
        const invalidNoteColor = new noteClass_1.NoteClass('Title5', 'Body5', 'adawda');
    }
    catch (e) {
    }
    it('A manager is an instance of NoteManager', () => {
        (0, chai_1.expect)(manager instanceof noteManagementClass_1.NoteManager).to.be.true;
    });
    it('addNote method must add a note if it doesnt exist', () => {
        (0, chai_1.expect)(manager.addNote('user1', note)).to.be.true;
        (0, chai_1.expect)(manager.addNote('user1', note)).to.be.false;
    });
    it('statusMessages method must provide status messages', () => {
        (0, chai_1.expect)(manager.getStatusMessage(0)).to.be.equal('Exiting');
        (0, chai_1.expect)(manager.getStatusMessage(1)).to.be.equal('NotesApp started');
        (0, chai_1.expect)(manager.getStatusMessage(2)).to.be.equal('Note created');
        (0, chai_1.expect)(manager.getStatusMessage(3)).to.be.equal('Note removed');
        (0, chai_1.expect)(manager.getStatusMessage(4)).to.be.equal('Note exists');
        (0, chai_1.expect)(manager.getStatusMessage(5)).to.be.equal('Note doesnt exist');
        (0, chai_1.expect)(manager.getStatusMessage(6)).to.be.equal('Note modified');
        (0, chai_1.expect)(manager.getStatusMessage(7)).to.be.equal('Note cant be modified');
        (0, chai_1.expect)(manager.getStatusMessage(8)).to.be.equal('User exist');
        (0, chai_1.expect)(manager.getStatusMessage(9)).to.be.equal('User doesnt exist');
    });
    it('modifyNote method must modify a note if it exist', () => {
        (0, chai_1.expect)(manager.modifyNote('user1', note)).to.be.true;
        (0, chai_1.expect)(manager.modifyNote('userMissing', note)).to.be.false;
        (0, chai_1.expect)(manager.modifyNote('user1', note6)).to.be.false;
    });
    it('deleteNote method must delete a note if it exist', () => {
        (0, chai_1.expect)(manager.deleteNote('user1', note.getTitle())).to.be.true;
        (0, chai_1.expect)(manager.deleteNote('userMissing', note.getTitle())).to.be.false;
        (0, chai_1.expect)(manager.deleteNote('user1', note6.getTitle())).to.be.false;
    });
    it('listTitles method must list the titles of the notes of a user using their color attribute', () => {
        manager.addNote('user1', note4);
        manager.addNote('user1', note2);
        manager.addNote('user1', note3);
        manager.addNote('user1', note5);
        (0, chai_1.expect)(manager.listTitles('user1')).to.be.true;
        (0, chai_1.expect)(manager.listTitles('userMissing')).to.be.false;
    });
    it('printColorizedNote method must print the contents of a note with its color if exists', () => {
        (0, chai_1.expect)(manager.printColorizedNote('user1', note2.getTitle())).to.be.true;
        (0, chai_1.expect)(manager.printColorizedNote('user1', note3.getTitle())).to.be.true;
        (0, chai_1.expect)(manager.printColorizedNote('user1', note5.getTitle())).to.be.true;
        (0, chai_1.expect)(manager.printColorizedNote('user1', note4.getTitle())).to.be.true;
        (0, chai_1.expect)(manager.printColorizedNote('userMissing', note2.getTitle())).to.be.false;
        (0, chai_1.expect)(manager.printColorizedNote('user1', note6.getTitle())).to.be.false;
    });
});
