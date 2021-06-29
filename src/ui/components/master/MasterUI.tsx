import { h, Component } from "preact";
import GrooveBox from "../../../audio/GrooveBox";
import KnobUI from "../utils/KnobUI";

type ExpandableProps = {
    grooveBox: GrooveBox
}
type ExpandableState = {

};

export default class MasterUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setGain = this.setGain.bind(this);
        this.setBpm = this.setBpm.bind(this);
    }

    setGain (value: number)
    {
        this.props.grooveBox.setMasterGain(value);
        this.props.grooveBox.sendEvent({ grooveBox: this.props.grooveBox });
    }

    setBpm (value: number)
    {
        this.props.grooveBox.setBpm(value);
        this.props.grooveBox.sendEvent({ grooveBox: this.props.grooveBox });
    }


    render ()
    {
        const bpm = (this.props.grooveBox.getBpm() - 40) / 200 * 127;

        const gain = this.props.grooveBox.masterGain.gain.value;

        return (
            <fieldset style={DisplayStyleBox} >
                <legend>MASTER</legend>

                <div style={gainStyle}>
                    <KnobUI name='GAIN' value={gain * 127} func={this.setGain} />
                </div>

                <div style={bpmStyle}>
                    <KnobUI name='BPM' value={bpm} func={this.setBpm} coerceToInt={true}/>
                </div>

            </fieldset>
        );

    }
}



const DisplayStyleBox = {
    position: 'fixed',
    top: 40,
    left: 609, //297, 542
    border: '3px solid var(--HOT_CINNAMON)',
    'border-radius': '6px',
    width: '131',
    height: '107px',
    padding: '6px'
}

const gainStyle = {
    position: 'absolute',
    top: 0,
    left: '65px',
    'text-align': 'center',
    display: 'inline-grid',
}

const bpmStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    'text-align': 'center',
    display: 'inline-grid',
}
