import { equalizer } from "../../models/IFx";
import FX from "./FX";

export default class EqualizerFX extends FX
{
    public low: BiquadFilterNode;
    private mid: BiquadFilterNode;
    public high: BiquadFilterNode;

    constructor (audioCtx: AudioContext, params?: equalizer)
    {
        super(audioCtx)

        this.low = audioCtx.createBiquadFilter();
        this.low.type = "lowshelf";
        this.low.frequency.value = 120.0; //320.0;
        this.low.gain.value = params?.lowGain || 0.0;

        this.mid = audioCtx.createBiquadFilter();
        this.mid.type = "peaking";
        this.mid.frequency.value = 2500.0; // 1000.0;
        this.mid.Q.value = 1.2; // 0.5;
        this.mid.gain.value = params?.midGain || 0.0;
        this.mid.connect(this.low);

        this.high = audioCtx.createBiquadFilter();
        this.high.type = "highshelf";
        this.high.frequency.value = 4500.0; // 3200.0;
        this.high.gain.value = params?.highGain || 0.0;
        this.high.connect(this.mid);

        this.fxGain.connect(this.high);
        this.low.connect(this.outputGain);

        this.on = params?.on || false;
        this.setOnOff(this.on);
    }

    setLowGain (value: number)
    {
        this.low.gain.setValueAtTime(value * 10, this.getCurrentTime());
    }

    setMidGain (value: number)
    {
        this.mid.gain.setValueAtTime(value * 10, this.getCurrentTime());
    }

    setHighGain (value: number)
    {
        this.high.gain.setValueAtTime(value * 10, this.getCurrentTime());
    }
}