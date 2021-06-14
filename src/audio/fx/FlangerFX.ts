import { delay, flanger } from "../../models/IFx";
import FX from "./FX";

export default class FlangerFX extends FX
{
    public flanger: DelayNode;
    private feedback: GainNode;
    private lfo: OscillatorNode;
    private depth: GainNode;

    constructor (audioCtx: AudioContext, params?: flanger)
    {
        super(audioCtx);

        this.flanger = this.audioCtx.createDelay();
        this.flanger.delayTime.value = 0.005; params?.delayTime || 0.005;  // min="0.001" max="0.02"

        this.feedback = audioCtx.createGain();
        this.feedback.gain.value = params?.feedback || 0.5; // min="0" max="1"

        this.depth = audioCtx.createGain();
        this.depth.gain.value = 0.002;

        this.lfo = audioCtx.createOscillator();
        this.lfo.type = 'sine';
        this.lfo.frequency.value = params?.oscfreq || 0.0001;  // min: 0.05 max: 5

        this.flanger.connect(this.feedback);
        this.feedback.connect(this.flanger);
        this.lfo.connect(this.depth);
        this.depth.connect(this.flanger.delayTime);

        this.fxGain.connect(this.flanger);
        this.flanger.connect(this.outputGain);

        this.on = params?.on || false;
        this.setOnOff(this.on);

        this.lfo.start(0);
    }

    setDelayTime (time: number)
    {
        // const now = this.getCurrentTime();

        // this.flanger.delayTime.cancelScheduledValues(now)
        // this.flanger.delayTime.linearRampToValueAtTime(time, now);
        // console.log('time: ', this.flanger.delayTime.value);
    }

    setFeedback (vol: number)
    {
        const now = this.getCurrentTime();

        this.feedback.gain.cancelScheduledValues(now);
        this.feedback.gain.linearRampToValueAtTime(vol, now);
    }

    setOsc (freq: number)
    {
        const now = this.getCurrentTime();

        this.lfo.frequency.cancelScheduledValues(now);
        this.lfo.frequency.setValueAtTime(freq, now);
    }
}
