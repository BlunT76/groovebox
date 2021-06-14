import { h, Component } from "preact";
import VcoUI from "./VcoUI";
import LfoUI from "./LfoUI";
import { IVco } from "../../../models/IVco";
import { ILfo } from "../../../models/ILfo";
import Track from "../../../data/Track";
import GrooveBox from "../../../audio/GrooveBox";
import NoiseUI from "./NoiseUI";


// Types for props
type ExpandableProps = {
    grooveBox: GrooveBox;
    selectedTrackId: number;
    track: Track;
    func: any;
};

// Types for state
type ExpandableState = {
};

export default class SynthUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setLfo = this.setLfo.bind(this);
        this.setWhiteNoiseGain = this.setWhiteNoiseGain.bind(this);
    }

    setVco (vco: IVco)
    {
        const { track, grooveBox } = this.props;

        track.analogSynthParams.vco = vco;

        this.props.func(track);

        if (track.id > 7)
        {
            grooveBox.synthTracks[track.id - 8].setVco();
        }
    }

    setLfo (value: ILfo)
    {
        const { track, grooveBox } = this.props;

        track.analogSynthParams.lfo = value;

        this.props.func(track);

        if (track.id > 7)
        {
            grooveBox.synthTracks[track.id - 8].setLfo();
        }
    }

    setWhiteNoiseGain (value: number)
    {
        const { track, grooveBox } = this.props;

        track.analogSynthParams.whiteNoiseGain = value;

        this.props.func(track);

        if (track.id > 7)
        {
            grooveBox.synthTracks[track.id - 8].setNoise();
        }
    }

    render ()
    {
        const { track, selectedTrackId } = this.props;

        const { vco, lfo, whiteNoiseGain } = track.analogSynthParams || track.getDefaultAnalogSynthParams();

        return (
            <fieldset style={SynthParamsStyleBox}>
                <legend>SYNTH</legend>
                <div>
                    <VcoUI
                        disabled={selectedTrackId < 8}
                        vco={vco}
                        func={(vco: IVco) => this.setVco(vco)}
                    />
                    <NoiseUI
                        disabled={selectedTrackId < 8}
                        whiteNoiseGain={whiteNoiseGain}
                        setWhiteNoiseGain={this.setWhiteNoiseGain}
                    />
                    <LfoUI
                        disabled={selectedTrackId < 8}
                        lfo={lfo}
                        setLfo={this.setLfo}
                    />
                </div>
            </fieldset>
        );
    }
}

const SynthParamsStyleBox = {
    position: 'fixed',
    top: 150,
    left: 116,
    border: '3px solid var(--HOT_CINNAMON)',
    'border-radius': '6px',
    width: '246px',
    height: '288',
    'padding-right': '3px',
    display: 'flex'
}
