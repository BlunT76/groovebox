import { IAdsr } from '../../models/IAdsr';
import { IAnalogSynthParams } from '../../models/IAnalogSynthParams';
import { EOscType } from '../../constant/EOscType';
import GrooveBox from '../GrooveBox';
import Note from '../Note';
import { NOTES_FREQS } from '../../constant/NOTES_FREQS';
import { T16range } from '../../types/types';
import Track from '../../data/Track';
import { ELfoSync } from '../../constant/ELfoSync';
import TrackFx from '../fx/TrackFx';
import { delay, distortion, equalizer, flanger, reverb } from '../../models/IFx';
import { ELfoDest } from '../../constant/ELfoDest';

export default class MonoSynth
{
    private grooveBox: GrooveBox;
    public audioCtx: AudioContext;
    public output: GainNode;
    public vco1: OscillatorNode;
    public vco2: OscillatorNode;
    public vcf: BiquadFilterNode;
    public filterAdsr: IAdsr;
    public lfo: OscillatorNode;
    public lfoGain: GainNode;
    public gain: number = 0.8;
    public params: IAnalogSynthParams;
    public note: Note;
    private timeOffset: number = 0.05;
    private track: Track;
    private vco1Gain: GainNode;
    private vco2Gain: GainNode;
    private trackFx: TrackFx;
    public whiteNoise: AudioBufferSourceNode;
    public whiteNoiseGain: GainNode;
    private isStopping: boolean = false;
    private pan: StereoPannerNode;

    constructor (grooveBox: GrooveBox, track: Track)
    {
        this.audioCtx = grooveBox.audioCtx;
        this.grooveBox = grooveBox;
        this.track = track;
        this.trackFx = new TrackFx(this.grooveBox);

        // create nodes
        this.vco1 = this.audioCtx.createOscillator();
        this.vco1Gain = this.audioCtx.createGain();

        this.vco2 = this.audioCtx.createOscillator();
        this.vco2Gain = this.audioCtx.createGain();

        this.lfo = this.audioCtx.createOscillator();
        this.lfoGain = this.audioCtx.createGain();

        this.vcf = this.audioCtx.createBiquadFilter();

        this.pan = this.audioCtx.createStereoPanner();

        this.output = this.audioCtx.createGain();

        // white noise
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (var i = 0; i < bufferSize; i++)
        {
            output[i] = Math.random() * 2 - 1;
        }

        this.whiteNoise = this.audioCtx.createBufferSource();
        this.whiteNoise.buffer = noiseBuffer;
        this.whiteNoise.loop = true;

        this.whiteNoiseGain = this.audioCtx.createGain();
        this.whiteNoiseGain.gain.value = track.analogSynthParams.whiteNoiseGain || 0;
        this.whiteNoise.connect(this.whiteNoiseGain);
        this.whiteNoiseGain.connect(this.vcf);


        // connect nodes
        this.vco1Gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
        this.vco2Gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);

        this.vco1Gain.connect(this.vcf);
        this.vco2Gain.connect(this.vcf);

        this.vco1.connect(this.vco1Gain);
        this.vco2.connect(this.vco2Gain);

        this.lfo.connect(this.lfoGain);
        this.lfoGain.gain.setValueAtTime(500, this.audioCtx.currentTime);
        this.lfoGain.connect(this.vcf.frequency);

        this.vcf.type = track.vcf.type || "lowpass";
        this.vcf.Q.value = track.vcf.Q || 0.0001;
        this.vcf.frequency.value = track.vcf.frequency || 22050;

        this.vcf.connect(this.pan);

        this.pan.connect(this.output);

        this.output.connect(this.trackFx.getDistortion().inputGain);

        // config nodes
        this.output.gain.value = 0;

        this.filterAdsr = {
            a: track.env.a || 0.1,
            d: track.env.d || 0.2,
            s: track.env.s || 0.2,
            r: track.env.r || 0.2
        }

        this.vco1.type = track.analogSynthParams.vco.vco1Type || EOscType.SIN;

        this.gain = track.getLevel();

