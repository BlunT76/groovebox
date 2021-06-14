import GrooveBox from "../GrooveBox";

export default class BitCrusherFX
{
    bitcrusher: AudioWorkletNode
    audioCtx: AudioContext;

    constructor (grooveBox: GrooveBox)
    {
        this.audioCtx = grooveBox.audioCtx;

        // this.audioCtx.audioWorklet.addModule('../../worklet/bitcrusher.js').then(() =>
        // {
        //     this.bitcrusher = new AudioWorkletNode(this.audioCtx, 'bitcrusher', {
        //         parameterData: { bitDepth: 12 }
        //     });

        //     this.bitcrusher.connect(grooveBox.masterGain)
        //     grooveBox.masterGain.connect(grooveBox.limiter.limiterNode)
        //     grooveBox.limiter.limiterNode.connect(grooveBox.audioCtx.destination);
        // });
    }
}