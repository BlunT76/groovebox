import { h, Component, render, Fragment } from "preact";
import * as WebMidi from 'webmidi';
import GrooveBox from "../../audio/GrooveBox";
import BeatBtnUI from "./keyboard/BeatBtnUI";
import DrumUI from "./drums/DrumUI";
import GeneralUI from "./master/GeneralUI";
import TransportUI from "./master/TransportUI";
import SynthUI from "./synths/SynthUI";
import Note from "../../audio/Note";
import { EMode } from "../../constant/EMode";
import Midi from "../../inputs/Midi";
import { T16range, TNoteName, TOctave } from "../../types/types";
import Track from "../../data/Track";
import ControlsUI from "./master/ControlsUI";
import DisplayUI from "./lcd/DisplayUI";
import MasterUI from "./master/MasterUI";
import TrackUI from "./tracks/TrackUI";
import FxUI from "./fx/FxUI";
import PresetUI from "./tracks/PresetUI";
import { ITrackPreset } from "../../models/ITrackPreset";
import VumeterUI from "./master/VuMeter";
import SongUI from "./master/SongUI";
const diablotin = require('../../diablotin.png');
const backgroundImg = require('../../background.png');



// Types for props
type ExpandableProps = {
};

// Types for state
type ExpandableState = {
    grooveBox: GrooveBox;
    selectedPatternId: T16range;
    selectingPattern: boolean;
    currentTrackId: T16range;
    selectingTrack: boolean;
    selectedBarId: T16range; // 0 to 3
    selectingBar: boolean;
    shiftOn: boolean;
    currentBarId: T16range; // 0 to 3
    currentBeatId: T16range;
    mode: EMode;
    midiInputs: string[];
    selectedOctave: TOctave;
    lcdLine1: string;
    lcdLine2: string;
    lcdLine3: string;
    lcdLine4: { key: string, value: string };
    preset: string;
    muteTrackMode: boolean;
    copyOn: boolean;
    isWaitingPitch: boolean;
}

export default class GrooveBoxUI extends Component<ExpandableProps, ExpandableState>
{
    midiInput: any;
    oscList: any[] = [];
    midi: Midi;

    constructor ()
    {
        super();

        this.getEvent = this.getEvent.bind(this);
        this.setTracks = this.setTracks.bind(this);
        this.initGroove = this.initGroove.bind(this);
        this.setMode = this.setMode.bind(this);
        this.handleControls = this.handleControls.bind(this);
        this.beatBtnToNote = this.beatBtnToNote.bind(this);
        this.setTrackConfig = this.setTrackConfig.bind(this);
        this.handleLcdPreset = this.handleLcdPreset.bind(this);

        this.state = {
            grooveBox: new GrooveBox(this.getEvent),
            selectedPatternId: 0,
            selectingPattern: false,
            currentTrackId: 0,
            selectingTrack: false,
            selectedBarId: 0,
            selectingBar: false,
            shiftOn: false,
            currentBarId: 0,
            currentBeatId: 0,
            mode: EMode.LIVE,
            midiInputs: [],
            selectedOctave: 3,
            lcdLine1: '',
            lcdLine2: '',
            lcdLine3: '',
            lcdLine4: { key: '', value: '' },
            preset: '',
            muteTrackMode: false,
            copyOn: false,
            isWaitingPitch: false
        };
    }

    getEvent (value: any)
    {
        try
        {
            const keyName = Object.keys(value)[0];

            const keyValue = Object.values(value)[0];

            this.setState({ [keyName]: keyValue });
        }
        catch (error)
        {

        }

    }

    initGroove ()
    {
        // init midi devices
        this.midi = new Midi(this.state.grooveBox, this);
        this.midi.init(() =>
        {
            const midiInputs = this.midi.getMidiInputs();

            const arr: string[] = [];

            midiInputs.forEach((e: { name: string; }) => arr.push(e.name));

            this.setState({ midiInputs: arr });
        });
        console.log(this)
    }

