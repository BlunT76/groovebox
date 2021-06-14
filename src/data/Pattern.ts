import { TRACK_NAMES } from "../constant/TRACK_NAMES";
import { T16range } from "../types/types";
import Track from "./Track";

export default class Pattern
{
    id: number;
    tracks: Track[] = [];
    public maxBarId: T16range = 0;

    constructor (id: number)
    {
        this.id = id;
        this.init();
    }

    private init (): void
    {
        for (let i = 0; i < 16; i += 1)
        {
            const track = new Track(i, TRACK_NAMES[i]);
            this.tracks.push(track);
        }
    }

    public getTracks (): Track[]
    {
        try {
            return this.tracks;
        }
        catch (error)
        {
            throw new Error(`unknown tracks: ${error}`);
        }
    }

    public setTracks (tracks: Track[])
    {
        this.tracks = tracks;
    }

    public getTrack (id: number): Track
    {
        return this.tracks[id];
    }

    public setTrack (track: Track)
    {
        this.tracks[track.id] = track;
    }
}