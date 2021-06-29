import Note from "./Note";
import { EMode } from "../constant/EMode";
import { T16range, TOctave } from "../types/types";
import Song from "../data/Song";
import Track from "../data/Track";
import MonoSynth from "./synths/MonoSynth";
import LimiterFX from "./fx/LimiterFx";
import DrumTrack from "./drums/DrumTrack";
import localforage = require("localforage");
import { SAMPLES } from "../constant/SAMPLES";
import { ECopySourceType } from "../constant/ECopySourceType";
import { InputEventControlchange } from "webmidi";
import ControlChange, { TCc } from "../data/ControlChange";


export default class GrooveBox
{
    // general
    public audioCtx: AudioContext;
    public compressor: DynamicsCompressorNode;
    private bpm: number = 170;


    // ui state
    private currentBeatId: T16range = 0;
    private currentBarId: T16range = 0;
    //public maxBarId: T16range = 0;
    public selectedPatternId: T16range = 0;
    public selectedTrackId: T16range = 0;
    public selectedBarId: T16range = 0;
    public shiftOn: boolean = false;
    public copyOn: boolean = false;
    public sendEvent: Function;
    public selectingPattern: boolean = false;
    public selectingTrack: boolean = false;
    public selectingBar: boolean = false;
    public octave: TOctave = 3;
    public muteTrackMode: boolean = false;

    // samples
    public drumKit: AudioBuffer[] = [];

    // tracks
    public synthTracks: MonoSynth[] = [];
    public drumTracks: DrumTrack[] = [];


    // data
    public masterGain: GainNode;
    private song: Song;

    // sequencer
    private lookahead: number = 25.0; // How frequently to call scheduling function (in milliseconds)
    private scheduleAheadTime: number = 0.1; // How far ahead to schedule audio (sec)
    private nextNoteTime: number = 0.0;     // when the next note is due.
    private notesInQueue: any[] = [];
    public isPlaying: boolean = false;
    private unlocked: boolean = false;
    public clockWorker: Worker;
    public mode: EMode = EMode.LIVE;
    public limiter: DynamicsCompressorNode;
    private isWaitingPitch: boolean = false;
    public copySource: any = null;
    public copySourceType: ECopySourceType = null;
    public isTransposing: boolean;
    public displayData: any[] = [];
    ccHandler: ControlChange;

    constructor (sendEvent: Function)
    {
        this.playStopSequencer = this.playStopSequencer.bind(this);
        this.setBpm = this.setBpm.bind(this);
        this.sendEvent = sendEvent;
    }

    checkIsMidiLearning (): boolean
    {
        if (this.ccHandler.isWaitingFunction === true)
        {
            return true;
        }

        return false;
    }

    getControlChangeEvent (cc: InputEventControlchange)
    {
        const id = cc.controller.number;
        const value = cc.value;
        if (this.ccHandler.isWaitingCC)
        {
            this.ccHandler.midiLearn(id, undefined);

            return;
        }

        const func = this.ccHandler.ccList[id].func as keyof GrooveBox;

        if (func)
        {
            try
            {
                this[func](value);

                return;
            }
            catch (error)
            {
                if (this.selectedTrackId < 8)
                {
                    const drumFunc = this.ccHandler.ccList[id].func as keyof DrumTrack;

                    try
                    {
                        // @ts-ignore
                        this.drumTracks[this.selectedTrackId][drumFunc](value);

                        return;
                    }
                    catch (error)
                    {
                        console.log(error)
                    }
                }

                if (this.selectedTrackId > 7)
                {
                    const synthFunc = this.ccHandler.ccList[id].func as keyof MonoSynth;

                    try
                    {
                        // @ts-ignore
                        this.synthTracks[this.selectedTrackId - 8][synthFunc](value);

                        return;
                    }
                    catch (error)
                    {
                        console.log(error)
                    }
                }

            }
        }
        // else
        // {
        //     const synthFunc = this.ccHandler.ccList[id].func as keyof MonoSynth;

        //     try
        //     {
        //         // @ts-ignore
        //         this.synthTracks[this.selectedTrackId - 8][synthFunc](value);
        //     }
        //     catch (error)
        //     {
        //         console.log(error)
        //     }
        // }


    }

    getBpm (): number
    {
        return this.bpm; // song?.getBpm() || 120;
    }

    setBpm (value: number)
    {
        const bpm = Math.round((value / 127 * 200) + 40);
        this.song.setBpm(bpm);
        this.bpm = this.song.getBpm();
    }

