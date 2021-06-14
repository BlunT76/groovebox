import Note from "../audio/Note";
import { ELfoSync } from "../constant/ELfoSync";
import { EOscType } from "../constant/EOscType";
import { EOutput } from "../constant/EOutput";
import { IAdsr } from "../models/IAdsr";
import { IAnalogSynthParams } from "../models/IAnalogSynthParams";
import { IDrumParams } from "../models/IDrumParams";
import { IFx } from "../models/IFx";
import { INotes } from "../models/INotes";
import { IVcf } from "../models/IVcf";
import { ITrackPreset } from "../models/ITrackPreset";

export default class Track
{
    id: number;
    name: string;
    level: number;
    fxLevel?: number = 0;
    bar: INotes[];
    vcf: IVcf;
    env: IAdsr;
    analogSynthParams?: IAnalogSynthParams;
    drumParams?: IDrumParams;
    mute: boolean;
    fx: IFx;
    output: EOutput;
    pan: number = 0;

    constructor (id: number, name: string)
    {
        this.id = id;

        this.name = name;

        this.init(id);
    }

    private init (id: number)
    {
        this.mute = false;

        this.vcf = this.getDefaultVcf();

        this.env = this.getDefaultEnv();

        this.bar = this.getDefaultBar();

        this.level = id < 8 ? 0.5 : 0.5;

        this.output = EOutput.MASTERGAIN;

        this.fxLevel = 0;

        this.fx = this.getDefaultFx();

        this.drumParams = id < 8 ? this.getDefaultDrumParams() : undefined;

        this.analogSynthParams = id > 7 ? this.getDefaultAnalogSynthParams() : undefined;
    }

    /** GETTERS /SETTERS */
    
    getLevel (): number
    {
        return this.level;
    }

    setLevel (level: number)
    {
        this.level = level;
    }

    getPan (): number
    {
        return this.pan;
    }

    setPan (pan: number)
    {
        this.pan = pan;
    }

    getFxLevel (): number
    {
        return this.fxLevel;
    }

    setFxLevel (level: number)
    {
        this.fxLevel = level;
    }

    getFx (): IFx
    {
        return this.fx;
    }

    setFx (fx: IFx)
    {
        this.fx = fx;
    }

    getVcf (): IVcf
    {
        return this.vcf;
    }

    setVcf (vcf: IVcf)
    {
        this.vcf = vcf;
    }

    getEnv (): IAdsr
    {
        return this.env;
    }

    setEnv (env: IAdsr)
    {
        this.env = env;
    }

    setOutput (output: EOutput)
    {
        this.output = output;
    }

    getOutput ()
    {
        return this.output;
    }

    /** DEFAULT TRACK CONFIG */

    getDefaultFx (): IFx
    {
        return {
            delay: {
                on: false,
                wetdry: 1,
                delayTime: 0.005,
                feedback: 0.3,
                output: 'reverb',
            },
            reverb: {
                on: false,
                roomSize: 0,
                dampening: 0,
                wet: 0,
                dry: 1.0,
                output: 'masterGain',
            },
            distortion: {
                on: false,
                amount: 0
            },
            equalizer: {
                on: false,
                lowGain: 0,
                midGain: 0,
                highGain: 0
            },
            flanger: {
                on: false,
                wetdry: 0,
                delayTime: 0.0001, // min="0.001" max="0.02"
                feedback: 0.5, // min="0" max="1"
                oscfreq: 0.0001 // min: 0.05 max: 5
            }
        }
    }

    getDefaultVcf ()
    {
        return {
            type: "lowpass" as unknown as BiquadFilterType,
            Q: 0.001,
            frequency: 5512.5
        }
    }

    getDefaultEnv ()
    {
        if (this.id < 8)
        {
            return {
                a: 0.01,
                d: 5,
                s: 0,
                r: 0
            }
        }

        return {
            a: 0.001,
            d: 0,
            s: 0.5,
            r: 0.001
        }
    }

    private getDefaultBar (): INotes[]
    {
        return [
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
            { notes: [] as Note[] },
        ]
    }

    public getDefaultDrumParams (): IDrumParams
    {
        return {
            tone: 0,
        }
    }

    public getDefaultAnalogSynthParams (): IAnalogSynthParams
    {
        return {
            vco: {
                vco2detune: 0,
                vco1Gain: 1,
                vco2Gain: 0,
                vco1Type: EOscType.SAWTOOTH,
                vco2Type: EOscType.TRIANGLE
            },
            lfo: {
                frequency: 0,
                type: EOscType.SIN,
                intensity: 0,
                sync: ELfoSync["off"]
            },
            whiteNoiseGain: 0
        }
    }

    public setTrackConfig (config: unknown)
    {
        const preset = config as ITrackPreset;

        this.level = preset.level;

        this.vcf = preset.vcf;

        this.env = preset.env;

        this.fx = preset.fx;

        this.pan = preset.pan || 0;

        if (this.analogSynthParams)
        {
            this.analogSynthParams = preset.analogSynthParams;
        }

        if (this.drumParams)
        {
            this.drumParams = preset.drumParams;
        }
    }
}