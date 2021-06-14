import GrooveBox from "../GrooveBox";
import DelayFX from "./DelayFX";
import DistortionFX from "./DistortionFX";
import EqualizerFX from "./EqualizerFX";
import FlangerFX from "./FlangerFX";
import ReverbFX from "./ReverbFX";

export default class TrackFx
{
    private audioCtx: AudioContext;
    private equalizer: EqualizerFX;
    private delay: DelayFX;
    private reverb: ReverbFX;
    private distortion: DistortionFX;
    private flanger: FlangerFX;
    grooveBox: GrooveBox;
    

    constructor (grooveBox: GrooveBox)
    {
        this.grooveBox = grooveBox;
        this.audioCtx = grooveBox.audioCtx;

        // create Fx
        this.distortion = new DistortionFX(this.audioCtx);
        this.equalizer = new EqualizerFX(this.audioCtx);
        this.flanger = new FlangerFX(this.audioCtx);
        this.delay = new DelayFX(this.audioCtx);
        this.reverb = new ReverbFX(this.audioCtx);

        // connect fx
        this.distortion.outputGain.connect(this.equalizer.inputGain);

        this.equalizer.outputGain.connect(this.flanger.inputGain);

        this.flanger.outputGain.connect(this.delay.inputGain);

        this.delay.outputGain.connect(this.reverb.inputGain)

        this.reverb.outputGain.connect(this.grooveBox.masterGain);
    }

    getDistortion (): DistortionFX
    {
        return this.distortion;
    }

    getEqualizer (): EqualizerFX
    {
        return this.equalizer;
    }

    getFlanger (): FlangerFX
    {
        return this.flanger;
    }

    getDelay (): DelayFX
    {
        return this.delay;
    }

    getreverb (): ReverbFX
    {
        return this.reverb;
    }
}