    setTracks (track: Track)
    {
        if (!this.state.grooveBox)
        {
            return;
        }

        const { selectedPatternId } = this.state;
        const { tracks } = this.state.grooveBox.getSong().getPattern(selectedPatternId);

        const newTracks = tracks.map(elm =>
        {
            if (elm.id === track.id)
            {
                elm = track;
            }
            return elm;
        });

        this.state.grooveBox.getSong().getPattern(selectedPatternId).setTracks(newTracks);

        this.state.grooveBox.setTracks(newTracks);
    }

    setTrackConfig (config: unknown)
    {
        const { selectedPatternId, currentTrackId } = this.state;

        const track = this.state.grooveBox.getSong().getPattern(selectedPatternId).getTrack(currentTrackId);

        const preset = config as ITrackPreset;

        track.level = preset.level;
        track.vcf = preset.vcf;
        track.env = preset.env;
        track.fx = preset.fx;

        if (track.analogSynthParams)
        {
            track.analogSynthParams = preset.analogSynthParams;
        }

        if (track.drumParams)
        {
            track.drumParams = preset.drumParams;
        }

        this.setTracks(track);

        if (this.state.currentTrackId < 8)
        {
            this.state.grooveBox.drumTracks[this.state.currentTrackId].setPreset();
        }
        else
        {
            this.state.grooveBox.synthTracks[this.state.currentTrackId - 8].setPreset();
        }

    }

    selectPattern (id: T16range)
    {
        this.state.grooveBox.selectedPatternId = id;
        this.setState({ selectedPatternId: id });
    }

    selectTrack (id: T16range)
    {
        this.state.grooveBox.selectedTrackId = id;

        this.setState({ currentTrackId: id });
    }

    selectBar (el: h.JSX.TargetedEvent<HTMLButtonElement, MouseEvent>)
    {
        const bar = +el.currentTarget.id as T16range;

        this.state.grooveBox.selectedBarId = bar;

        this.setState({ selectedBarId: bar });
    }

    handleControls (value: any)
    {
        switch (value)
        {
            case 'selectingPattern':
                const { selectingPattern } = this.state.grooveBox;
                this.state.grooveBox.selectingPattern = !selectingPattern;
                this.state.grooveBox.selectingTrack = false;
                this.state.grooveBox.selectingBar = false;
                this.state.grooveBox.muteTrackMode = false;
                this.setState({ selectingPattern: !selectingPattern, selectingTrack: false, selectingBar: false, muteTrackMode: false });

                break;

            case 'selectingTrack':
                const { selectingTrack } = this.state.grooveBox;
                this.state.grooveBox.selectingTrack = !selectingTrack;
                this.state.grooveBox.selectingPattern = false;
                this.state.grooveBox.selectingBar = false;
                this.state.grooveBox.muteTrackMode = false;
                this.setState({ selectingTrack: !selectingTrack, selectingPattern: false, selectingBar: false, muteTrackMode: false });

                break;

            case 'selectingBar':
                const { selectingBar } = this.state.grooveBox;
                this.state.grooveBox.selectingBar = !selectingBar;
                this.state.grooveBox.selectingTrack = false;
                this.state.grooveBox.selectingPattern = false;
                this.state.grooveBox.muteTrackMode = false;
                this.setState({ selectingBar: !selectingBar, selectingPattern: false, selectingTrack: false, muteTrackMode: false });

                break;

            case 'shiftOn':
                const { shiftOn } = this.state.grooveBox;
                this.state.grooveBox.shiftOn = !shiftOn;
                this.setState({ shiftOn: !shiftOn });

                break;

            case 'muteTrackMode':
                const { muteTrackMode } = this.state.grooveBox;
                this.state.grooveBox.muteTrackMode = !muteTrackMode;
                this.state.grooveBox.selectingTrack = false;
                this.state.grooveBox.selectingBar = false;
                this.state.grooveBox.selectingPattern = false;
                this.setState({ muteTrackMode: !muteTrackMode, selectingPattern: false, selectingTrack: false, selectingBar: false });

                break;

            case 'copyOn':
                const { copyOn } = this.state.grooveBox;
                if (!copyOn === false)
                {
                    this.state.grooveBox.copySource = null;
                    this.state.grooveBox.copySourceType = null;
                }
                this.state.grooveBox.copyOn = !copyOn;
                this.setState({ copyOn: !copyOn });

                break;

            default:
                break;
        }
    }

