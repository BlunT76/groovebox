import { h, Component, render } from "preact";
import { IAdsr } from "../../../models/IAdsr";
import KnobUI from "../utils/KnobUI";

// Types for props
type ExpandableProps = {
    adsr: IAdsr;
    func: any;
    disabled: boolean;
};

// Types for state
type ExpandableState = {};

export default class EnvUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setA = this.setA.bind(this);
        this.setD = this.setD.bind(this);
        this.setS = this.setS.bind(this);
        this.setR = this.setR.bind(this);
    }
    setA (value: number)
    {
        let { adsr } = this.props;
        adsr.a = value / 127 * 5;
        this.props.func(adsr);
    }

    setD (value: number)
    {
        let { adsr } = this.props;
        adsr.d = value / 127 * 5;
        this.props.func(adsr);
    }

    setS (value: number)
    {
        let { adsr } = this.props;
        adsr.s = value / 127;
        this.props.func(adsr);
    }

    setR (value: number)
    {
        let { adsr } = this.props;
        adsr.r = value / 127 * 5;
        this.props.func(adsr);
    }

    render ()
    {
        const { disabled, adsr } = this.props;
        const { a, d, s, r } = adsr;


        return (
            <div>
                <fieldset style={fieldStyle}>
                    <legend>Env</legend>
                    <div>
                        <KnobUI name='A' value={a * 127 / 5} func={this.setA} />

                        <KnobUI name='S' disabled={disabled} value={s * 127} func={this.setS} />
                    </div>

                    <div>
                        <KnobUI name='D' value={d * 127 / 5} func={this.setD} />

                        <KnobUI name='R' disabled={disabled} value={r * 127 / 5} func={this.setR} />
                    </div>
                </fieldset>
            </div>
        );
    }
}

const fieldStyle = {
    position: 'absolute',
    top: -4,
    left: 77,
    'border-width': '1px 0px 0px 0px',
    'border-style': 'solid',
    'border-color': 'initial',
    width: '123px',
    height: '154px',
    display: 'flex',
    margin: '4px',
}

const aStyle = {
    position: 'absolute',
    top: -18,
    left: 0,
    width: '80px',
    height: '80px',
    'user-select': 'none'
}

const dStyle = {
    position: 'absolute',
    top: -18,
    left: 80,
    width: '80px',
    height: '80px',
    'user-select': 'none'
}

const sStyle = {
    position: 'absolute',
    top: 50,
    left: 0,
    width: '80px',
    height: '80px',
    'user-select': 'none'
}

const rStyle = {
    position: 'absolute',
    top: 50,
    left: 80,
    width: '80px',
    height: '80px',
    'user-select': 'none'
}