import { h, Component } from "preact";
import KnobUI from "../utils/KnobUI";
import { distortion } from "../../../models/IFx";
import GrooveBox from "../../../audio/GrooveBox";

// Types for props
type ExpandableProps = {
    distortion: distortion
    func: Function
    grooveBox: GrooveBox
};

// Types for state
type ExpandableState = {

};

export default class DistortionFxUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setAmount = this.setAmount.bind(this);
    }

    setAmount (value: number)
    {
        const { distortion } = this.props;

        distortion.amount = value / 127;

        this.props.func(distortion);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'DISTORTION:', value: (distortion.amount).toFixed(2) } });
    }

    setOn ()
    {
        const { distortion } = this.props;

        distortion.on = !distortion.on;

        this.props.func(distortion);
    }

    render ()
    {
        const { amount, on } = this.props.distortion;

        return (
            <fieldset style={VcfStyle}>
                <legend>Dist</legend>

                <button style={on ? btnActiveStyle : btnStyle} name="type" onClick={() => this.setOn()}>{on ? 'ON' : 'OFF'}</button>

                <KnobUI name='amount' value={amount * 127} func={this.setAmount} />

            </fieldset>
        );
    }
}

const VcfStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
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