    setMode ()
    {
        if (this.state.mode === EMode.LIVE)
        {
            this.state.grooveBox.mode = EMode.STEP;
            this.setState({ mode: EMode.STEP });

            return;
        }

        this.state.grooveBox.mode = EMode.LIVE;
        this.setState({ mode: EMode.LIVE });
    }

    beatBtnToNote (value: string, id: number)
    {
        const { selectingPattern, selectingTrack, selectingBar, mode, shiftOn, muteTrackMode } = this.state.grooveBox;

        switch (value)
        {
            case 'OCT-':
            case 'OCT+':
                {
                    // add a normal note
                    if ((selectingPattern || selectingTrack || selectingBar || muteTrackMode || mode === EMode.STEP) && !shiftOn)
                    {
                        const octave = id < 15 ? this.state.grooveBox.getOctave() : this.state.grooveBox.getOctave() + 1;

                        const note = new Note(value, octave, id as T16range)

                        this.state.grooveBox.noteOn(note, note.beatId);

                        break;
                    }

                    // solo a track
                    if (shiftOn && muteTrackMode)
                    {
                        const octave = id < 15 ? this.state.grooveBox.getOctave() : this.state.grooveBox.getOctave() + 1;

                        const note = new Note(value, octave, id as T16range)

                        this.state.grooveBox.noteOn(note, note.beatId);

                        break;
                    }

                    // change loop size
                    if (selectingBar && shiftOn)
                    {
                        const octave = id < 15 ? this.state.grooveBox.getOctave() : this.state.grooveBox.getOctave() + 1;

                        const note = new Note(value, octave, id as T16range)

                        this.state.grooveBox.noteOn(note, note.beatId);

                        break;
                    }

                    // transpose
                    if (this.state.grooveBox.isTransposing)
                    {
                        if (value === 'OCT+') this.state.grooveBox.transposeUp();

                        if (value === 'OCT-') this.state.grooveBox.transposeDown();

                        this.state.grooveBox.isTransposing = false;

                        break;
                    }

                    // else change octave
                    this.state.grooveBox.setOctave(value);
                    break;
                }

            case 'TRPS':
                {
                    // solo a track
                    if (shiftOn && muteTrackMode)
                    {
                        const octave = id < 15 ? this.state.grooveBox.getOctave() : this.state.grooveBox.getOctave() + 1;

                        const note = new Note(value, octave, id as T16range)

                        this.state.grooveBox.noteOn(note, note.beatId);

                        break;
                    }

                    // transpose mode
                    if (shiftOn && !this.state.grooveBox.selectingBar)
                    {
                        this.state.grooveBox.isTransposing = true;
                        this.setState({ lcdLine4: { key: 'TRANSPOSE', value: 'waiting...' } });

                        break;
                    }

                    const octave = id < 15 ? this.state.grooveBox.getOctave() : this.state.grooveBox.getOctave() + 1;
                    const note = new Note(value, octave, id as T16range)

                    this.state.grooveBox.noteOn(note, note.beatId);

                    break;

                }

            default:
                {
                    const octave = id < 15 ? this.state.grooveBox.getOctave() : this.state.grooveBox.getOctave() + 1;
                    const note = new Note(value, octave, id as T16range)

                    this.state.grooveBox.noteOn(note, note.beatId);

                    break;
                }
        }
    }

    handleLcdPreset (name: string = 'no preset', id: number, label = 'PRESET')
    {
        if (id === -1)
        {
            this.setState({ preset: '' });

            return;
        }

        if (label === 'SONG' && name === 'no preset')
        {
            name = 'no song';
        }
        const id3digit = ('000' + id).substr(-3);

        const line4 = `${label} ${id3digit}: ${label === 'SONG' ? name : name}`;

        this.setState({ preset: line4 });
    }