        this.lfo.start(0);
        this.vco1.start(0);
        this.vco2.start(0);
        this.whiteNoise.start(0);
    }

    setPreset ()
    {
        this.setDistortion(this.track.fx.distortion);
        this.setEqualizer(this.track.fx.equalizer);
        this.setFlanger(this.track.fx.flanger);
        this.setDelay(this.track.fx.delay);
        this.setReverb(this.track.fx.reverb);

        this.setVco();
        this.setLfo();
        this.setVcf();
        this.filterAdsr = this.track.env;
        this.pan.pan.setValueAtTime(this.track.pan || 0, 0);
        this.output.gain.setValueAtTime(this.track.level, 0);
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

    restartLfo (time?: number)
    {
        this.lfo.disconnect(this.lfoGain);
        this.lfo = this.audioCtx.createOscillator();
        this.lfo.connect(this.lfoGain);
        this.setLfo();
        this.lfo.start(time || 0);
    }
    setLfo ()
    {
        const now = this.getCurrentTime();
        const { analogSynthParams, vcf } = this.track;
        const { lfo } = analogSynthParams;

        if (this.lfo.type !== lfo.type)
        {
            this.lfo.type = lfo.type || EOscType.SIN;
        }

        if (this.lfo.frequency.value.toFixed(3) !== lfo.frequency.toFixed(3) && lfo.sync === ELfoSync.off)
        {
            this.lfo.frequency.setValueAtTime(lfo.frequency, now);

            this.grooveBox.sendEvent({ 'lcdLine4': { key: 'LFO FREQ:', value: (lfo.frequency).toFixed(2) + ' Hz' } });
        }

        if (this.lfoGain.gain.value.toFixed(3) !== (lfo.intensity * vcf.frequency).toFixed(3))
        {
            const intensity = lfo.intensity * vcf.frequency;

            this.lfoGain.gain.cancelScheduledValues(0);

            this.lfoGain.gain.linearRampToValueAtTime(intensity, now);

            this.grooveBox.sendEvent({ 'lcdLine4': { key: 'LFO GAIN:', value: (lfo.intensity).toFixed(2) } });
        }

        if (lfo.sync !== ELfoSync.off)
        {
            const bpm = this.grooveBox.getBpm();

            this.lfo.frequency.setValueAtTime(bpm / 60 * 1 / lfo.sync, now);
        }

        if (lfo.dest)
        {
            try
            {
                if (lfo.dest === ELfoDest.VCO)
                {
                    this.lfoGain.connect(this.vco1.frequency);
                    this.lfoGain.connect(this.vco2.frequency);
                    this.lfoGain.connect(this.whiteNoise.detune);

                    this.lfoGain.disconnect(this.vcf.frequency);
                }
                else if (lfo.dest === ELfoDest.VCF)
                {
                    this.lfoGain.connect(this.vcf.frequency);
                    this.lfoGain.disconnect(this.vco1.frequency);
                    this.lfoGain.disconnect(this.vco2.frequency);
                }
            }
            catch (error)
            {
                return;
            }
        }
    }

    setVcf ()
    {
        const now = this.getCurrentTime();
        const { vcf, analogSynthParams } = this.track;

        if (this.vcf.frequency.value.toFixed(3) !== vcf.frequency.toFixed(3))
        {
            try
            {
                this.vcf.frequency.cancelScheduledValues(0);
                this.vcf.frequency.exponentialRampToValueAtTime(vcf.frequency, now);

                this.grooveBox.sendEvent({ 'lcdLine4': { key: 'VCF FREQ:', value: (vcf.frequency).toFixed(0) + ' Hz' } });

                const intensity = analogSynthParams.lfo.intensity * vcf.frequency;
                this.lfoGain.gain.cancelScheduledValues(0);
                this.lfoGain.gain.linearRampToValueAtTime(intensity, now);
            }
            catch (error)
            {
                console.log(error)
            }

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

    setVco ()
    {
        const now = this.getCurrentTime();
        const { vco } = this.track.analogSynthParams;

        // VCO 1
        if (this.vco1.type !== vco.vco1Type)
        {
            this.vco1.type = vco.vco1Type;
        }

        if (this.vco1Gain.gain.value.toFixed(3) !== (vco.vco1Gain).toFixed(3))
        {
            this.vco1Gain.gain.cancelScheduledValues(0);
            this.vco1Gain.gain.linearRampToValueAtTime(vco.vco1Gain, now);

            this.grooveBox.sendEvent({ 'lcdLine4': { key: 'VCO1 GAIN:', value: (vco.vco1Gain).toFixed(2) } });
        }

        // VCO 2
        if (this.vco2.type !== vco.vco2Type)
        {
            this.vco2.type = vco.vco2Type;
        }

        if (this.vco2Gain.gain.value.toFixed(3) !== vco.vco2Gain.toFixed(3))
        {
            this.vco2Gain.gain.cancelScheduledValues(0);
            this.vco2Gain.gain.linearRampToValueAtTime(vco.vco2Gain, now);

            this.grooveBox.sendEvent({ 'lcdLine4': { key: 'VCO2 GAIN:', value: (vco.vco2Gain).toFixed(2) } });
        }
    }

    setNoise ()
    {
        const now = this.getCurrentTime();
        const { whiteNoiseGain } = this.track.analogSynthParams;

        if (this.whiteNoiseGain.gain.value.toFixed(3) !== (whiteNoiseGain).toFixed(3))
        {
            this.whiteNoiseGain.gain.cancelScheduledValues(0);
            this.whiteNoiseGain.gain.linearRampToValueAtTime(whiteNoiseGain, now);
        }

        this.grooveBox.sendEvent({ 'lcdLine4': { key: 'NOISE GAIN:', value: (whiteNoiseGain * 10).toFixed(2) } });
    }

    setPan ()
    {
        const now = this.getCurrentTime();
        const { pan } = this.track;

        this.pan.pan.setValueAtTime(pan, now);

        this.grooveBox.sendEvent({ 'lcdLine4': { key: 'PAN:', value: this.pan.pan.value.toFixed(2) } });
    }

    public seqNoteOn (time: number, currentBeatNote: Note)
    {
        const { level, analogSynthParams, env } = this.track;
        const { vco } = analogSynthParams;

        const freq = NOTES_FREQS[currentBeatNote.octave][currentBeatNote.name];

        if (!freq)
        {
            return;
        }

        this.isStopping = false;

        this.vco1.frequency.cancelScheduledValues(0);
        this.vco1.frequency.linearRampToValueAtTime(freq, time);

        this.vco2.frequency.cancelScheduledValues(0);
        this.vco2.frequency.linearRampToValueAtTime(freq + vco.vco2detune, time)

        
        // attack
        this.output.gain.cancelScheduledValues(0);
        this.output.gain.linearRampToValueAtTime(level, time + env.a);

        // decay
        this.output.gain.cancelScheduledValues(time + env.a);
        this.output.gain.linearRampToValueAtTime(env.s, time + env.a + env.d);
    }

    public seqNoteOff (time: number)
    {
        if (this.isStopping)
        {
            return;
        }

        this.isStopping = true;

        const { level, analogSynthParams, env } = this.track;

        this.output.gain.cancelScheduledValues(time);
        this.output.gain.setValueAtTime(this.output.gain.value, time);
        this.output.gain.linearRampToValueAtTime(0, time + env.r);
    }

    public playMidiNote (note: Note, seqId?: T16range)
    {
        const now = this.getCurrentTime();

        const { level, analogSynthParams, env } = this.track;
        const { vco } = analogSynthParams;

        const freq = NOTES_FREQS[note.octave][note.name];

        this.vco1.frequency.cancelScheduledValues(0);
        this.vco1.frequency.linearRampToValueAtTime(freq, now);

        this.vco2.frequency.cancelScheduledValues(0);
        this.vco2.frequency.linearRampToValueAtTime(freq + vco.vco2detune, now)

        this.output.gain.cancelScheduledValues(0);
        this.output.gain.linearRampToValueAtTime(level, now + env.a);

        this.output.gain.cancelScheduledValues(now + env.a + env.d);
        this.output.gain.linearRampToValueAtTime(env.s, now + env.a + env.d);
        //this.outputGain.gain.linearRampToValueAtTime(0, now + env.a + env.r);

        if (!note.isFromMidi)
        {
            //const length = this.grooveBox.noteLength;
            this.output.gain.linearRampToValueAtTime(0, now + env.a + env.d + env.r);
        }

        // if (note.length)
        // {
        //     this.stop(note.length)
        // }

        return this;
    }

    public stopMidiNote ()
    {
        // used to stop notes from midi keyboards
        const now = this.getCurrentTime();

        const { level, analogSynthParams, env } = this.track;

        const { isPlaying } = this.grooveBox;

        this.output.gain.cancelScheduledValues(0);
        this.output.gain.linearRampToValueAtTime(0.001, now + env.r);
    }

    public stop (length: number)
    {
        const now = this.getCurrentTime();
        const { level, analogSynthParams, env } = this.track;

        this.output.gain.cancelScheduledValues(now + length);
        this.output.gain.setValueAtTime(this.output.gain.value, now + length);
        this.output.gain.linearRampToValueAtTime(0, now + length + env.r);
    }

    private disconnect ()
    {
        this.vco1.disconnect();
        this.vco2.disconnect();
        this.lfo.disconnect();
        this.lfoGain.disconnect();
        this.output.disconnect();
    }

    public setTrackConfig (track: Track)
    {
        this.track = track;
        this.params = track.analogSynthParams;
        this.filterAdsr = track.env;
        this.setVcf();
        this.setVco();
        this.setLfo();
        this.setDistortion(track.fx.distortion);
        this.setEqualizer(track.fx.equalizer);
        this.setFlanger(track.fx.flanger);
        this.setDelay(track.fx.delay);
        this.setReverb(track.fx.reverb);
    }
}
