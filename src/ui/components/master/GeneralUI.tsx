import { h } from "preact";
import { PureComponent } from 'preact/compat';
import GrooveBox from "../../../audio/GrooveBox";
import Midi from "../../../inputs/Midi";
import VumeterUI from "./VuMeter";

type ExpandableProps = {
    grooveBox: GrooveBox;
    func?: any;
    midiInputs?: string[];
    midi?: Midi;
};

// Types for state
type ExpandableState = {
    active: boolean;
};

export default class GeneralUI extends PureComponent<ExpandableProps, ExpandableState>
{

    constructor ()
    {
        super();
        this.state = {
            active: false
        };

        this.setMidiLearn = this.setMidiLearn.bind(this);
    }

    turnGrooveBoxOn ()
    {
        if (this.state.active)
        {
            return;
        }

        const gb = this.props.grooveBox;

        const checkinit = gb.init();

        this.setState({ active: checkinit }, () =>
        {
            this.props.func();
        });
    }

    selectInput (elm: h.JSX.TargetedEvent<HTMLSelectElement, MouseEvent>)
    {
        console.log(elm.currentTarget.value)
        this.props.midi.setMidiInput(elm.currentTarget.value);
    }

    setMidiLearn ()
    {
        const { isLearning } = this.props.grooveBox.ccHandler;

        this.props.grooveBox.ccHandler.setMidiLearn(!isLearning)
    }

    render ()
    {
        if (!this.props.func)
        {
            return (
                <div style={generalStyle}>
                    <div style={powerIconStyle}>
                        <svg
                            style='margin-left: 6px'
                            fill='#cbdbfc'
                            width="32"
                            viewBox="0 0 512 512"
                            height="32"
                            enableBackground="new 0 0 512 512"
                        >
                            <g>
                                <path
                                    id="path2"
                                    d="m 436.862,75.238 c -100.3,-100.301 -261.29,-100.335 -361.624,0 -100.301,100.3 -100.335,261.29 0,361.624 100.3,100.301 261.29,100.335 361.624,0 100.301,-100.299 100.335,-261.29 0,-361.624 z M 256.05,482.05 c -124.617,0 -226,-101.383 -226,-226 0,-124.617 101.383,-226 226,-226 124.617,0 226,101.383 226,226 0,124.617 -101.383,226 -226,226 z" />
                                <path
                                    id="path4"
                                    d="m 329.703,173.005 c -6.197,-5.499 -15.677,-4.934 -21.176,1.263 -5.499,6.196 -4.934,15.677 1.263,21.176 17.324,15.375 27.26,37.465 27.26,60.607 0,44.664 -36.336,81 -81,81 -44.664,0 -81,-36.336 -81,-81 0,-23.371 10.101,-45.606 27.712,-61.005 6.236,-5.453 6.872,-14.929 1.418,-21.166 -5.453,-6.237 -14.929,-6.871 -21.166,-1.418 -24.127,21.096 -37.965,51.563 -37.965,83.589 0,61.206 49.794,111 111,111 61.206,0 111,-49.794 111,-111 0.001,-31.714 -13.611,-61.982 -37.346,-83.046 z" />
                                <path
                                    id="path6"
                                    d="m 256.05,231.05 c 8.284,0 15,-6.716 15,-15 v -80 c 0,-8.284 -6.716,-15 -15,-15 -8.284,0 -15,6.716 -15,15 v 80 c 0,8.285 6.716,15 15,15 z" />
                            </g>
                        </svg >
                    </div>

                    <select style={midiSelectStyle} onClick={(e) => this.selectInput(e)}>
                        {this.props.midiInputs?.map(elm => <option value={elm}>{elm}</option>)}
                    </select>

                    {/* <button style={btnStyle} name="type" value='0' onClick={this.setMidiLearn}>Midi Learn</button> */}

                    {/* <div style={meterStyle}>
                    <VumeterUI grooveBox={this.props.grooveBox} />
                    </div> */}


                    <h1 style={titleStyle}>Imp GrooveBox</h1>

                </div >
            );
        }
        else
        {
            return (
                <div style={generalStyle}>
                    <div style={powerIconStyle}>
                        <svg
                            style='margin-left: 6px'
                            onClick={() => this.turnGrooveBoxOn()}
                            fill='#5fcde4'
                            width="32"
                            viewBox="0 0 512 512"
                            height="32"
                            enableBackground="new 0 0 512 512"
                        >
                            <g>
                                <path
                                    id="path2"
                                    d="m 436.862,75.238 c -100.3,-100.301 -261.29,-100.335 -361.624,0 -100.301,100.3 -100.335,261.29 0,361.624 100.3,100.301 261.29,100.335 361.624,0 100.301,-100.299 100.335,-261.29 0,-361.624 z M 256.05,482.05 c -124.617,0 -226,-101.383 -226,-226 0,-124.617 101.383,-226 226,-226 124.617,0 226,101.383 226,226 0,124.617 -101.383,226 -226,226 z" />
                                <path
                                    id="path4"
                                    d="m 329.703,173.005 c -6.197,-5.499 -15.677,-4.934 -21.176,1.263 -5.499,6.196 -4.934,15.677 1.263,21.176 17.324,15.375 27.26,37.465 27.26,60.607 0,44.664 -36.336,81 -81,81 -44.664,0 -81,-36.336 -81,-81 0,-23.371 10.101,-45.606 27.712,-61.005 6.236,-5.453 6.872,-14.929 1.418,-21.166 -5.453,-6.237 -14.929,-6.871 -21.166,-1.418 -24.127,21.096 -37.965,51.563 -37.965,83.589 0,61.206 49.794,111 111,111 61.206,0 111,-49.794 111,-111 0.001,-31.714 -13.611,-61.982 -37.346,-83.046 z" />
                                <path
                                    id="path6"
                                    d="m 256.05,231.05 c 8.284,0 15,-6.716 15,-15 v -80 c 0,-8.284 -6.716,-15 -15,-15 -8.284,0 -15,6.716 -15,15 v 80 c 0,8.285 6.716,15 15,15 z" />
                            </g>
                        </svg >
                    </div>

                    <h1 style={titleStyle}>Imp GrooveBox</h1>
                </div >
            );
        }
    }
}

const generalStyle = {
    position: 'relative',
    top: -1,
    left: -1,
    'background-color': 'var(--HOT_CINNAMON)',
    height: '35px',
    'border-top-left-radius': '6px',
    'border-top-right-radius': '6px',
    width: 1022
}

const titleStyle = {
    margin: '-35px 9px -6px -6px',
    color: 'var(--LIVID_BROWN)',
    float: 'right',
}

const powerIconStyle = {
    width: '32px',
    height: '32px',
    'border-radius': '50%',
    'margin-bottom': '1px'
}

const midiSelectStyle = {
    position: 'absolute',
    top: '8px',
    left: '54px', // '140px',
    height: '21',
    'background-color': 'var(--HAWKES_BLUE)',
    'border': '2px solid var(--MALIBU)',
    'border-radius': '6px'
}

const meterStyle = {
    position: 'absolute',
    top: '-13px',
    left: '512px',
}

const btnStyle = {
    position: 'absolute',
    top: '6px',
    left: '54px',
    width: '80',
    height: '21',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '2px solid var(--MALIBU)',
    'border-radius': '6px',
}