    render ()
    {
        const {
            grooveBox,
            selectedPatternId,
            selectingPattern,
            currentTrackId,
            selectingTrack,
            selectedBarId,
            selectingBar,
            shiftOn,
            currentBarId,
            currentBeatId,
            mode,
            midiInputs,
            isWaitingPitch,
            muteTrackMode,
            copyOn,
            lcdLine4
        } = this.state;

        const song = grooveBox.getSong();

        const track = song?.getPattern(selectedPatternId).getTrack(currentTrackId);

        if (!track || !grooveBox)
        {
            return (
                <div>
                    {grooveBox && <GeneralUI key={0} grooveBox={grooveBox} func={this.initGroove} />}
                    <img src={diablotin} style={logoStyle} alt="imp" />
                    <img src={backgroundImg} style={backgroundImgStyle} alt="bg image" />
                </div>
            )
        }

        // const bpm = grooveBox.getBpm();
        let trackActiveKeys = track.bar[selectedBarId].notes.map((n: Note) => n.beatId);

        if (grooveBox.muteTrackMode)
        {
            //trackActiveKeys = track.bar[selectedBarId].notes.map((n: Note) => n.beatId);
            trackActiveKeys = song.getPattern(selectedPatternId).getTracks().map(track => { if (track.mute) return track.id as T16range });
        }



        return (
            <Fragment>

                {grooveBox && <GeneralUI key={1} grooveBox={grooveBox} midiInputs={midiInputs} midi={this.midi} />}

                <SongUI grooveBox={grooveBox} showName={this.handleLcdPreset} />

                <img draggable={false} src={diablotin} style={logoStyle} alt="fireSpot" />

                <DrumUI
                    grooveBox={grooveBox}
                    currentTrackId={currentTrackId}
                    track={track}
                    func={this.setTracks}
                />

                <PresetUI grooveBox={grooveBox} track={track} func={this.setTrackConfig} showName={this.handleLcdPreset} />

                <SynthUI
                    grooveBox={grooveBox}
                    selectedTrackId={currentTrackId}
                    track={track}
                    func={this.setTracks}
                />

                <TrackUI grooveBox={grooveBox} track={track} func={this.setTracks} />

                <DisplayUI song={song} grooveBox={grooveBox} preset={this.state.preset} lcdLine4={lcdLine4} />

                <MasterUI grooveBox={grooveBox} />

                <FxUI grooveBox={grooveBox} track={track} func={this.setTracks} />

                <TransportUI
                    mode={mode}
                    setMode={this.setMode}
                    bpm={grooveBox.getBpm()}
                    setBpm={grooveBox.setBpm}
                    tick={currentBeatId}
                    grooveBox={grooveBox}
                />

                <ControlsUI
                    copyOn={copyOn}
                    muteTrackMode={muteTrackMode}
                    selectingPattern={selectingPattern}
                    selectingTrack={selectingTrack}
                    selectingBar={selectingBar}
                    shiftOn={shiftOn}
                    func={this.handleControls}
                />

                <div style={BeatBtnStyleBox}>
                    {song?.getPattern(selectedPatternId).getTracks().map((track, i: number) =>
                    {
                        return <BeatBtnUI
                            isWaitingPitch={isWaitingPitch}

                            key={`beatBtn${i}`}
                            isPlaying={grooveBox.isPlaying}
                            tick={currentBeatId}
                            currentBar={currentBarId === selectedBarId ? true : false}
                            note={trackActiveKeys}
                            id={i}
                            func={this.beatBtnToNote}
                        />
                    })}
                </div>

            </Fragment>
        );
    }
}

const BeatBtnStyleBox = {
    position: 'fixed',
    display: 'grid',
    'grid-template-columns': 'repeat(8, 0fr)',
    top: '509px',
    left: '8px',
    width: '1024px',
};

const logoStyle = {
    position: 'fixed',
    top: 37,
    left: 845
}

const backgroundImgStyle = {
    position: 'fixed',
    top: 37,
    left: 0,
    'user-select': 'none',
    'user-drag': 'none',
    'pointer-events': 'none'
}
