import { ILfo } from "./ILfo";
import { IVco } from "./IVco";

export interface IAnalogSynthParams
{
    vco: IVco,
    lfo?: ILfo,
    whiteNoiseGain: number
}