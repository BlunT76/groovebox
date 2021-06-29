import * as WebMidi from 'webmidi';
import { T16range } from '../types/types';
import GrooveBoxUI from '../ui/components/GrooveBoxUI';
import GrooveBox from '../audio/GrooveBox';
import Note from '../audio/Note';

export default class Midi
{
    midiInput: any;
    midiInputs: any;
    noteStack: any[] = [];
    grooveBox: GrooveBox;
    grooveBoxUi: GrooveBoxUI;
    pressedKeys: number = 0;

    constructor (grooveBox: GrooveBox, grooveBoxUi: GrooveBoxUI)
    {
        this.grooveBox = grooveBox;
        this.grooveBoxUi = grooveBoxUi;
    }

    init (callback: () => void)
    {
        // Enable WebMidi.js
        // @ts-ignore
        WebMidi.enable((err: any) =>
        {

            if (err)
            {
                console.log("WebMidi could not be enabled.", err);
            }

            // @ts-ignore
            this.midiInputs = WebMidi.inputs;

            for (let i = 0; i < 9; i++)
            {
                this.noteStack[i] = {};
            }

            callback();
        }, false);
    }

    getMidiInputs (): WebMidi.Input[]
    {
        return this.midiInputs;
    }

    setMidiInput (deviceName: string)
    {
        // @ts-ignore
        this.midiInput = WebMidi.getInputByName(deviceName);

        // Note on listener
        this.midiInput.addListener('noteon', 'all', (midiNote: WebMidi.InputEventNoteon) =>
        {
            const { currentTrackId, currentBarId, currentBeatId } = this.grooveBoxUi.state;

            const note = new Note(midiNote.note.name, midiNote.note.octave, currentBeatId, midiNote);

            note.beatId = currentBeatId;

            if (currentTrackId < 8)
            {
                note.isFromMidi = true;

                this.grooveBox.noteOn(note, currentBeatId);
            }
            else
            {
                const { currentBeatId, currentBarId } = this.grooveBoxUi.state;

                note.isFromMidi = true;

                this.pressedKeys += 1;

                try {
                    this.noteStack[midiNote.note.octave][midiNote.note.name] = this.grooveBox.noteOn(note, note.beatId || currentBeatId);
                }
                catch (error)
                {
                    return;
                }
                
            }
        }
        );

        // Note off listener
        this.midiInput.addListener('noteoff', 'all', (midiNote: WebMidi.InputEventNoteoff) =>
            {
                const { currentTrackId } = this.grooveBoxUi.state;

                if (currentTrackId > 7)
                {
                    try
                    {
                        this.pressedKeys -= 1;

                        if (this.pressedKeys === 0)
                        {
                            this.noteStack[midiNote.note.octave][midiNote.note.name].stopMidiNote();
                        }

                        delete this.noteStack[midiNote.note.octave][midiNote.note.name];
                    }
                    catch (error)
                    {
                        return;
                    }
                }
            }
        );

        // Control Change listener
        this.midiInput.addListener('controlchange', 'all',
            (cc: WebMidi.InputEventControlchange) =>
            {
                this.grooveBox.getControlChangeEvent(cc);
            }
        );


        this.midiInput.addListener('channelaftertouch', 'all',
            (e: any) =>
            {
                console.log(e)
                // (e.value / 127 - 0.5) * 2); // -1 to 1
                // (e.value / 127); // 0 to 1
            }
        );
    }
}