import { reverb } from "../../models/IFx";
import FX from "./FX";

var Freeverb = require('freeverb');

export default class ReverbFX extends FX
{
    reverb: typeof Freeverb;
    public on: boolean;

    constructor (audioCtx: AudioContext, params?: reverb)
    {
        super(audioCtx);

        this.reverb = Freeverb(audioCtx);
        this.reverb.roomSize = 0.4;
        this.reverb.dampening = 5000;
        this.reverb.wet.value = 0;
        this.reverb.dry.value = 1;
        this.reverb.gain.value = 0.5;

        this.fxGain.connect(this.reverb);
        this.reverb.connect(this.outputGain);

        this.on = params?.on || false;
        this.setOnOff(this.on);
    }

    setRoomSize (size: number): ReverbFX
    {
        this.reverb.roomSize = size;
        return this;
    }

    setDamping (damp: number): ReverbFX
    {
        this.reverb.dampening = damp;
        return this;
    }

    setDryWet (dry: number, wet: number): ReverbFX
    {
        this.reverb.dry.value = dry;
        this.reverb.wet.value = wet;
        return this;
    }

    getRoomSize (): number
    {
        return this.reverb.roomSize;
    }

    getDamping (): number
    {
        return this.reverb.dampening;
    }

    setWet (value: number): ReverbFX
    {
        this.reverb.wet.value = value;
        return this;
    }

    getWet (): number
    {
        return this.reverb.wet.value;
    }

    getDry (): number
    {
        return this.reverb.dry.value;
    }
}