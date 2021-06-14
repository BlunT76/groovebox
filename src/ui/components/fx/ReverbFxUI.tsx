import { h, Component, render } from "preact";
import KnobUI from "../utils/KnobUI";
import { reverb } from "../../../models/IFx";
import GrooveBox from "../../../audio/GrooveBox";

// Types for props
type ExpandableProps = {
    reverb: reverb,
    func: any
    grooveBox: GrooveBox
};

// Types for state
type ExpandableState = {

};

export default class ReverbFxUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setRoomSize = this.setRoomSize.bind(this);
        this.setDampening = this.setDampening.bind(this);
        this.setDryWet = this.setDryWet.bind(this);
    }

    setRoomSize (value: number)
    {
        const { reverb } = this.props;
        reverb.roomSize = value / 127;
        this.props.func(reverb);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'REVERB SIZE:', value: (reverb.roomSize ).toFixed(2) } });
    }

    setDampening (value: number)
    {
        const { reverb } = this.props;
        reverb.dampening = value / 127 * 1000;
        this.props.func(reverb);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'REVERB DAMP:', value: (reverb.dampening ).toFixed(2) } });
    }

    setOn ()
    {
        const { reverb } = this.props;

        reverb.on = !reverb.on;

        this.props.func(reverb);
    }

    setDryWet (value: number)
    {
        const { reverb } = this.props;

        reverb.wet = 1 - value / 127;
        reverb.dry = value / 127;

        this.props.func(reverb);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'REVERB WET:', value: (reverb.dry).toFixed(2) } });
    }

    render ()
    {
        const { reverb } = this.props;
        const { roomSize, dampening, on, dry } = reverb;

        return (
            <fieldset style={VcfStyle}>
                <legend>Reverb</legend>

                <button style={on ? btnActiveStyle : btnStyle} name="type" onClick={() => this.setOn()}>{on ? 'ON' : 'OFF'}</button>

                <KnobUI name='wet/dry' value={dry * 127} func={this.setDryWet} />

                <KnobUI name='size' value={roomSize * 127} func={this.setRoomSize} />

                <KnobUI name='damp' value={dampening * 127 / 1000} func={this.setDampening} />

            </fieldset>
        );
    }
}

const VcfStyle = {
    position: 'absolute',
    top: 0,
    left: 320,
    'border-width': '1px 1px 0px 0px',
    'border-style': 'solid',
    'border-color': 'initial',
    width: '76px',
    height: 269,
    margin: 0
}

const btnStyle = {
    width: '45',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '2px solid var(--GULL_GRAY)',
    'border-radius': '6px',
}

const btnActiveStyle = {
    width: '45',
    'background-color': 'var(--ATLANTIS)',
    border: '2px solid var(--OCEAN_GREEN)',
    'border-radius': '6px',
}