    public setMasterGain (gain: number)
    {
        this.masterGain.gain.setValueAtTime(gain / 127, 0);
    }

    getOctave (): TOctave
    {
        return this.octave;
    }

    setOctave (value: string)
    {
        if (value === 'OCT+' && this.octave < 6)
        {
            this.octave += 1;
        }
        else if (value === 'OCT-' && this.octave > 1)
        {
            this.octave -= 1;
        }

        this.sendEvent({ song: this.song });
    }

    async loadDefaultSamples ()
    {
        const checkSample = localforage.getItem('sampleCount');

        if (!await checkSample)
        {
            SAMPLES.forEach((sample, i) =>
            {
                localforage.setItem(`sample${i}`, sample).then(value =>
                {
                    this.decodeLocalAudio(i);
                });
            });

            localforage.setItem('sampleCount', 8);
        }
        else
        {
            for (let i = 0; i < 8; i += 1)
            {
                this.decodeLocalAudio(i);
            }
        }
    }

    public base64ToArrayBuffer (base64: string)
    {
        const binaryString = window.atob(base64);

        const len = binaryString.length;

        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i += 1)
        {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return bytes.buffer;
    }

    decodeLocalAudio (i: number)
    {
        localforage.getItem(`sample${i}`).then((sample: any) =>
        {
            // window.location.href = 'data:application/octet-stream;text/plain,' + sample.b64;
            const arrayBuffer = this.base64ToArrayBuffer(sample.b64);

            const name = sample.name.split('.')[0];

            this.audioCtx.decodeAudioData(arrayBuffer, (buffer) =>
            {
                this.drumKit.push(undefined);

                this.drumKit[i] = buffer;
            })
        });
    }

    init (): boolean
    {
        // create a new audioContext
        this.audioCtx = new AudioContext({ sampleRate: 11025 });

        // create master limiter
        const limiter = new LimiterFX(this.audioCtx);
        this.limiter = limiter.limiterNode;

        // create a global gain
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 1;
        this.masterGain.connect(this.limiter);

        this.limiter.connect(this.audioCtx.destination);

        // samples
        this.loadDefaultSamples();

        // init clock worker for the sequencer
        this.clockWorker = new Worker('../../clock.worker.js');
        this.clockWorker.onerror = (err: any) => console.log(err);
        this.clockWorker.onmessageerror = (err: any) => console.log(err);
        this.clockWorker.onmessage = (e: { data: string; }) =>
        {
            if (e.data == "tick")
            {
                this.scheduler();
                this.sendEvent({ currentBarId: this.currentBarId });
                this.sendEvent({ currentBeatId: this.currentBeatId });
            }
            else
            {
                console.log("message: " + e.data);
            }
        };
        this.clockWorker.postMessage({ "interval": this.lookahead });

        // init default song
        this.song = new Song(0, 'Default_Groove');
        this.bpm = this.song.getBpm();

        for (let i = 0; i < 8; i += 1)
        {
            const synthTrack = this.song.getPattern(0).getTrack(i + 8);

            const synth = new MonoSynth(this, synthTrack);

            this.synthTracks.push(synth);
        }

        for (let i = 0; i < 8; i += 1)
        {
            this.drumTracks.push(undefined);

            const drumTrack = this.song.getPattern(0).getTrack(i);

            const drum = new DrumTrack(this, drumTrack);

            this.drumTracks[i] = drum;
        }

        // init Control Change
        this.ccHandler = new ControlChange(this);
        this.loadCcList();

        console.log("GrooveBox initialized: ", this)

        return true;
    }

    loadCcList ()
    {
        localforage.getItem('ccList').then((ccList: TCc[]) =>
        {
            if (ccList)
            {
                this.ccHandler.ccList = ccList;
            }
            else
            {
                localforage.setItem('ccList', this.ccHandler.ccList);
            }
        });
    }

    setSong (song: Song)
    {
        this.song.loadGroove(song);

        for (let i = 0; i < 8; i += 1)
        {
            const synthTrack = this.song.getPattern(0).getTrack(i + 8);

            const synth = new MonoSynth(this, synthTrack);
            synth.setPreset();

            this.synthTracks[i] = synth;
        }

        for (let i = 0; i < 8; i += 1)
        {
            this.drumTracks.push(undefined);

            const drumTrack = this.song.getPattern(0).getTrack(i);

            const drum = new DrumTrack(this, drumTrack);
            drum.setPreset();

            this.drumTracks[i] = drum;
        }

        this.song.drumKitNames.forEach((sampleName, i) =>
        {
            localforage.getItem(sampleName).then((sample: any) =>
            {
                const arrayBuffer = this.base64ToArrayBuffer(sample.b64);

                this.audioCtx.decodeAudioData(arrayBuffer, (buffer) =>
                {
                    this.drumKit[i] = buffer;
                })
            });
        })

        this.sendEvent('song', this.song);
    }

