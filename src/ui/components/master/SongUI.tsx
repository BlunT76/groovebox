import localforage = require("localforage");
import { h, Component } from "preact";
import GrooveBox from "../../../audio/GrooveBox";
import Song from "../../../data/Song";

// Types for props
type ExpandableProps = {
    grooveBox: GrooveBox;
    showName: Function
};

// Types for state
type ExpandableState = {
    isReset: boolean;
    songsTitle: string[];
    currentSongCounter: number;
};

export default class SongUI extends Component<ExpandableProps, ExpandableState>
{
    constructor ()
    {
        super();
        this.saveSong = this.saveSong.bind(this);
        this.loadSong = this.loadSong.bind(this);
        this.resetDisplay = this.resetDisplay.bind(this);
        this.nextSong = this.nextSong.bind(this);
        this.prevSong = this.prevSong.bind(this);

        this.state = {
            isReset: true,
            songsTitle: [],
            currentSongCounter: -1
        }
    }

    componentDidMount ()
    {
        localforage.getItem(`songsTitle`).then(value =>
        {
            if (value === null)
            {
                localforage.setItem(`songsTitle`, []);
                this.setState({ songsTitle: [] });
            }
            else
            {
                this.setState({ songsTitle: value as string[] });
            }
        });
    }

    saveSong ()
    {
        const song = this.props.grooveBox.getSong().saveGroove();

        if (song.title === 'Default_Groove')
        {
            const songName = prompt("Enter a unique song name : ", "song name here");

            if (!songName)
            {
                return;
            }

            if (this.state.songsTitle.includes(songName))
            {
                alert('this name already exists, try another name');

                return;
            }

            song.title = songName.trim().substring(0, 16);

            localforage.setItem(song.title, song).then(() =>
            {
                const { songsTitle } = this.state;

                songsTitle.push(song.title);

                localforage.setItem(`songsTitle`, songsTitle);

                this.setState({ songsTitle: songsTitle });

                this.props.grooveBox.getSong().setTitle(song.title);
            });

            return;
        }

        localforage.setItem(song.title, song).then(() =>
        {
            // const { songsTitle } = this.state;

            // songsTitle.push(song.title);

            // localforage.setItem(`songsTitle`, songsTitle);

            // this.setState({ songsTitle: songsTitle });
        });
    }

    loadSong ()
    {
        const { songsTitle, currentSongCounter } = this.state;

        localforage.getItem(songsTitle[currentSongCounter]).then(value =>
        {
            if (value)
            {
                this.props.grooveBox.setSong(value as Song);
            }
        });
    }

    resetDisplay ()
    {
        if (!this.state.isReset)
        {
            return;
        }

        this.setState({ isReset: false }, () =>
        {
            let timeOut = setTimeout(() =>
            {
                this.props.showName('reset', -1);

                this.setState({ isReset: false });

                timeOut = null;

            }, 4000)
        });
    }

    prevSong ()
    {
        const { currentSongCounter } = this.state;

        this.setState({ currentSongCounter: currentSongCounter - 1 });

        this.props.showName(this.state.songsTitle[currentSongCounter - 1], currentSongCounter - 1, 'SONG');

        this.resetDisplay();
    }

    nextSong ()
    {
        const { currentSongCounter } = this.state;

        if (currentSongCounter < this.state.songsTitle.length)
        {
            this.setState({ currentSongCounter: currentSongCounter + 1 });

            this.props.showName(this.state.songsTitle[currentSongCounter + 1], currentSongCounter + 1, 'SONG');

            this.resetDisplay();
        }
        else
        {
            this.setState({ currentSongCounter: 0 });

            this.props.showName(this.state.songsTitle[0], 0, 'SONG');

            this.resetDisplay();
        }
    }


    render ()
    {
        const { currentSongCounter, songsTitle } = this.state;

        return (
            <fieldset style={SongUIStyleBox}>
                <legend>SONG</legend>

                <div>
                    <button style={btnStyle} name="type" value='0' onClick={this.loadSong}>Load</button>
                    <button style={btnStyle} name="type" value='0' onClick={this.saveSong}>Save</button>
                </div>

                <div>
                    <button disabled={currentSongCounter <= 0} style={btnArrowStyle} name="type" value='0' onClick={this.prevSong}>⇦</button>
                    <button disabled={currentSongCounter === songsTitle.length} style={btnArrowStyle} name="type" value='0' onClick={this.nextSong}>⇨</button>
                </div>

            </fieldset>
        );
    }
}

const SongUIStyleBox = {
    position: 'fixed',
    top: 40,
    left: 758, // 691
    border: '3px solid var(--HOT_CINNAMON)',
    'border-radius': '6px',
    width: '86px',
    height: '107px',
}

const btnStyle = {
    width: '70',
    height: '21',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '2px solid var(--MALIBU)',
    'border-radius': '6px',
}

const btnArrowStyle = {
    width: '33',
    'background-color': 'var(--HAWKES_BLUE)',
    border: '2px solid var(--MALIBU)',
    'border-radius': '6px',
    'font-size': '18px',
    padding: 0
}
