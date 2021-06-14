import { h, Component } from "preact";
import KnobUI from "../utils/KnobUI";
import { equalizer } from "../../../models/IFx";
import GrooveBox from "../../../audio/GrooveBox";

// Types for props
type ExpandableProps = {
    equalizer: equalizer
    func: Function
    grooveBox: GrooveBox
};

// Types for state
type ExpandableState = {

};

export default class EqualizerFxUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setHigh = this.setHigh.bind(this);
        this.setMid = this.setMid.bind(this);
        this.setLow = this.setLow.bind(this);
    }

    setHigh (value: number)
    {
        const { equalizer } = this.props;

        equalizer.highGain = (value - 63) / 127 * 15;

        this.props.func(equalizer);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'EQ HIGH:', value: (equalizer.highGain).toFixed(2) } });
    }

    setMid (value: number)
    {
        const { equalizer } = this.props;

        equalizer.midGain = (value - 63) / 127 * 6;

        this.props.func(equalizer);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'EQ MID:', value: (equalizer.midGain).toFixed(2) } });
    }

    setLow (value: number)
    {
        const { equalizer } = this.props;

        equalizer.lowGain = (value - 63) / 127 * 15;

        this.props.func(equalizer);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'EQ LOW:', value: (equalizer.lowGain).toFixed(2) } });
    }

    setOn ()
    {
        const { equalizer } = this.props;

        equalizer.on = !equalizer.on;

        this.props.func(equalizer);
    }

    render ()
    {
        const { highGain, midGain, lowGain, on } = this.props.equalizer;

        return (
            <fieldset style={EqStyle}>
                <legend>Eq</legend>

                <button style={on ? btnActiveStyle : btnStyle} name="type" onClick={() => this.setOn()}>{on ? 'ON' : 'OFF'}</button>

                <KnobUI name='high' value={63 + highGain * 127 / 15} func={this.setHigh} />
                <KnobUI name='mid' value={63 + midGain * 127 / 6} func={this.setMid} />
                <KnobUI name='low' value={63 + lowGain * 127 / 15} func={this.setLow} />

            </fieldset>
        );
    }
}

const EqStyle = {
    position: 'absolute',
    top: 0,
    left: 80,
    'border-width': '1px 1px 0px 0px',
    'border-style': 'solid',
    'border-color': 'initial',
    width: '80px',
    height: 270,
    margin: 0
}

const btnStyle = {
    width: '45',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '2px solid var(--GULL_GRAY)',
    'border-radius': '6px',
    'text-align': 'center'
}

const btnActiveStyle = {
    width: '45',
    'background-color': 'var(--ATLANTIS)',
    border: '2px solid var(--OCEAN_GREEN)',
    'border-radius': '6px',
    'text-align': 'center'
}

