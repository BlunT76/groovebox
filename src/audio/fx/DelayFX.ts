import { delay } from "../../models/IFx";
import FX from "./FX";

export default class DelayFX extends FX
{
    public delay: DelayNode;
    public feedback: GainNode;

    constructor (audioCtx: AudioContext, params?: delay)
    {
        super(audioCtx);

        this.delay = this.audioCtx.createDelay();
        this.delay.delayTime.value = params?.delayTime || 0.4;

        this.feedback = audioCtx.createGain();
        this.feedback.gain.value = params?.feedback || 0.3;

        this.delay.connect(this.feedback);
        this.feedback.connect(this.delay);

        this.fxGain.connect(this.delay);
        this.delay.connect(this.outputGain);

        this.on = params?.on || false;
        this.setOnOff(this.on);
    }

    setDelayTime (time: number)
    {
        const now = this.getCurrentTime();

        this.delay.delayTime.cancelScheduledValues(now)
        this.delay.delayTime.linearRampToValueAtTime(time, now);

    }

    setFeedback (vol: number)
    {
        const now = this.getCurrentTime();

        this.feedback.gain.cancelScheduledValues(now);
        this.feedback.gain.linearRampToValueAtTime(vol, now);
    }
}