    getSong (): Song
    {
        return this.song;
    }

    getCurrentTrack (): Track
    {
        return this.getSong().getPattern(this.selectedPatternId).getTrack(this.selectedTrackId);
    }

    nextNote (): void
    {
        // Advance current note and time by a 16th note...
        const secondsPerBeat = 60.0 / this.bpm;    // Notice this picks up the CURRENT 
        // tempo value to calculate beat length.
        this.nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

        this.currentBeatId += 1;    // Advance the beat number, wrap to zero

        if (this.currentBeatId === 16)
        {
            this.currentBarId += 1;

            if (this.currentBarId > this.song.getPattern(this.selectedPatternId).maxBarId)
            {
                this.currentBarId = 0;
            }

            this.currentBeatId = 0;
        }
    }

    scheduleNote (beatNumber: number, time: number): void
    {
        // push the note on the queue, even if we're not playing.
        this.notesInQueue.push({ note: beatNumber, time: time });

        const { tracks } = this.song.getPattern(this.selectedPatternId);

        tracks.forEach(track =>
        {
            if (track.id < 8 && !track.mute)
            {
                // DRUM TRACKS
                const currentBeatNote = track.bar[this.currentBarId].notes.filter((note: Note) => note.beatId === beatNumber)[0];

                if (currentBeatNote)
                {
                    this.drumTracks[track.id].seqNoteOn(time);
                }
            }
            else
            {
                // SYNTH TRACKS
                const currentBeatNote = track.bar[this.currentBarId].notes.filter((note: Note) => note.beatId === beatNumber)[0];

                if (currentBeatNote && !track.mute)
                {
                    this.synthTracks[track.id - 8].seqNoteOn(time, currentBeatNote);
                }
                else
                {
                    try
                    {
                        this.synthTracks[track.id - 8].seqNoteOff(time);
                    } catch (error)
                    {

                    }

                }
            }
        });
    }

