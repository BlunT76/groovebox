import { h, Component, render } from "preact";
import { IVcf } from "../../../models/IVcf";
import { EOscType } from "../../../constant/EOscType";
import KnobUI from "../utils/KnobUI";

// Types for props
type ExpandableProps = {
    filter: IVcf,
    func: any
};

// Types for state
type ExpandableState = {

};

export default class VcfUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setFrequency = this.setFrequency.bind(this);
        this.setQ = this.setQ.bind(this);
    }

    setFrequency (value: number)
    {
        let { filter } = this.props;
        filter.frequency = value / 127 * value * 43.405512;
        this.props.func(filter);
    }

    setQ (value: number)
    {
        let { filter } = this.props;
        filter.Q = value / 127 * 10;
        this.props.func(filter);
    }

    setType ()
    {
        const { filter } = this.props;
        const { type } = filter;
        const checkType = type as unknown as string;

        switch (checkType)
        {
            case 'lowpass':
                filter.type = 'highpass' as unknown as BiquadFilterType
                break;
            case 'highpass':
                filter.type = 'bandpass' as unknown as BiquadFilterType
                break;
            case 'bandpass':
                filter.type = 'lowpass' as unknown as BiquadFilterType
                break;
            default:
                break;
        }

        this.props.func(filter);
    }

    render ()
    {
        const { filter } = this.props;
        const freq = Math.sqrt((filter.frequency * 127) / 43.405512);

        return (

            <div style="text-align: center">

                <fieldset style={VcfStyle}>
                    <legend>Vcf</legend>

                    <KnobUI name='Freq' value={freq} func={this.setFrequency} />

                    <KnobUI name='Reso' value={filter.Q * 127 / 10} func={this.setQ} />

                    <label for="type">Type</label>
                    <button style={btnStyle} name="type" value={filter.type} onClick={() => this.setType()}>{filter.type}</button>
                </fieldset>
            </div>
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
    height: 269,
    margin: 0
}

const btnStyle = {
    width: '70',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '2px solid var(--MALIBU)',
    'border-radius': '6px',
}
