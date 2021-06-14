import { h, Component, render } from "preact";
import GrooveBox from "../../../audio/GrooveBox";
import { EMode } from "../../../constant/EMode";

type ExpandableProps = {
    grooveBox: GrooveBox;
    bpm: number;
    tick: number;
    setBpm: any;
    mode: EMode;
    setMode: any;
};

// Types for state
type ExpandableState = {
    label: string;
};

export default class TransportUI extends Component<ExpandableProps, ExpandableState>
{
    state = {
        label: 'PLAY'
    }
    play ()
    {
        this.props.grooveBox.playStopSequencer();

        if (this.props.grooveBox.isPlaying)
        {
            this.setState({ label: 'STOP' });
        }
        else
        {
            this.setState({ label: 'PLAY' });
        }
    }

    render ()
    {
        const { tick, mode } = this.props;

        return (
            <div style={TransportStyleBox}>

                    <button style={playBtnStyle}
                        className={tick % 4 === 1 ? "btnActive" : "btnInactive"}
                        type="button"
                        id="playBtn"
                        onClick={() => this.play()}
                    >
                        {this.state.label}
                    </button>

                    <button style={mode === EMode.LIVE ? modeLiveBtnStyle : modeStepBtnStyle}
                        type="button" id="playBtn"
                        onClick={() => this.props.setMode()}
                    >
                        {mode.toUpperCase()}
                    </button>

            </div>
        );
    }
}

const TransportStyleBox = {
    position: 'fixed',
    top: 445,
    left: 8,
    width: '384px',
    height: '16px',
    'border-radius': '6px 6px 0px 0px',
}

const playBtnStyle = {
    width: '118px',
    height: '48px',
    margin: '4px',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '3px solid var(--MALIBU)',
    'border-radius': '6px'
}

const modeStepBtnStyle = {
    width: '118px',
    height: '48px',
    margin: '4px',
    'background-color': 'var(--ROMAN)',
    border: '3px solid var(--WELL_READ)',
    'border-radius': '6px'
}

const modeLiveBtnStyle = {
    width: '118px',
    height: '48px',
    margin: '4px',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '3px solid var(--OCEAN_GREEN)',
    'border-radius': '6px'
}
