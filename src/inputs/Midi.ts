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
            console.log(this.midiInputs)

            for (let i = 0; i < 9; i++)
            {
                this.noteStack[i] = {};
            }

            callback();
        });
    }

    getMidiInputs (): any[]
    {
        return this.midiInputs;
    }

    setMidiInput (deviceName: string)
    {
        // @ts-ignore
        this.midiInput = WebMidi.getInputByName(deviceName);

        this.midiInput.addListener('noteon', 'all',
            (e: any) =>
            {
                const { currentTrackId, currentBarId, currentBeatId } = this.grooveBoxUi.state;
                const note = new Note(e.note.name, this.grooveBox.getOctave(), e);
                //note.startTime = this.grooveBox.audioCtx.currentTime;
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
                    this.noteStack[e.note.octave][e.note.name] = this.grooveBox.noteOn(note, note.beatId || currentBeatId);
                }
            }
        );

        this.midiInput.addListener('noteoff', 'all',
            (e: any) =>
            {
                const { currentTrackId } = this.grooveBoxUi.state;

                if (currentTrackId > 7)
                {
                    try
                    {
                        this.pressedKeys -= 1;
                        if (this.pressedKeys === 0)
                        {
                            this.noteStack[e.note.octave][e.note.name].stopMidiNote();
                            
                        }
                        delete this.noteStack[e.note.octave][e.note.name];
                        
                    } catch (error) {
                        console.log('Note not found', error)
                    }
                    
                }
            }
        );

        this.midiInput.addListener('controlchange', 'all',
            (e: any) =>
            {
                console.log(e.controller, e.value)
                // (e.value / 127 - 0.5) * 2); // -1 to 1
                // (e.value / 127); // 0 to 1
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