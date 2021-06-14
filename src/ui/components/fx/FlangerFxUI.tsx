import { h, Component } from "preact";
import KnobUI from "../utils/KnobUI";
import { flanger } from "../../../models/IFx";
import GrooveBox from "../../../audio/GrooveBox";

// Types for props
type ExpandableProps = {
    flanger: flanger,
    func: any
    grooveBox: GrooveBox
};

// Types for state
type ExpandableState = {
};

export default class FlangerFxUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setDelayTime = this.setDelayTime.bind(this);
        this.setFeedback = this.setFeedback.bind(this);
        this.setLfo = this.setLfo.bind(this);
        this.setMix = this.setMix.bind(this);
    }

    setDelayTime (value: number)
    {
        const { flanger } = this.props;
        flanger.delayTime = value / 127 / 1000;
        this.props.func(flanger);
    }

    setFeedback (value: number)
    {
        const { flanger } = this.props;
        flanger.feedback = value / 127;
        this.props.func(flanger);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'FLANGER FDB:', value: (flanger.feedback).toFixed(2) } });
    }

    setLfo (value: number)
    {
        const { flanger } = this.props;
        flanger.oscfreq = value / 127;
        this.props.func(flanger);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'FLANGER SPD:', value: (flanger.oscfreq * 10).toFixed(2) + ' Hz' } });
    }

    setOn ()
    {
        const { flanger } = this.props;

        flanger.on = !flanger.on;

        this.props.func(flanger);
    }

    setMix (value: number)
    {
        const { flanger } = this.props;
        flanger.wetdry = value / 127;
        this.props.func(flanger);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'FLANGER DPH:', value: (flanger.wetdry).toFixed(2) } });
    }

    render ()
    {
        const { flanger } = this.props;
        const { feedback, on, oscfreq, wetdry } = flanger;

        return (
            <fieldset style={VcfStyle}>
                <legend>Flanger</legend>

                <button style={on ? btnActiveStyle : btnStyle} name="type" onClick={() => this.setOn()}>{on ? 'ON' : 'OFF'}</button>

                <KnobUI name='depth' value={wetdry * 127} func={this.setMix} />

                <KnobUI name='speed' value={oscfreq * 127} func={this.setLfo} />

                {/* <KnobUI name='time' value={delayTime * 127 * 1000} func={this.setDelayTime} /> */}

                <KnobUI name='feedback' value={feedback * 127} func={this.setFeedback} />

                
            </fieldset>
        );
    }
}

const VcfStyle = {
    position: 'absolute',
    top: 0,
    left: 160,
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
}

const btnActiveStyle = {
    width: '45',
    'background-color': 'var(--ATLANTIS)',
    border: '2px solid var(--OCEAN_GREEN)',
    'border-radius': '6px',
}

