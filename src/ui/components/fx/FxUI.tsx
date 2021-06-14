import { h, Component, render } from "preact";
import GrooveBox from "../../../audio/GrooveBox";
import Track from "../../../data/Track";
import { delay, distortion, equalizer, flanger, IFx, reverb } from "../../../models/IFx";
import DelayFxUI from "./DelayFxUI";
import DistortionFxUI from "./DistortionFxUI";
import EqualizerFxUI from "./EqualizerFxUI";
import FlangerFxUI from "./FlangerFxUI";
import ReverbFxUI from "./ReverbFxUI";





// Types for props
type ExpandableProps = {
    grooveBox: GrooveBox;
    track: Track;
    func: Function;
};

// Types for state
type ExpandableState = {};

export default class FxUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.setDelay = this.setDelay.bind(this);
        this.setReverb = this.setReverb.bind(this);
        this.setDistortion = this.setDistortion.bind(this);
        this.setEqualizer = this.setEqualizer.bind(this);
        this.setFlanger = this.setFlanger.bind(this);
    }

    setDelay (delay: delay)
    {
        const { track, grooveBox } = this.props;

        track.fx.delay = delay;
        this.props.func(track);
       
        if (track.id > 7)
        {
            this.props.grooveBox.synthTracks[track.id - 8].setDelay(delay);
        }
        else
        {
            this.props.grooveBox.drumTracks[track.id].setDelay(delay);
        }
    }

    setReverb (reverb: reverb)
    {
        const { track } = this.props;

        track.fx.reverb = reverb;
        this.props.func(track);
       
        if (track.id > 7)
        {
            this.props.grooveBox.synthTracks[track.id - 8].setReverb(reverb);
        }
        else
        {
            this.props.grooveBox.drumTracks[track.id].setReverb(reverb);
        }
    }

    setDistortion (distortion: distortion)
    {
        const { track } = this.props;

        track.fx.distortion = distortion;
        this.props.func(track);
       
        if (track.id > 7)
        {
            this.props.grooveBox.synthTracks[track.id - 8].setDistortion(distortion);
        }
        else
        {
            this.props.grooveBox.drumTracks[track.id].setDistortion(distortion);
        }
    }

    setEqualizer (equalizer: equalizer)
    {
        const { track } = this.props;

        track.fx.equalizer = equalizer;
        this.props.func(track);

        if (track.id > 7)
        {
            this.props.grooveBox.synthTracks[track.id - 8].setEqualizer(equalizer);
        }
        else
        {
            this.props.grooveBox.drumTracks[track.id].setEqualizer(equalizer);
        }
    }

    setFlanger (flanger: flanger)
    {
        const { track } = this.props;

        track.fx.flanger = flanger;
        this.props.func(track);

        if (track.id > 7)
        {
            this.props.grooveBox.synthTracks[track.id - 8].setFlanger(flanger);
        }
        else
        {
            this.props.grooveBox.drumTracks[track.id].setFlanger(flanger);
        }
    }

    render ()
    {

        const { fx } = this.props.track;
        const { delay, reverb, distortion, equalizer, flanger } = fx;

        return (
            <fieldset style={FxStyleBox}>
                <legend>TRACK FX</legend>
                <DistortionFxUI distortion={distortion} func={this.setDistortion} grooveBox={this.props.grooveBox} />
                <EqualizerFxUI equalizer={equalizer} func={this.setEqualizer} grooveBox={this.props.grooveBox} />
                <FlangerFxUI flanger={flanger} func={this.setFlanger} grooveBox={this.props.grooveBox} />
                <DelayFxUI delay={delay} func={this.setDelay} grooveBox={this.props.grooveBox} />
                <ReverbFxUI reverb={reverb} func={this.setReverb} grooveBox={this.props.grooveBox} />
            </fieldset>
        );
    }
}

const FxStyleBox = {
    position: 'fixed',
    top: 150,
    left: 610,
    border: '3px solid var(--HOT_CINNAMON)',
    'border-radius': '6px',
    width: '400',
    height: '288'
}