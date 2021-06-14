import { h, Component, render, Fragment } from "preact";
import GrooveBox from "../../../audio/GrooveBox";
import Track from "../../../data/Track";
import { IDrumParams } from "../../../models/IDrumParams";
import KnobUI from "../utils/KnobUI";


// Types for props
type ExpandableProps = {
    grooveBox: GrooveBox;
    currentTrackId: number;
    track: Track;
    func: any;
};

// Types for state
type ExpandableState = {
    delayID: any,
    drumParams: IDrumParams;
};

export default class DrumUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.getTone = this.getTone.bind(this);
    }

    getTone (value: any)
    {
        let { drumParams } = this.props.track;
        drumParams.tone = (value - 63) * 10;
        this.props.func(drumParams);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'DRUM TONE:', value: (drumParams.tone).toFixed(2) } });
    }

    render ()
    {
        const { track } = this.props;
        const { tone } = track.drumParams || track.getDefaultDrumParams();
        const { currentTrackId } = this.props;

        return (
            <fieldset style={DrumParamsStyleBox}>
                <legend>DRUM</legend>

                    <div style={toneStyle}>
                        <KnobUI name='tone' disabled={currentTrackId > 7} value={tone / 10 + 63} func={this.getTone} />
                    </div>

            </fieldset>
        );
    }
}

const DrumParamsStyleBox = {
    position: 'fixed',
    top: 150,
    left: 11,
    border: '3px solid var(--HOT_CINNAMON)',
    'border-radius': '6px',
    width: '86px',
    height: '86px',
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

const divBtnStyle = {
    position: 'absolute',
    top: -18,
    left: 0,
    width: '80px',
    height: '160px',
}