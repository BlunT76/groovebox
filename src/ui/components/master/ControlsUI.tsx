import { h, Component, render } from "preact";
import Pattern from "../../../data/Pattern";

// Types for props
type ExpandableProps = {
    selectingPattern: boolean;
    selectingTrack: boolean;
    selectingBar: boolean;
    shiftOn: boolean;
    muteTrackMode: boolean;
    copyOn: boolean;
    func: any;
};

// Types for state
type ExpandableState = {};

export default class ControlsUI extends Component<ExpandableProps, ExpandableState>
{
    render ()
    {
        const { selectingPattern, selectingTrack, selectingBar, shiftOn, func, muteTrackMode, copyOn } = this.props;

        return (
            <div style={ControlsStyleBox}>

                <button className={muteTrackMode ? "btnActive" : "btnInactive"}
                    style={btnStyle}
                    name="type"
                    value={0}
                    onClick={() => { func('muteTrackMode') }}>
                    MUTE / <span style={shiftLabelStyle} >SOLO</span>
                </button>

                <button className={selectingPattern ? "btnActive" : "btnInactive"}
                    style={btnStyle}
                    name="type"
                    value={0}
                    onClick={() => { func('selectingPattern') }}
                >
                    PATTERN
                </button>

                <button className={selectingTrack ? "btnActive" : "btnInactive"}
                    style={btnStyle}
                    name="type"
                    value={0}
                    onClick={() => { func('selectingTrack') }}>
                    TRACK
                </button>

                <button className={selectingBar ? "btnActive" : "btnInactive"}
                    style={btnStyle}
                    name="type"
                    value={0}
                    onClick={() => { func('selectingBar') }}>
                    BAR / <span style={shiftLabelStyle} >LOOP</span>
                </button>

                <button className={copyOn ? "btnActive" : "btnInactive"}
                    style={btnStyle}
                    name="type"
                    value={0}
                    onClick={() => { func('copyOn') }}>
                    COPY
                </button>

                <button className={shiftOn ? "btnShiftActive" : "btnShiftInactive"}
                    style={btnShiftStyle}
                    name="type"
                    onClick={() => { func('shiftOn') }}>
                    SHIFT
                </button>
            </div>
        );
    }
}

// const shiftLabelStyle = {
//     color: 'var(--HOT_CINNAMON)'
// }

const ControlsStyleBox = {
    position: 'fixed',
    top: 445,
    left: 260,
    width: '756px',
    height: '16px',
    'padding': '0px !important'
}

const btnStyle = {
    width: '118px',
    height: '48px',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '3px solid var(--MALIBU)',
    'border-radius': '6px',
    'margin': '4px'
}

const btnShiftStyle = {
    width: '118px',
    height: '48px',
    'background-color': 'var(--HOT_CINNAMON) !important',
    border: '3px solid var(--HOT_CINNAMON)',
    'border-radius': '6px',
    'margin': '4px'
}

const shiftLabelStyle = {
    'margin-top': '61px',
    width: 'fit-content',
    padding: '2px',
    'border-radius': '4px',
    color: 'var(--STEEL_GRAY)',
    'background-color': 'var(--HOT_CINNAMON)',
    'user-select': 'none'
}
