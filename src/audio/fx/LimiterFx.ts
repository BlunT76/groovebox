export default class LimiterFX
{
    limiterNode: DynamicsCompressorNode;
    constructor (audioCtx: AudioContext)
    {
        this.limiterNode = audioCtx.createDynamicsCompressor();
        // Creating a compressor but setting a high threshold and 
        // high ratio so it acts as a limiter. More explanation at 
        // https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode
        this.limiterNode.threshold.setValueAtTime(-1.0, audioCtx.currentTime); // In Decibels
        this.limiterNode.knee.setValueAtTime(0, audioCtx.currentTime); // In Decibels
        this.limiterNode.ratio.setValueAtTime(20.0, audioCtx.currentTime);  // In Decibels
        this.limiterNode.attack.setValueAtTime(0.001, audioCtx.currentTime); // Time is seconds
        this.limiterNode.release.setValueAtTime(0.1, audioCtx.currentTime); // Time is seconds
    }
}