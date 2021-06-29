
import { InputEventNoteon } from 'webmidi';
import { NOTES_FREQS } from '../constant/NOTES_FREQS';
import { T16range, TOctave } from '../types/types';

export default class Note
{
    public octave: TOctave = 3;
    public velocity: number = 0;
    public name: string;
    public beatId: T16range = 0;
    public bar: T16range = 0;
    public isFromMidi: boolean = false;

    constructor (name: string, octave: number, beatId: T16range, elm?: InputEventNoteon)
    {
        this.octave = (octave || elm?.note.octave || 3) as TOctave;
        this.beatId = beatId;
        this.name = name || 'C';
        this.velocity = elm?.velocity || 1;
    }

    setBeatId (id: T16range)
    {
        this.beatId = id;
    }

    get frequency (): number
    {
        return NOTES_FREQS[this.octave][this.name];
    }
}
