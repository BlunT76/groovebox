import { EOscType } from "../constant/EOscType";

export interface IVco
{
    vco2detune: number,
    vco1Gain: number,
    vco2Gain: number,
    vco1Type: EOscType,
    vco2Type: EOscType
}