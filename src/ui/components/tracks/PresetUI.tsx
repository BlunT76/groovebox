import localforage = require("localforage");
import { h, Component, render, Fragment } from "preact";
import GrooveBox from "../../../audio/GrooveBox";
import Track from "../../../data/Track";
import { IPreset } from "../../../models/IPreset";
import { SampleSelector } from "../drums/SampleSelector";
import KnobUI from "../utils/KnobUI";



// Types for props
type ExpandableProps = {
    track: Track;
    grooveBox: GrooveBox;
    func: Function;
    showName: Function
};

// Types for state
type ExpandableState = {
    selectedInstrument: number;
    isReset: boolean;
    importSample: boolean;
    sampleCount: number;
    currentSampleCounter: number;
};

export default class PresetUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.selectInstrument = this.selectInstrument.bind(this);
        this.savePreset = this.savePreset.bind(this);
        this.getSynth = this.getSynth.bind(this);
        this.resetDisplay = this.resetDisplay.bind(this);
        this.importSample = this.importSample.bind(this);
        this.addDrumSample = this.addDrumSample.bind(this);
        this.nextSample = this.nextSample.bind(this);
        this.prevSample = this.prevSample.bind(this);

        this.state = {
            selectedInstrument: 0,
            isReset: true,
            importSample: false,
            sampleCount: 0,
            currentSampleCounter: 0
        }
    }

    componentDidMount ()
    {
        localforage.getItem(`sampleCount`).then(value =>
        {
            if (value === null)
            {
                localforage.setItem(`sampleCount`, 0);
                this.setState({ sampleCount: 8 });
            }
            else
            {
                this.setState({ sampleCount: value as number })
            }
        });
    }

    selectInstrument (id: number)
    {
        if (this.props.track.id < 8)
        {
            this.selectDrum(id)
        }
        else
        {
            this.selectSynth(id);
        }

        this.setState({ selectedInstrument: id });
    }

    selectSynth (id: number)
    {
        localforage.getItem(`synths${id}`).then(value =>
        {
            const preset = value as IPreset;

            this.props.showName(preset.name, id);

        }).catch(err =>
        {
            this.props.showName('no preset', id);
        });
    }

    selectDrum (id: number)
    {
        localforage.getItem(`drums${id}`).then(value =>
        {
            const preset = value as IPreset;

            this.props.showName(preset.name, id);

        }).catch(err =>
        {
            this.props.showName('no preset', id);
        });
    }

    savePreset ()
    {
        if (this.props.track.id < 8)
        {
            this.saveDrum();
        }
        else
        {
            this.saveSynth();
        }
    }

    saveDrum ()
    {
        const { level, fx, drumParams, vcf, env } = this.props.track;

        const newDrumPreset = {
            level,
            vcf,
            env,
            drumParams,
            fx,
        }

        const position = this.state.selectedInstrument;

        const presetName = prompt("Enter the preset name : ", "preset name here");

        const preset = {
            name: presetName,
            param: newDrumPreset
        } as IPreset;

        localforage.setItem(`drums${position}`, { name: presetName, param: newDrumPreset });
    }

    saveSynth ()
    {
        const { level, fx, analogSynthParams, vcf, env } = this.props.track;

        const newSynthPreset = {
            level,
            vcf,
            env,
            analogSynthParams,
            fx,
        }

        const position = this.state.selectedInstrument;

        const presetName = prompt("Enter the preset name : ", "preset name here");

        const preset = {
            name: presetName,
            param: newSynthPreset
        } as IPreset;

        localforage.setItem(`synths${position}`, { name: presetName, param: newSynthPreset });
    }

    addDrumSample (sample: any, name: string)
    {
        let { sampleCount, importSample } = this.state;

        localforage.setItem(`sample${sampleCount || 0}`, { name: name, b64: sample.replace(/^data:(.*,)?/, '') }).then(() => //.replace(/^data:(.*,)?/, '')
        {
            this.setState({ importSample: !importSample });

            this.incrementSampleCount(sampleCount + 1);
        });
    }

    incrementSampleCount (sampleCount: number)
    {
        this.setState({ sampleCount: sampleCount }, () =>
        {
            localforage.setItem(`sampleCount`, this.state.sampleCount);
        });
    }

    getSynth ()
    {
        const position = this.state.selectedInstrument;

        localforage.getItem(`synths${position}`).then(value =>
        {
            const preset = value as IPreset;

            this.props.func(preset.param);

        });
    }

    resetDisplay ()
    {
        if (!this.state.isReset)
        {
            return;
        }

        this.setState({ isReset: false }, () =>
        {
            let timeOut = setTimeout(() =>
            {
                this.props.showName('reset', -1);

                this.setState({ isReset: false });

                timeOut = null;

            }, 4000)
        });
    }

    importSample ()
    {
        const { importSample } = this.state;
        this.setState({ importSample: !importSample })
    }

    prevSample ()
    {
        const { grooveBox, track } = this.props;
        let { currentSampleCounter } = this.state;

        currentSampleCounter -= 1;


        localforage.getItem(`sample${currentSampleCounter}`).then((sample: any) =>
        {
            const arrayBuffer = grooveBox.base64ToArrayBuffer(sample.b64);

            const name = sample.name.split('.')[0];

            this.props.showName(name, currentSampleCounter, 'SAMPLE');

            grooveBox.audioCtx.decodeAudioData(arrayBuffer, (buffer) =>
            {
                grooveBox.drumKit[track.id] = buffer;
                grooveBox.getSong().drumKitNames[track.id] = `sample${currentSampleCounter}`;

                this.setState({ currentSampleCounter: currentSampleCounter });
            })
        }).catch(err =>
        {
            this.props.showName('no preset', currentSampleCounter, 'SAMPLE');
        });

    }

    nextSample ()
    {
        const { grooveBox, track } = this.props;
        let { currentSampleCounter } = this.state;

        currentSampleCounter += 1;

        localforage.getItem(`sample${currentSampleCounter}`).then((sample: any) =>
        {
            const arrayBuffer = grooveBox.base64ToArrayBuffer(sample.b64);

            const name = sample.name.split('.')[0];

            this.props.showName(name, currentSampleCounter, 'SAMPLE');

            grooveBox.audioCtx.decodeAudioData(arrayBuffer, (buffer) =>
            {
                grooveBox.drumKit[track.id] = buffer;
                grooveBox.getSong().drumKitNames[track.id] = `sample${currentSampleCounter}`;

                this.setState({ currentSampleCounter: currentSampleCounter });
            })
        }).catch(err =>
        {
            this.props.showName('no preset', currentSampleCounter, 'SAMPLE');
        });
    }


    render ()
    {
        const { selectedInstrument, importSample } = this.state;
        const { track } = this.props;

        return (
            <fieldset style={DrumParamsStyleBox}>
                <legend>PRESET</legend>

                <div style={toneStyle}>

                    <KnobUI onControlFinished={this.resetDisplay} name='instrument' coerceToInt={true} value={selectedInstrument} func={this.selectInstrument} />

                    <button style={btnStyle} name="type" value='0' onClick={this.savePreset}>Save</button>

                    <button style={btnStyle} name="type" value='0' onClick={this.getSynth}>Load</button>

                    <button disabled={track.id > 7} style={btnStyle} name="type" value='0' onClick={this.importSample}>Import</button>

                    {importSample && <SampleSelector func={this.addDrumSample} />}

                    <button disabled={track.id > 7} style={btnArrowStyle} name="type" value='0' onClick={this.prevSample}>⇦</button>
                    <button disabled={track.id > 7} style={btnArrowStyle} name="type" value='0' onClick={this.nextSample}>⇨</button>
                </div>

            </fieldset>
        );
    }
}

const DrumParamsStyleBox = {
    position: 'fixed',
    top: 239,
    left: 11,
    border: '3px solid var(--HOT_CINNAMON)',
    'border-radius': '6px',
    width: '86px',
    height: '199px',
}

const toneStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80px',
    height: '80px',
}

const btnStyle = {
    width: '70',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '2px solid var(--MALIBU)',
    'border-radius': '6px',
}

const btnArrowStyle = {
    width: '33',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '2px solid var(--MALIBU)',
    'border-radius': '6px',
    'font-size': '18px',
    padding: 0
}

const divBtnStyle = {
    position: 'absolute',
    top: -18,
    left: 0,
    width: '80px',
    height: '160px',
}