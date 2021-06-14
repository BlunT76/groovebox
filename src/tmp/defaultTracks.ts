// import { EOscType } from "../constant/EOscType";

// export const defaultTracks = [
//     {
//         id: 0,
//         name: "BD",
//         mute: false,
//         drumParams: {
//             tone: 0,
//             decay: 0.8,
//             level: 0.8,
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 1,
//         name: "SD",
//         mute: false,
//         drumParams: {
//             tone: 0,
//             decay: 0.8,
//             level: 0.8,
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 2,
//         name: "TL",
//         mute: false,
//         drumParams: {
//             tone: 0,
//             decay: 0.8,
//             level: 0.8,
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 3,
//         name: "TM",
//         mute: false,
//         drumParams: {
//             tone: 0,
//             decay: 0.8,
//             level: 0.8,
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 4,
//         name: "TH",
//         mute: false,
//         drumParams: {
//             tone: 0,
//             decay: 0.8,
//             level: 0.8,
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 5,
//         name: "HC",
//         mute: false,
//         drumParams: {
//             tone: 0,
//             decay: 0.8,
//             level: 0.8,
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     }, {
//         id: 6,
//         name: "HO",
//         mute: false,
//         drumParams: {
//             tone: 0,
//             decay: 0.8,
//             level: 0.8,
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 7,
//         name: "CY",
//         mute: false,
//         drumParams: {
//             tone: 0,
//             decay: 0.8,
//             level: 0.8,
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 8,
//         name: 'SY1',
//         mute: false,
//         analogSynthParams: {
//             gainValue: 0.3,
//             vco: {
//                 vco2detune: 0,
//                 mix: 0,
//                 vco1Type: EOscType.SIN,
//                 vco2Type: EOscType.SIN
//             },
//             vcf: {
//                 type: "lowpass" as unknown as BiquadFilterType,
//                 Q: 0,
//                 frequency: 5512.5
//             },
//             filterAdsr: {
//                 a: 0,
//                 d: 0,
//                 s: 0,
//                 r: 0
//             },
//             lfo: {
//                 frequency: 50,
//                 lfoType: EOscType.SAWTOOTH,
//                 gain: 100
//             }
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 9,
//         name: 'SY2',
//         mute: false,
//         analogSynthParams: {
//             gainValue: 0.7,
//             vco: {
//                 vco2detune: 0,
//                 mix: 0,
//                 vco1Type: EOscType.SIN,
//                 vco2Type: EOscType.SIN
//             },
//             vcf: {
//                 type: "lowpass" as unknown as BiquadFilterType,
//                 Q: 0,
//                 frequency: 5512.5
//             },
//             filterAdsr: {
//                 a: 0,
//                 d: 0,
//                 s: 0,
//                 r: 0
//             },
//             lfo: {
//                 frequency: 50,
//                 lfoType: EOscType.SAWTOOTH,
//                 gain: 100
//             }
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 10,
//         name: 'SY3',
//         mute: false,
//         analogSynthParams: {
//             gainValue: 0.7,
//             vco: {
//                 vco2detune: 0,
//                 mix: 0,
//                 vco1Type: EOscType.SIN,
//                 vco2Type: EOscType.SIN
//             },
//             vcf: {
//                 type: "lowpass" as unknown as BiquadFilterType,
//                 Q: 0,
//                 frequency: 5512.5
//             },
//             filterAdsr: {
//                 a: 0,
//                 d: 0,
//                 s: 0,
//                 r: 0
//             },
//             lfo: {
//                 frequency: 50,
//                 lfoType: EOscType.SAWTOOTH,
//                 gain: 100
//             }
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 11,
//         name: 'SY4',
//         mute: false,
//         analogSynthParams: {
//             gainValue: 0.7,
//             vco: {
//                 vco2detune: 0,
//                 mix: 0,
//                 vco1Type: EOscType.SIN,
//                 vco2Type: EOscType.SIN
//             },
//             vcf: {
//                 type: "lowpass" as unknown as BiquadFilterType,
//                 Q: 0,
//                 frequency: 5512.5
//             },
//             filterAdsr: {
//                 a: 0,
//                 d: 0,
//                 s: 0,
//                 r: 0
//             },
//             lfo: {
//                 frequency: 50,
//                 lfoType: EOscType.SAWTOOTH,
//                 gain: 100
//             }
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 12,
//         name: 'SY5',
//         mute: false,
//         analogSynthParams: {
//             gainValue: 0.7,
//             vco: {
//                 vco2detune: 0,
//                 mix: 0,
//                 vco1Type: EOscType.SIN,
//                 vco2Type: EOscType.SIN
//             },
//             vcf: {
//                 type: "lowpass" as unknown as BiquadFilterType,
//                 Q: 0,
//                 frequency: 5512.5
//             },
//             filterAdsr: {
//                 a: 0,
//                 d: 0,
//                 s: 0,
//                 r: 0
//             },
//             lfo: {
//                 frequency: 50,
//                 lfoType: EOscType.SAWTOOTH,
//                 gain: 100
//             }
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 13,
//         name: 'SY6',
//         mute: false,
//         analogSynthParams: {
//             gainValue: 0.7,
//             vco: {
//                 vco2detune: 0,
//                 mix: 0,
//                 vco1Type: EOscType.SIN,
//                 vco2Type: EOscType.SIN
//             },
//             vcf: {
//                 type: "lowpass" as unknown as BiquadFilterType,
//                 Q: 0,
//                 frequency: 5512.5
//             },
//             filterAdsr: {
//                 a: 0,
//                 d: 0,
//                 s: 0,
//                 r: 0
//             },
//             lfo: {
//                 frequency: 50,
//                 lfoType: EOscType.SAWTOOTH,
//                 gain: 100
//             }
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 14,
//         name: 'SY7',
//         mute: false,
//         analogSynthParams: {
//             gainValue: 0.7,
//             vco: {
//                 vco2detune: 0,
//                 mix: 0,
//                 vco1Type: EOscType.SIN,
//                 vco2Type: EOscType.SIN
//             },
//             vcf: {
//                 type: "lowpass" as unknown as BiquadFilterType,
//                 Q: 0,
//                 frequency: 5512.5
//             },
//             filterAdsr: {
//                 a: 0,
//                 d: 0,
//                 s: 0,
//                 r: 0
//             },
//             lfo: {
//                 frequency: 50,
//                 lfoType: EOscType.SAWTOOTH,
//                 gain: 100
//             }
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     },
//     {
//         id: 15,
//         name: 'SY8',
//         mute: false,
//         analogSynthParams: {
//             gainValue: 0.7,
//             vco: {
//                 vco2detune: 0,
//                 mix: 0,
//                 vco1Type: EOscType.SIN,
//                 vco2Type: EOscType.SIN
//             },
//             vcf: {
//                 type: "lowpass" as unknown as BiquadFilterType,
//                 Q: 0,
//                 frequency: 5512.5
//             },
//             filterAdsr: {
//                 a: 0,
//                 d: 0,
//                 s: 0,
//                 r: 0
//             },
//             lfo: {
//                 frequency: 50,
//                 lfoType: EOscType.SAWTOOTH,
//                 gain: 100
//             }
//         },
//         bar: [
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//             { notes: [] as any[] },
//         ]
//     }
// ]