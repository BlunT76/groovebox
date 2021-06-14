import { IAdsr } from "./IAdsr";
import { IAnalogSynthParams } from "./IAnalogSynthParams";
import { IDrumParams } from "./IDrumParams";
import { IFx } from "./IFx";
import { IVcf } from "./IVcf";

export interface ITrackPreset
{
    level: number;
    vcf: IVcf;
    env: IAdsr;
    analogSynthParams?: IAnalogSynthParams;
    drumParams?: IDrumParams;
    fx: IFx;
    name: string;
    pan: number;
}