import { h, Component, render } from "preact";
import { IAdsr } from "../../../models/IAdsr";
import { IAnalogSynthParams } from "../../../models/IAnalogSynthParams";
import { EOscType } from "../../../constant/EOscType";
import KnobUI from "../utils/KnobUI";
import { IVco } from "../../../models/IVco";

// Types for props
type ExpandableProps = {
    disabled: boolean;
    vco: IVco
    func: any;
};

// Types for state
type ExpandableState = {};

export default class VcoUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setFrequency = this.setFrequency.bind(this);
        this.setVco1Gain = this.setVco1Gain.bind(this);
        this.setVco2Gain = this.setVco2Gain.bind(this);
    }
    setFrequency (value: number)
    {
        let { vco } = this.props;
        vco.vco2detune = (value - 63);
        this.props.func(vco);
    }

    setVco1Gain (value: number)
    {
        let { vco } = this.props;
        vco.vco1Gain = value / 127;
        this.props.func(vco);
    }

    setVco2Gain (value: number)
    {
        let { vco } = this.props;
        vco.vco2Gain = value / 127;
        this.props.func(vco);
    }

    setVco1Type ()
    {
        let { vco } = this.props;
        const checkType = vco.vco1Type as unknown as string;

        switch (checkType)
        {
            case EOscType.SIN:
                vco.vco1Type = EOscType.SAWTOOTH;
                break;
            case EOscType.SAWTOOTH:
                vco.vco1Type = EOscType.TRIANGLE;
                break;
            case EOscType.TRIANGLE:
                vco.vco1Type = EOscType.SQUARE;
                break;
            case EOscType.SQUARE:
                vco.vco1Type = EOscType.SIN;
                break;
            default:
                break;
        }

        this.props.func(vco);
    }

    setVco2Type ()
    {
        let { vco } = this.props;
        const checkType = vco.vco2Type as unknown as string;

        switch (checkType)
        {
            case EOscType.SIN:
                vco.vco2Type = EOscType.SAWTOOTH;
                break;
            case EOscType.SAWTOOTH:
                vco.vco2Type = EOscType.TRIANGLE;
                break;
            case EOscType.TRIANGLE:
                vco.vco2Type = EOscType.SQUARE;
                break;
            case EOscType.SQUARE:
                vco.vco2Type = EOscType.SIN;
                break;
            default:
                break;
        }

        this.props.func(vco);
    }



    render ()
    {
        const { vco2detune, vco1Gain, vco2Gain, vco1Type, vco2Type } = this.props.vco;

        const freq = (vco2detune + 63);
        // console.log(freq)

        return (
            <div style="text-align: center">

                <fieldset style={OscStyle}>
                    <legend style={'user-select: none'}>Vco 1</legend>

                    <label style={'user-select: none'} for="type">Vco1 Type</label>
                    <div>
                        <button disabled={this.props.disabled} style={btnStyle} name="type" value={vco1Type} onClick={() => this.setVco1Type()}>{vco1Type}</button>
                    </div>

                        <KnobUI name='Level' disabled={this.props.disabled} value={vco1Gain * 127} func={this.setVco1Gain} />

                </fieldset>

                <fieldset style={Osc2Style}>
                    <legend style={'user-select: none'}>Vco 2</legend>

                    <label style={'user-select: none'} for="type">Vco2 Type</label>
                    <div>
                        <button disabled={this.props.disabled} style={btnStyle} name="type" value={vco2Type} onClick={() => this.setVco2Type()}>{vco2Type}</button>
                    </div>

                        <KnobUI name='Level' disabled={this.props.disabled} value={vco2Gain * 127} func={this.setVco2Gain} />

                        <KnobUI name='Vco2 Detune' disabled={this.props.disabled} value={freq} func={this.setFrequency} />
                </fieldset>
            </div>
        );
    }
}

const OscStyle = {
    position: 'relative',
    top: 0,
    'border-width': '1px 1px 0px 0px',
    'border-style': 'solid',
    'border-color': 'initial',
    width: '80px',
    height: 271,
    'margin-left': '0px'
}

const Osc2Style = {
    position: 'relative',
    top: -271,
    left: 80,
    'border-width': '1px 1px 0px 0px',
    'border-style': 'solid',
    'border-color': 'initial',
    width: '80px',
    height: 271,
    'margin-left': '0px'
}

const btnStyle = {
    width: '70',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '2px solid var(--MALIBU)',
    'border-radius': '6px',
}

const mixStyle = {
    position: 'absolute',
    top: 130,
    left: 0,
    width: '80px',
    height: '80px',
}

const detuneStyle = {
    position: 'absolute',
    top: 62,
    left: 0,
    width: '80px',
    height: '80px',
}