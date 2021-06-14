import { IAdsr } from '../../models/IAdsr';
import { IAnalogSynthParams } from '../../models/IAnalogSynthParams';
import GrooveBox from '../GrooveBox';
import Track from '../../data/Track';
import DelayFX from '../fx/DelayFX';
import ReverbFX from '../fx/ReverbFX';
import TrackFx from '../fx/TrackFx';
import { delay, distortion, equalizer, flanger, reverb } from '../../models/IFx';
import DistortionFX from '../fx/DistortionFX';

export default class DrumTrack
{
    private grooveBox: GrooveBox;
    public audioCtx: AudioContext;
    public output: GainNode;
    public vcf: BiquadFilterNode;
    public filterAdsr: IAdsr;
    public gain: number = 0.8;
    public params: IAnalogSynthParams;
    private timeOffset: number = 0.05;
    private track: Track;
    private trackFx: TrackFx;
    private pan: StereoPannerNode;

    constructor (grooveBox: GrooveBox, track: Track)
    {
        this.audioCtx = grooveBox.audioCtx;
        this.grooveBox = grooveBox;
        this.track = track;
        this.trackFx = new TrackFx(this.grooveBox);

        // create nodes
        this.pan = this.audioCtx.createStereoPanner();
        this.output = this.audioCtx.createGain();
        this.output.gain.value = track.level;

        this.vcf = this.audioCtx.createBiquadFilter();
        this.vcf.type = track.vcf.type || "lowpass";
        this.vcf.Q.value = track.vcf.Q || 0.0001;
        this.vcf.frequency.value = track.vcf.frequency || 22050;

        // connect nodes
        this.vcf.connect(this.pan);

        this.pan.connect(this.output);

        this.output.connect(this.trackFx.getDistortion().inputGain);

        this.gain = track.getLevel();
    }

    seqNoteOn (time: number)
    {
        const { vcf, env, drumParams, level, } = this.track;
        
        const now = this.getCurrentTime();

        if (time === 0)
        {
            time = now;
        }

        const source = this.audioCtx.createBufferSource();
        source.buffer = this.grooveBox.drumKit[this.track.id];
        source.connect(this.vcf);
        source.detune.setValueAtTime(drumParams.tone, time);

        this.output.gain.cancelScheduledValues(time);
        this.output.gain.setValueAtTime(0, time);

        this.output.gain.cancelScheduledValues(0);
        this.output.gain.linearRampToValueAtTime(level, time + env.a);

        this.output.gain.linearRampToValueAtTime(0, time + env.a + (1 / (source.buffer.duration / (env.d + 0.1))));

        source.start(time);
    }

    setDelay (delay: delay)
    {
        const delayFx = this.trackFx.getDelay();

        if (delay.on && !delayFx.on)
        {
            delayFx.setOnOff(true);
        }
        else if (!delay.on && delayFx.on)
        {
            delayFx.setOnOff(false);
        }

        delayFx.setDelayTime(delay.delayTime);
        delayFx.setFeedback(delay.feedback);
        delayFx.setMix(delay.wetdry);
    }

    setReverb (reverb: reverb)
    {
        const reverbFx = this.trackFx.getreverb();

        if (reverb.on && !reverbFx.on)
        {
            reverbFx.setOnOff(true);
        }
        else if (!reverb.on && reverbFx.on)
        {
            reverbFx.setOnOff(false);
        }

        reverbFx.setDamping(reverb.dampening);
        reverbFx.setRoomSize(reverb.roomSize);
        reverbFx.setDryWet(reverb.dry, reverb.wet);
    }

    setDistortion (distortion: distortion)
    {
        const distortionFx = this.trackFx.getDistortion();

        if (distortion.on && !distortionFx.on)
        {
            distortionFx.setOnOff(true);
        }
        else if (!distortion.on && distortionFx.on)
        {
            distortionFx.setOnOff(false);
        }

        distortionFx.setAmount(distortion.amount);
    }

    setEqualizer (equalizer: equalizer)
    {
        const equalizerFx = this.trackFx.getEqualizer();

        if (equalizer.on && !equalizerFx.on)
        {
            equalizerFx.setOnOff(true);
        }
        else if (!equalizer.on && equalizerFx.on)
        {
            equalizerFx.setOnOff(false);
        }

        equalizerFx.setLowGain(equalizer.lowGain);
        equalizerFx.setMidGain(equalizer.midGain);
        equalizerFx.setHighGain(equalizer.highGain);
    }

    setFlanger (flanger: flanger)
    {
        const flangerFx = this.trackFx.getFlanger();

        if (flanger.on && !flangerFx.on)
        {
            flangerFx.setOnOff(true);
        }
        else if (!flanger.on && flangerFx.on)
        {
            flangerFx.setOnOff(false);
        }

        //flangerFx.setDelayTime(flanger.delayTime);
        flangerFx.setFeedback(flanger.feedback);
        flangerFx.setOsc(flanger.oscfreq);
        flangerFx.setMix(flanger.wetdry);
    }

    setOutput (destination: AudioNode)
    {
        this.output.disconnect();
        this.output.connect(destination);
    }

    getCurrentTime ()
    {
        return this.audioCtx.currentTime + this.timeOffset;
    }

    setVcf ()
    {
        const now = this.getCurrentTime();
        const { vcf } = this.track;

        if (this.vcf.frequency.value.toFixed(3) !== vcf.frequency.toFixed(3))
        {
            this.vcf.frequency.cancelScheduledValues(0);
            this.vcf.frequency.exponentialRampToValueAtTime(vcf.frequency, now);

            this.grooveBox.sendEvent({ 'lcdLine4': { key: 'VCF FREQ:', value: (vcf.frequency).toFixed(0) + ' Hz' } });
        }

        if (this.vcf.Q.value.toFixed(3) !== vcf.Q.toFixed(3))
        {
            this.vcf.Q.cancelScheduledValues(0);
            this.vcf.Q.setValueAtTime(vcf.Q, now);

            this.grooveBox.sendEvent({ 'lcdLine4': { key: 'VCF Q:', value: (vcf.Q).toFixed(0) } });
        }

        if (this.vcf.type !== vcf.type)
        {
            this.vcf.type = vcf.type;
        }
    }

    setPan ()
    {
        const now = this.getCurrentTime();
        const { pan } = this.track;

        this.pan.pan.setValueAtTime(pan, now);

        this.grooveBox.sendEvent({ 'lcdLine4': { key: 'PAN:', value: this.pan.pan.value.toFixed(2) } });
    }

    setPreset ()
    {
        this.setDistortion(this.track.fx.distortion);
        this.setEqualizer(this.track.fx.equalizer);
        this.setFlanger(this.track.fx.flanger);
        this.setDelay(this.track.fx.delay);
        this.setReverb(this.track.fx.reverb);

        this.setVcf();
        this.filterAdsr = this.track.env;
        this.pan.pan.setValueAtTime(this.track.pan || 0, 0);
        this.output.gain.setValueAtTime(this.track.level, 0);
    }
}
