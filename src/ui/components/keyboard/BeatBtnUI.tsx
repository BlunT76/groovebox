import { h, Component } from "preact";
import { PureComponent } from 'preact/compat';

// Types for props
type ExpandableProps = {
    note: number[];
    id: number;
    tick: number;
    currentBar: boolean;
    isPlaying: boolean;
    isWaitingPitch: boolean;
    func: any;
};

const noteNames = ['OCT-', 'C#', 'D#', 'TRPS', 'F#', 'G#', 'A#', 'OCT+', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']

// Types for state
type ExpandableState = {};

export default class BeatBtnUI extends PureComponent<ExpandableProps, ExpandableState>
{
    render ()
    {
        const { note, id, tick, currentBar, isPlaying, isWaitingPitch } = this.props;

        let style = '';
        note.includes(id) ? style += 'btnActive' : style += 'btnInactive';

        tick === id && isPlaying && currentBar ? style += ' tickActive' : style += ' tickInactive';

        let noteStyle = '';

        noteNames[id].endsWith('#') ?
            noteStyle = 'margin-top: 61px; width:fit-content; padding: 2px; border-radius: 4px; color: var(--HAWKES_BLUE); background-color: var(--STEEL_GRAY); user-select: none;'
            :
            noteStyle = 'margin-top: 61px; color: var(--STEEL_GRAY); user-select: none;';
        
        if (noteNames[id].endsWith('-') || noteNames[id].endsWith('+') || noteNames[id] === 'TRPS') noteStyle += `margin-top: 61px; width:fit-content; padding: 2px; border-radius: 4px; color: var(--STEEL_GRAY); background-color: var(--HOT_CINNAMON); user-select: none;`

        if (isWaitingPitch && (noteNames[id].endsWith('#') || noteNames[id].length === 1)) style = `btnPitchWaiting`;

        return (
            <div style={beatBtnStyle}
                className={style}
                onClick={() => this.props.func(noteNames[id], id)}
                type="button"
                id={`${id}`}
            >
                <div style={'margin-left: 82px; text-align: right; color: var(--STEEL_GRAY); user-select: none'}>{id + 1}</div>
                <div style={noteStyle}>{noteNames[id]}</div>
            </div>
        );
    }
}

const beatBtnStyle = {
    width:  '118px',
    height: '118px',
    margin: '4px',
    border: '6px solid var(--MALIBU)',
    padding: '6px'
}

const noteStyle2 = {

}
