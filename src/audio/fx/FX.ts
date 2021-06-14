export default class FX
{
    public audioCtx: AudioContext;
    public timeOffset: number = 0.05;
    public bypassGain: GainNode;
    public inputGain: GainNode;
    public outputGain: GainNode;
    public fxGain: GainNode;
    public on: boolean = false;


    constructor (audioCtx: AudioContext)
    {
        this.audioCtx = audioCtx;

        this.bypassGain = audioCtx.createGain();
        this.bypassGain.gain.value = 1;

        this.fxGain = audioCtx.createGain();
        this.fxGain.gain.value = 0;

        this.inputGain = audioCtx.createGain();
        this.inputGain.gain.value = 1;

        this.outputGain = audioCtx.createGain();
        this.outputGain.gain.value = 1;

        this.init();
    }

    private init ()
    {
        this.inputGain.connect(this.bypassGain);
        this.inputGain.connect(this.fxGain);

        this.bypassGain.connect(this.outputGain);
        this.fxGain.connect(this.outputGain);
    }

    public getCurrentTime ()
    {
        return this.audioCtx.currentTime + this.timeOffset;
    }

    public setOnOff (on: boolean)
    {
        if (on)
        {
            this.on = on;

            this.fxGain.gain.setValueAtTime(1, this.getCurrentTime());

            this.bypassGain.gain.setValueAtTime(0, this.getCurrentTime());

            return;
        }

        this.on = on;

        this.fxGain.gain.setValueAtTime(0, this.getCurrentTime());

        this.bypassGain.gain.setValueAtTime(1, this.getCurrentTime());
    }

    public setMix (value: number)
    {
        if (this.on)
        {
            this.fxGain.gain.setValueAtTime(value, this.getCurrentTime());

            this.bypassGain.gain.setValueAtTime(1, this.getCurrentTime());
        }
    }
}
