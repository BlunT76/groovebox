export interface IFx
{
    delay: delay,
    reverb: reverb,
    distortion: distortion,
    equalizer: equalizer,
    flanger: flanger
}

export type flanger = {
    on: boolean;
    wetdry: number;
    delayTime: number;
    feedback: number;
    oscfreq: number;
}

export type equalizer = {
    on: boolean;
    lowGain: number;
    midGain: number;
    highGain: number;
}

export type delay = {
    on: boolean;
    wetdry: number;
    delayTime: number;
    feedback: number;
    output: string;
}

export type reverb = {
    on: boolean
    roomSize: number;
    dampening: number;
    wet: number;
    dry: number;
    output: string;
}

export type distortion = {
    on: boolean;
    amount: number;
}