import localforage = require("localforage");
import { InputEventControlchange } from "webmidi";
import GrooveBox from "../audio/GrooveBox";
import Track from "./Track";

export type TCc = {
    id: number,
    value: number,
    func: string
}


export default class ControlChange
{
    ccList: TCc[] = [];
    currentCc: TCc = undefined;
    isLearning: boolean = false;
    isWaitingCC: boolean = false;
    isWaitingFunction: boolean = false;
    grooveBox: GrooveBox;
    

    constructor (grooveBox: GrooveBox)
    {
        this.grooveBox = grooveBox;
        this.init();
    }

    private init (): void
    {
        for (let i = 0; i < 80; i += 1)
        {
            const cc = { id: 0, value: 0, func: '' };
            this.ccList.push(cc);
        }
    }

    public setMidiLearn (value: boolean)
    {
        this.isLearning = value;

        this.isWaitingCC = value;

        if (value === true)
        {
            this.grooveBox.sendEvent({ 'lcdLine4': { key: 'Midi Learn:', value: 'move a controller knob' } });
        }

        if (this.isWaitingFunction && value === false)
        {
            this.isWaitingFunction = false;
        }
    }

    public midiLearn (ccId?: number, func?: string)
    {
        if (this.isLearning && this.isWaitingCC && ccId !== undefined)
        {
            this.currentCc = this.ccList[ccId];
            this.currentCc.id = ccId;
            this.isWaitingCC = false;
            this.isWaitingFunction = true;
            this.grooveBox.sendEvent({ 'lcdLine4': { key: 'Midi Learn:', value: 'move a software knob' } });
        }

        if (this.isLearning && this.isWaitingFunction && func !== undefined)
        {
            this.currentCc.func = func;
            localforage.setItem('ccList', this.ccList).then(() =>
            {
                this.grooveBox.sendEvent({ 'lcdLine4': { key: 'Midi Learn:', value: `CC:${this.currentCc.id} ⇨ ${this.currentCc.func}` } });
            }).catch(() =>
            {
                this.grooveBox.sendEvent({ 'lcdLine4': { key: 'Midi Learn:', value: `Something bad happened ...` } });
            })
            this.isWaitingFunction = false;
            this.isLearning = false;
        }
    }
}