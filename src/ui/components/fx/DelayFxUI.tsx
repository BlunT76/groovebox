import { h, Component } from "preact";
import KnobUI from "../utils/KnobUI";
import { delay } from "../../../models/IFx";
import GrooveBox from "../../../audio/GrooveBox";

// Types for props
type ExpandableProps = {
    delay: delay,
    func: any,
    grooveBox: GrooveBox
};

// Types for state
type ExpandableState = {

};

export default class DelayFxUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setDelayTime = this.setDelayTime.bind(this);
        this.setFeedback = this.setFeedback.bind(this);
        this.setMix = this.setMix.bind(this);
    }

    setDelayTime (value: number)
    {
        const { delay } = this.props;
        delay.delayTime = value / 127;
        this.props.func(delay);
        
        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'DELAY TIME:', value: (delay.delayTime * 1000).toFixed(2) + ' ms' } });
    }

    setFeedback (value: number)
    {
        const { delay } = this.props;
        delay.feedback = value / 127;
        this.props.func(delay);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'DELAY FDBK:', value: (delay.feedback).toFixed(2) } });
    }

    setOn ()
    {
        const { delay } = this.props;

        delay.on = !delay.on;

        

        this.props.func(delay);
    }

    setMix (value: number)
    {
        const { delay } = this.props;
        delay.wetdry = value / 127;
        this.props.func(delay);

        this.props.grooveBox.sendEvent({ 'lcdLine4': { key: 'DELAY WET:', value: (delay.wetdry).toFixed(2) } });
    }

    render ()
    {
        const { delay } = this.props;
        const { delayTime, feedback, on, wetdry } = delay;

        return (
            <fieldset style={VcfStyle}>
                <legend>Delay</legend>

                <button style={on ? btnActiveStyle : btnStyle} name="type" onClick={() => this.setOn()}>{on ? 'ON' : 'OFF'}</button>

                <KnobUI name='wet' value={wetdry * 127} func={this.setMix} />

                <KnobUI name='time' value={delayTime * 127} func={this.setDelayTime} />

                <KnobUI name='feedback' value={feedback * 127} func={this.setFeedback} />

            </fieldset>
        );
    }
}

const VcfStyle = {
    position: 'absolute',
    top: 0,
    left: 240,
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

