import { h, Component, render } from "preact";
import DelayFX from "../../../audio/fx/DelayFX";
import GrooveBox from "../../../audio/GrooveBox";
import { EOutput } from "../../../constant/EOutput";
import Track from "../../../data/Track";
import { IAdsr } from "../../../models/IAdsr";
import { IVcf } from "../../../models/IVcf";
import KnobUI from "../utils/KnobUI";
import EnvUI from "./EnvUI";
import VcfUI from "./VcfUI";

// Types for props
type ExpandableProps = {
    grooveBox: GrooveBox;
    track: Track;
    func: Function;
};

// Types for state
type ExpandableState = {};

export default class TrackUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setEnv = this.setEnv.bind(this);
        this.setVcf = this.setVcf.bind(this);
        this.setLevel = this.setLevel.bind(this);
        this.setPan = this.setPan.bind(this);
    }

    setLevel (gainValue: number)
    {
        const { track } = this.props;

        track.level = gainValue / 127;

        this.props.func(track);
    }

    setPan (value: number)
    {
        const { track, grooveBox } = this.props;

        track.pan = (value - 63) / 127;

        this.props.func(track);

        if (track.id < 8)
        {
            grooveBox.drumTracks[track.id].setPan();
        }
        if (track.id > 7)
        {
            grooveBox.synthTracks[track.id - 8].setPan();
        }
    }

    setEnv (adsr: IAdsr)
    {
        const { track } = this.props;

        track.env = adsr;

        this.props.func(track);
    }

    setVcf (filter: IVcf)
    {
        const { track, grooveBox } = this.props;

        track.vcf = filter;

        this.props.func(track);

        if (track.id < 8)
        {
            grooveBox.drumTracks[track.id].setVcf();
        }
        if (track.id > 7)
        {
            grooveBox.synthTracks[track.id - 8].setVcf();
        }
    }

    render ()
    {
        if (isNaN(this.props.track.pan))
        {
            this.props.track.pan = 0
        }

        const { level, vcf, env, pan } = this.props.track;



        return (
            <fieldset style={TrackStyleBox}>
                <legend>TRACK</legend>
                <VcfUI filter={vcf} func={this.setVcf} />

                <EnvUI disabled={this.props.track.id < 8} adsr={env} func={this.setEnv} />

                <fieldset style={vcaStyle}>
                    <legend>Vca</legend>

                    <KnobUI name='Pan' value={(pan * 127) + 63} func={this.setPan} />

                    <KnobUI name='Gain' value={level * 127} func={this.setLevel} />

                </fieldset>

            </fieldset>
        );
    }
}

const TrackStyleBox = {
    position: 'fixed',
    top: 150,
    left: 381,
    border: '3px solid var(--HOT_CINNAMON)',
    'border-radius': '6px',
    width: '210px',
    height: '288',
    'padding-right': '3px'
}

const levelStyle = {
    position: 'absolute',
    top: 0,
    left: 80,
    width: '80px',
    height: '80px',
}

const fxStyle = {
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

const vcaStyle = {
    position: 'absolute',
    top: 178,
    left: 81,
    width: '123px',
    height: '78px',
    'border-width': '1px 0px 0px 0px',
    'border-style': 'solid',
    'border-color': 'initial',
    display: 'flex'
}