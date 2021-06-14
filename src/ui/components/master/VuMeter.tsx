import { h, Component, createRef } from "preact";
import GrooveBox from "../../../audio/GrooveBox";
const webAudioPeakMeter = require('web-audio-peak-meter');

type ExpandableProps = {
    grooveBox?: GrooveBox
}
type ExpandableState = {

};

export default class VumeterUI extends Component<ExpandableProps, ExpandableState>
{
    ref = createRef();
    
    componentDidMount ()
    {
        const meterNode = webAudioPeakMeter.createMeterNode(this.props.grooveBox.masterGain, this.props.grooveBox.audioCtx);
            webAudioPeakMeter.createMeter(this.ref.current, meterNode, {});
    }

    render ()
    {
        if (this.props.grooveBox !== undefined)
        {
           // const sourceNode = this.props.grooveBox.audioCtx.createMediaElementSource(this.ref.current);
            //sourceNode.connect(this.props.grooveBox.audioCtx.destination);
            
        }
        
        return (
            <div ref={this.ref} style="width: 120px; height: 32px; top: 7px; margin: 1em 0;">
                
            </div>
        );

    }
}



const DisplayStyleBox = {
    position: 'fixed',
    top: 40,
    left: 10, //297,
    border: '3px solid var(--HOT_CINNAMON)',
    'border-radius': '6px',
    width: '560',
    height: '107px',
    padding: '6px'
}

const gainStyle = {
    position: 'fixed',
    top: '45px',
    left: ' 470px',
    'text-align': 'center',
    display: 'inline-grid',
}

const bpmStyle = {
    position: 'fixed',
    top: '45px',
    left: ' 370px',
    'text-align': 'center',
    display: 'inline-grid',
}
