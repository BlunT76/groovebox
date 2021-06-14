
import { NOTES_FREQS } from '../constant/NOTES_FREQS';
import { T16range } from '../types/types';

export default class Note
{
    public octave: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 3;
    // public velocity: number = 0;
    public name: string;
    public beatId: T16range = 0;
    public bar: T16range = 0;
    public isFromMidi: boolean = false;

    constructor (name: string, octave: number, beatId: T16range, elm?: any)
    {
        this.octave = octave || elm?.note.octave || 3;
        this.beatId = beatId;
        this.name = name || 'C';
        // this.velocity = elm?.velocity || 1;
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
