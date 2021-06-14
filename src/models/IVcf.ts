export interface IVcf
{
    /**
     * type: lowpass, highpass, bandpass
     */
    type: BiquadFilterType,
    /**
     * Q range of 0.0001 to 1000, in dB
     */
    Q: number,
    /**
     * Frequency range of 40 to 22050
     */
    frequency: number
}
