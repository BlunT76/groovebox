import { h, Component } from "preact";
import KnobUI from "../utils/KnobUI";

// Types for props
type ExpandableProps = {
    disabled: boolean;
    whiteNoiseGain: number;
    setWhiteNoiseGain: any;
};

// Types for state
type ExpandableState = {

};

export default class NoiseUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setLevel = this.setLevel.bind(this);
    }

    setLevel (value: number)
    {
        this.props.setWhiteNoiseGain(value);
    }

    render ()
    {
        const { whiteNoiseGain } = this.props;

        return (

            <div style="text-align: center">

                <fieldset style={LfoStyle}>
                    <legend>Noise</legend>

                    <KnobUI name='Level' disabled={this.props.disabled} value={whiteNoiseGain * 127 * 10} func={this.setLevel} />

                </fieldset>
            </div>
        );
    }
}

const LfoStyle = {
    position: 'absolute',
    top: 180,
    left: 0,
    'border-width': '1px 1px 0px 0px',
    'border-style': 'solid',
    'border-color': 'initial',
    width: '80px',
    height: '80px',
    margin: 0
}
