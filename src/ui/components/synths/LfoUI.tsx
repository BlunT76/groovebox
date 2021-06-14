import { h, Component } from "preact";
import { EOscType } from "../../../constant/EOscType";
import KnobUI from "../utils/KnobUI";
import { ILfo } from "../../../models/ILfo";
import { ELfoSync } from "../../../constant/ELfoSync";
import { ELfoDest } from "../../../constant/ELfoDest";

// Types for props
type ExpandableProps = {
    disabled: boolean;
    lfo: ILfo;
    setLfo: any;
};

// Types for state
type ExpandableState = {

};

export default class LfoUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setFrequency = this.setFrequency.bind(this);
        this.setIntensity = this.setIntensity.bind(this);
    }

    setFrequency (value: number)
    {
        const { lfo } = this.props;

        lfo.frequency = value / 127 * 20;

        this.props.setLfo(lfo);
    }

    setIntensity (value: number)
    {
        const { lfo } = this.props;

        lfo.intensity = value / 127;

        this.props.setLfo(lfo);
    }

    setDest ()
    {
        const { lfo } = this.props;
        
        if (lfo.dest === ELfoDest.VCF)
        {
            lfo.dest = ELfoDest.VCO;
        }
        else
        {
            lfo.dest = ELfoDest.VCF;
        }

        this.props.setLfo(lfo);
    }

    setType ()
    {
        let { lfo } = this.props;
        const checkType = lfo.type as unknown as string;

        switch (checkType)
        {
            case EOscType.SIN:
                lfo.type = EOscType.SAWTOOTH;
                break;
            case EOscType.SAWTOOTH:
                lfo.type = EOscType.TRIANGLE;
                break;
            case EOscType.TRIANGLE:
                lfo.type = EOscType.SQUARE;
                break;
            case EOscType.SQUARE:
                lfo.type = EOscType.SIN;
                break;
            default:
                break;
        }

        this.props.setLfo(lfo);
    }

    setSync ()
    {
        let { lfo } = this.props;
        const checkType = lfo.sync;

        switch (checkType)
        {
            case ELfoSync["off"]:
                lfo.sync = ELfoSync["1/8"];
                break;
            case ELfoSync["1/8"]:
                lfo.sync = ELfoSync["1/4"];
                break;
            case ELfoSync["1/4"]:
                lfo.sync = ELfoSync["1/2"];
                break;
            case ELfoSync["1/2"]:
                lfo.sync = ELfoSync["1/1"];
                break;
            case ELfoSync["1/1"]:
                lfo.sync = ELfoSync["2/1"];
                break;
            case ELfoSync["2/1"]:
                lfo.sync = ELfoSync["4/1"];
                break;
            case ELfoSync["4/1"]:
                lfo.sync = ELfoSync["8/1"];
                break;
            case ELfoSync["8/1"]:
                lfo.sync = ELfoSync["16/1"];
                break;
            case ELfoSync["16/1"]:
                lfo.sync = ELfoSync["32/1"];
                break;
            case ELfoSync["32/1"]:
                lfo.sync = ELfoSync["off"];
                break;
            default:
                break;
        }

        this.props.setLfo(lfo);
    }

    render ()
    {
        const { frequency, type, intensity, sync, dest } = this.props.lfo;
        const freq = frequency * 127 / 20;
        const int = intensity * 127;

        return (
            <div style="text-align: center">

                <fieldset style={LfoStyle}>
                    <legend>Lfo</legend>

                    <label for="type">Type</label>
                    <button disabled={this.props.disabled} style={btnStyle} name="type" value={type} onClick={() => this.setType()}>{type}</button>

                    <label for="type">Sync</label>
                    <button disabled={this.props.disabled} style={btnStyle} name="type" value={sync} onClick={() => this.setSync()}>{sync}</button>

                    <KnobUI name='Rate' disabled={this.props.disabled} value={freq} func={this.setFrequency} />

                    <KnobUI name='Int' disabled={this.props.disabled} value={int} func={this.setIntensity} />

                    <button disabled={this.props.disabled} style={btnStyle} name="type" value={dest} onClick={() => this.setDest()}>⇨ {dest || 'vcf'}</button>
                </fieldset>
            </div>
        );
    }
}

const LfoStyle = {
    position: 'absolute',
    top: 0,
    left: 160,
    'border-width': '1px 0px 0px 0px',
    'border-style': 'solid',
    'border-color': 'initial',
    width: '80px',
    height: '270px',
    margin: 0
}

const btnStyle = {
    width: '70',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '2px solid var(--MALIBU)',
    'border-radius': '6px',
}