    scheduler (): void
    {
        // while there are notes that will need to play before the next interval, 
        // schedule them and advance the pointer.
        while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime)
        {
            this.scheduleNote(this.currentBeatId, this.nextNoteTime);

            this.nextNote();
        }
    }

    playStopSequencer (): void
    {
        if (!this.unlocked)
        {
            // play silent buffer to unlock the audio
            const buffer = this.audioCtx.createBuffer(1, 1, 22050);

            const node = this.audioCtx.createBufferSource();
            node.buffer = buffer;
            node.start(0);

            this.unlocked = true;
        }

        this.isPlaying = !this.isPlaying;

        if (this.isPlaying)
        {
            // start playing
            this.currentBeatId = 0;
            this.currentBarId = 0;

            this.nextNoteTime = this.audioCtx.currentTime;

            this.clockWorker.postMessage("start");

            this.synthTracks.forEach(synth => synth.restartLfo(0));
        }
        else
        {
            // stop playing
            this.clockWorker.postMessage("stop");

            this.notesInQueue.length = 0;

            this.synthTracks.forEach(synth => synth.seqNoteOff(0));

            this.sendEvent({ currentBeatId: 0 });
            this.sendEvent({ currentBarId: 0 });
        }
    }

    playMidiNote (note: Note, seqId?: T16range)
    {
        const { selectedTrackId } = this;

        if (selectedTrackId < 8)
        {
            this.drumTracks[selectedTrackId].seqNoteOn(0);
        }
        else
        {
            return this.synthTracks[selectedTrackId - 8].playMidiNote(note, seqId);
        }
    }

    setTracks (tracks: Track[])
    {
        this.song.getPattern(this.selectedPatternId).getTracks().forEach((track, i) =>
        {
            if (i < 8)
            {
                track.drumParams = tracks[i].drumParams;
                track.bar = tracks[i].bar;
            }
            else
            {
                track.analogSynthParams = tracks[i].analogSynthParams;
                track.bar = tracks[i].bar;
            }
        });

        this.sendEvent({ grooveBox: this });
    }

    checkControls (id: T16range)
    {
        // SELECT PATTERN
        if (this.selectingPattern && !this.copyOn)
        {
            this.selectedPatternId = id;

            for (let i = 0; i < 8; i += 1)
            {
                const synthTrack = this.song.getPattern(id).getTrack(i + 8);

                this.synthTracks[i].setTrackConfig(synthTrack);
                //this.synthTracks[i].setPreset();
            }

            for (let i = 0; i < 8; i += 1)
            {
                this.drumTracks.push(undefined);

                const drumTrack = this.song.getPattern(id).getTrack(i);

                const drum = new DrumTrack(this, drumTrack);

                this.drumTracks[i] = drum;
                this.drumTracks[i].setPreset();
            }

            this.sendEvent({ selectedPatternId: id });
            this.sendEvent({ selectingPattern: false });

            this.selectingPattern = false;

            return true
        }

        // SELECT TRACK
        if (this.selectingTrack && !this.copyOn)
        {
            this.selectedTrackId = id;

            this.sendEvent({ currentTrackId: id });
            this.sendEvent({ selectingTrack: false });

            this.selectingTrack = false;

            if (this.selectedTrackId < 8)
            {
                this.sendEvent({ selectedDrumTrackId: id });
            }
            else
            {
                this.sendEvent({ selectedSynthTrackId: id });
            }

            return true
        }

        // SELECT BAR
        if (this.selectingBar && !this.shiftOn && !this.copyOn)
        {
            this.selectedBarId = id;

            this.sendEvent({ selectedBarId: id });
            this.sendEvent({ selectingBar: false });

            this.selectingBar = false;

            return true
        }

        // SELECT LOOP BAR
        if (this.selectingBar && this.shiftOn && !this.copyOn)
        {
            this.song.getPattern(this.selectedPatternId).maxBarId = id;

            this.sendEvent({ selectingBar: false });
            this.sendEvent({ shiftOn: false });

            this.selectingBar = false;

            this.shiftOn = false;

            return true
        }

        // MUTE
        if (this.muteTrackMode && !this.shiftOn && !this.copyOn)
        {
            const { mute } = this.song.getPattern(this.selectedPatternId).getTrack(id);

            this.song.getPattern(this.selectedPatternId).getTrack(id).mute = !mute;

            this.sendEvent({ song: this.song });

            return true;
        }

        // SOLO
        if (this.muteTrackMode && this.shiftOn && !this.copyOn)
        {
            const { mute } = this.song.getPattern(this.selectedPatternId).getTrack(id);

            const solo = this.song.getPattern(this.selectedPatternId).getTracks().filter(track => !track.mute).length;

            if (solo > 1)
            {
                this.song.getPattern(this.selectedPatternId).getTracks().forEach(track =>
                {
                    if (track.id !== id)
                    {
                        track.mute = true;
                    }
                    else
                    {
                        track.mute = false
                    }
                });
            }
            else
            {
                this.song.getPattern(this.selectedPatternId).getTracks().forEach(track => track.mute = false);
            }

            this.sendEvent({ song: this.song })

            return true;
        }

        // COPY PASTE
        // Pattern
        if (this.copyOn && this.selectingPattern)
        {
            if (this.copySourceType !== ECopySourceType.PATTERN)
            {
                this.copySource = this.song.getPattern(id);
                this.copySourceType = ECopySourceType.PATTERN;
            }
            else if (this.copySourceType === ECopySourceType.PATTERN && this.copySource !== null)
            {
                try
                {
                    const { tracks } = this.copySource;

                    if (this.copySource.id === id)
                    {
                        return;
                    }

                    this.song.getPattern(id).maxBarId = this.copySource.maxBarId;

                    const tracksJSON = JSON.parse(JSON.stringify(tracks));

                    this.song.getPattern(id).tracks.forEach((track, i) =>
                    {
                        track.analogSynthParams = tracksJSON[i].analogSynthParams;
                        track.bar = tracksJSON[i].bar;
                        track.drumParams = tracksJSON[i].drumParams;
                        track.vcf = tracksJSON[i].vcf;
                        track.env = tracksJSON[i].env;
                        track.fx = tracksJSON[i].fx;
                        track.fxLevel = tracksJSON[i].fxLevel;
                        track.level = tracksJSON[i].level;
                        track.mute = tracksJSON[i].mute;
                        track.name = tracksJSON[i].name;
                        track.output = tracksJSON[i].output;
                        track.pan = tracksJSON[i].pan;
                    });

                    this.sendEvent({ grooveBox: this });
                }
                catch (error)
                {
                    this.copyOn = false;
                    this.copySource = null;
                    this.copySourceType = null;
                    this.sendEvent({ copyOn: false });
                }
            }

            return true;
        }

        // Track
        if (this.copyOn && this.selectingTrack)
        {
            if (this.copySourceType !== ECopySourceType.TRACK)
            {
                this.copySource = this.song.getPattern(this.selectedPatternId).getTrack(id);
                this.copySourceType = ECopySourceType.TRACK;
            }
            else if (this.copySourceType === ECopySourceType.TRACK && this.copySource !== null)
            {
                try
                {
                    if ((this.copySource.id < 8 && id > 7) || (this.copySource.id > 7 && id < 8))
                    {
                        return;
                    }

                    const trackJSON = JSON.parse(JSON.stringify(this.copySource));

                    const destTrack = this.song.getPattern(this.selectedPatternId).getTrack(id);

                    destTrack.analogSynthParams = trackJSON.analogSynthParams;
                    destTrack.bar = trackJSON.bar;
                    destTrack.drumParams = trackJSON.drumParams;
                    destTrack.env = trackJSON.env;
                    destTrack.fx = trackJSON.fx;
                    destTrack.fxLevel = trackJSON.fxLevel;
                    destTrack.level = trackJSON.level;
                    destTrack.mute = trackJSON.mute;
                    destTrack.name = trackJSON.name;
                    destTrack.output = trackJSON.output;
                    destTrack.vcf = trackJSON.vcf;
                    destTrack.pan = trackJSON.pan;

                    if (destTrack.id < 8)
                    {
                        const buffer = this.drumKit[this.copySource.id];
                        this.drumKit[destTrack.id] = buffer;
                    }

                    this.sendEvent({ grooveBox: this });
                }
                catch (error)
                {
                    this.copyOn = false;
                    this.copySource = null;
                    this.copySourceType = null;
                    this.sendEvent({ copyOn: false });
                }
            }

            return true;
        }

        // Bar
        if (this.copyOn && this.selectingBar)
        {
            if (this.copySourceType !== ECopySourceType.BAR)
            {
                this.copySource = this.song.getPattern(this.selectedPatternId).getTrack(this.selectedTrackId).bar[id];
                this.copySourceType = ECopySourceType.BAR;
            }
            else if (this.copySourceType === ECopySourceType.BAR && this.copySource !== null)
            {
                try
                {
                    const barJSON = JSON.parse(JSON.stringify(this.copySource));

                    this.song.getPattern(this.selectedPatternId).getTrack(this.selectedTrackId).bar[id] = barJSON;

                    this.sendEvent({ grooveBox: this });
                }
                catch (error)
                {
                    this.copyOn = false;
                    this.copySource = null;
                    this.copySourceType = null;
                    this.sendEvent({ copyOn: false });
                }
            }

            return true;
        }

        // Note
        if (this.copyOn)
        {
            if (this.copySourceType !== ECopySourceType.NOTE)
            {
                this.copySource = this.song.getPattern(this.selectedPatternId)
                    .getTrack(this.selectedTrackId).bar[this.selectedBarId].notes
                    .filter(note => note.beatId === id)[0];

                this.copySourceType = ECopySourceType.NOTE;
            }
            else if (this.copySourceType === ECopySourceType.NOTE && this.copySource !== null)
            {
                try
                {
                    const { name, octave } = this.copySource;

                    const { selectedTrackId, selectedBarId, song, selectedPatternId } = this;
                    const tracks = song.getPattern(selectedPatternId).getTracks();

                    let notesInCurrentBar = tracks[selectedTrackId].bar[selectedBarId].notes;

                    const note = new Note(name, octave, id as T16range);

                    notesInCurrentBar.push(note);

                    this.sendEvent({ grooveBox: this });
                }
                catch (error)
                {
                    this.copyOn = false;
                    this.copySource = null;
                    this.copySourceType = null;
                    this.sendEvent({ copyOn: false });
                }
            }

            return true;
        }

        if (this.isTransposing)
        {

            return true;
        }

        return false;
    }

    noteOn (currentNote: Note, seqId: T16range): MonoSynth | undefined
    {
        if (this.checkControls(currentNote.beatId))
        {
            return;
        }

        if (this.mode === EMode.STEP) // STEP MODE
        {
            return this.setStepNoteOnOff(currentNote, seqId);
        }
        else // LIVE MODE
        {
            // just play a note
            const synth = this.playMidiNote(currentNote);
            return synth;
        }
    }

    setStepNoteOnOff (currentNote: Note, seqId: T16range)
    {
        const { selectedTrackId, selectedBarId, song, selectedPatternId, currentBarId } = this;
        const tracks = song.getPattern(selectedPatternId).getTracks();

        let notesInSelectedBar = tracks[selectedTrackId].bar[selectedBarId].notes;

        const isNote = notesInSelectedBar.filter((note: Note) => note.beatId === seqId)[0];

        if (isNote && !this.isWaitingPitch)
        {
            // delete note for drum tracks
            const newNotesInCurrentBar = notesInSelectedBar.filter((note: Note) => note.beatId !== isNote.beatId);

            notesInSelectedBar = newNotesInCurrentBar;
        }
        else if (!isNote && !this.isWaitingPitch)
        {
            if (selectedTrackId < 8) // add drum note
            {
                if (!currentNote.isFromMidi)
                {
                    currentNote.setBeatId(seqId);

                    notesInSelectedBar.push(currentNote);
                }
                else
                {
                    const seq = seqId > 0 ? seqId - 1 : 15;

                    let notesInCurrentBar = tracks[selectedTrackId].bar[currentBarId].notes;

                    currentNote.setBeatId(seq as T16range);

                    notesInCurrentBar.push(currentNote);

                    this.drumTracks[selectedTrackId].seqNoteOn(0);
                }
            }
            else // add synth note
            {
                if (!currentNote.isFromMidi)
                {
                    currentNote.setBeatId(seqId);

                    notesInSelectedBar.push(currentNote);

                    this.isWaitingPitch = true;

                    this.sendEvent({ isWaitingPitch: this.isWaitingPitch });
                    this.sendEvent({ 'lcdLine4': { key: 'CHOOSE A NOTE:', value: '' } });
                }
                else
                {
                    const seq = seqId > 0 ? seqId - 1 : 15;

                    let notesInCurrentBar = tracks[selectedTrackId].bar[currentBarId].notes;

                    currentNote.setBeatId(seq as T16range);

                    notesInCurrentBar.push(currentNote);

                    return this.synthTracks[selectedTrackId - 8].playMidiNote(currentNote);
                }
            }
        }
        else if (this.isWaitingPitch)
        {
            const length = notesInSelectedBar.length - 1;

            notesInSelectedBar[length].name = currentNote.name;
            notesInSelectedBar[length].octave = currentNote.octave;

            this.isWaitingPitch = false;

            this.sendEvent({ isWaitingPitch: this.isWaitingPitch });
            this.sendEvent({ 'lcdLine4': { key: 'NOTE:', value: currentNote.name + currentNote.octave } });
        }

        this.song.getPattern(selectedPatternId).getTrack(selectedTrackId).bar[selectedBarId].notes = notesInSelectedBar;

        this.sendEvent({ song: song });
    }

    setStepNoteOn (currentNote: Note, seqId: T16range)
    {
        const { selectedTrackId, selectedBarId, song, selectedPatternId, currentBarId } = this;
        const tracks = song.getPattern(selectedPatternId).getTracks();

        let notesInCurrentBar = tracks[selectedTrackId].bar[currentNote.bar || currentBarId]?.notes;

        const isNote = notesInCurrentBar.filter((note: Note) => note.beatId === seqId)[0];

        if (isNote)
        {
            // delete note
            const newNotesInCurrentBar = notesInCurrentBar.filter((note: Note) => note.beatId !== isNote.beatId)

            notesInCurrentBar = newNotesInCurrentBar;
        }

        if (currentNote.bar === undefined)
        {
            currentNote.bar = currentBarId;
        }
    }

    transposeUp ()
    {
        this.song.getPattern(this.selectedPatternId).getTrack(this.selectedTrackId).bar[this.selectedBarId].notes.forEach(note =>
        {
            if (note.octave < 6) note.octave += 1;
        });

        this.sendEvent({ 'lcdLine4': { key: 'TRANSPOSE', value: 'UP' } });
    }

    transposeDown ()
    {
        this.song.getPattern(this.selectedPatternId).getTrack(this.selectedTrackId).bar[this.selectedBarId].notes.forEach(note =>
        {
            if (note.octave > 0) note.octave -= 1;
        });

        this.sendEvent({ 'lcdLine4': { key: 'TRANSPOSE', value: 'DOWN' } });
    }
}