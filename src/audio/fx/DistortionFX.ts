import { distortion } from "../../models/IFx";
import FX from "./FX";

export default class DistortionFX extends FX
{
    distortion: WaveShaperNode;
    amount: number;

    constructor (audioCtx: AudioContext, params?: distortion)
    {
        super(audioCtx);
        
        this.distortion = this.audioCtx.createWaveShaper();
        this.amount = params?.amount || 20;
        this.distortion.curve = this.makeDistortionCurve(0);

        this.fxGain.connect(this.distortion);
        this.distortion.connect(this.outputGain);

        this.on = params?.on || false;
        this.setOnOff(this.on);
    }

    makeDistortionCurve (amount: number)
    {
        let n_samples = 8192;
        let ws_table = new Float32Array(n_samples);
        
        amount = Math.min(amount, 0.9999);
        var k = 2 * amount / (1 - amount),
            i, x;
        for (i = 0; i < n_samples; i++) {
            x = i * 2 / n_samples - 1;
            ws_table[i] = (1 + k) * x / (1 + k * Math.abs(x));
        }

        return ws_table;
    }

    setAmount (value: number)
    {
        this.amount = value;
        this.distortion.curve = this.makeDistortionCurve(value);
    }
}
