import { ELfoDest } from "../constant/ELfoDest";
import { ELfoSync } from "../constant/ELfoSync";
import { EOscType } from "../constant/EOscType";

export interface ILfo
{
    frequency: number,
    type: EOscType,
    intensity: number,
    sync: ELfoSync,
    dest?: ELfoDest
}