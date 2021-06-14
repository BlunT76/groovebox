import { h, Component } from "preact";
import GrooveBox from "../../../audio/GrooveBox";
import Song from "../../../data/Song";
import KnobUI from "../utils/KnobUI";
import PresetUI from "../tracks/PresetUI";
import { readDir } from "@tauri-apps/api/fs";
import value from "*.xml";

type ExpandableProps = {
    song: Song;
    grooveBox: GrooveBox;
    preset: string;
    lcdLine4: { key: string, value: string };
}
type ExpandableState = {

};

export default class DisplayUI extends Component<ExpandableProps, ExpandableState>
{
    checkLength (str: string): string
    {
        return str.trim().substring(0, 60);
    }

    getEmptyLine (): string[]
    {
        const line: string[] = [];
        line.length = 40;
        for (let i = 0; i < 40; i++)
        {
            line[i] = ` `;
        }

        return line;
    }

    handleLcdLine1 (): string[]
    {
        const line = this.getEmptyLine();

        const { song, grooveBox } = this.props;

        const bpm = 'BPM:' + (' 000' + song?.getBpm()).substr(-3).toUpperCase();

        const songName = `SONG:${song.getTitle()}`.toUpperCase();

        const oct = `OCT:${grooveBox.getOctave()}`;

        for (let i = 0; i < songName.length; i += 1)
        {
            line[i] = songName[i];
        }

        for (let i = 0; i < bpm.length; i += 1)
        {
            line[i + 23] = oct[i];
        }

        for (let i = 0; i < bpm.length; i += 1)
        {
            line[i + 32] = bpm[i];
        }

        return line;
    }

    handleLcdLine2 (): string[]
    {
        const { grooveBox } = this.props;

        const { selectedPatternId, selectedTrackId, selectedBarId } = grooveBox;

        const maxBarId = grooveBox.getSong().getPattern(selectedPatternId).maxBarId;

        const patternId = 'PATTERN:' + (selectedPatternId + 1 < 10 ? '0' + (selectedPatternId + 1).toString() : selectedPatternId.toString());
        const trackIdToString = 'TRACK:' + (selectedTrackId + 1 < 10 ? '0' + (selectedTrackId + 1) : (selectedTrackId + 1).toString());
        const barIdToString = 'BAR:' + (selectedBarId + 1 < 10 ? '0' + (selectedBarId + 1) : (selectedBarId + 1).toString());
        const maxBarIdToString = 'LOOP:' + (maxBarId + 1 < 10 ? '0' + (maxBarId + 1) : (maxBarId + 1).toString());

        const line = this.getEmptyLine();

        for (let i = 0; i < patternId.length; i += 1)
        {
            line[i] = patternId[i];
        }

        for (let i = 0; i < trackIdToString.length; i += 1)
        {
            line[i + 12] = trackIdToString[i];
        }

        for (let i = 0; i < barIdToString.length; i += 1)
        {
            line[i + 23] = barIdToString[i];
        }

        for (let i = 0; i < maxBarIdToString.length; i += 1)
        {
            line[i + 32] = maxBarIdToString[i];
        }

        return line;
    }

    handleLcdLine3 (): string
    {
        const { song, grooveBox } = this.props;
        const { selectedPatternId, selectedTrackId } = grooveBox;

        if (this.props.preset)
        {
            return this.props.preset;
        }
        else
        {
            return '#####################################################'
        }
    }

    handleLcdLine4 (obj: any): string[]
    {
        const { song, grooveBox } = this.props;

        const line = this.getEmptyLine();

        for (let i = 0; i < obj.key.length; i += 1)
        {
            line[i] = obj.key[i];
        }

        for (let i = 0; i < obj.value.length; i += 1)
        {
            line[i + 12] = obj.value[i];
        }

        return line;
    }



    render ()
    {
        const line1 = this.handleLcdLine1();
        const line2 = this.handleLcdLine2();
        const line3 = this.handleLcdLine3();
        const line4 = this.handleLcdLine4(this.props.lcdLine4);

        return (
            <div style={DisplayStyleBox} >
                <div style={LcdDisplayBox} className={'lcd'}>

                    <div style={lineStyle}>
                        {line1.map(letter =>
                        {
                            return <pre style={letterStyle}>{letter}</pre>
                        })}
                    </div>

                    <div style={lineStyle}>
                        {line2.map(letter =>
                        {
                            return <pre style={letterStyle}>{letter}</pre>
                        })}
                    </div>

                    <pre style={letterStyle2}>{line3}</pre>

                    <div style={lineStyle}>
                        {line4.map(letter =>
                        {
                            return <pre style={letterStyle}>{letter}</pre>
                        })}
                    </div>
                </div>
            </div>
        );

    }
}

const lineStyle = {
    'white-space': 'pre',
    'display': 'flex',

}

const letterStyle = {
    margin: '0px 2px',
    'min-width': '8px',
    color: 'var(--EAST_BAY)',
    'font-family': 'lcd',
    'font-size': '16px',
    'user-select': 'none',
    'text-align': 'right'
}

const letterStyle2 = {
    margin: '0px 2px',
    color: 'var(--EAST_BAY)',
    'font-family': 'lcd',
    'font-size': '16px',
    'user-select': 'none',
}

const DisplayStyleBox = {
    position: 'fixed',
    top: 47,
    left: 48,
    border: '3px solid var(--HOT_CINNAMON)',
    'border-radius': '6px',
    width: '512',
    height: '100px',
    padding: '6px'
}

const LcdDisplayBox = {
    'background-color': 'var(--TURQUOISE_BLUE)',
    width: '100%',
    height: '100%',
    padding: '7px'
}
