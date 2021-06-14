import Pattern from "./Pattern";

export default class Song
{
    public id: number;
    public title: string;
    public patterns: Pattern[] = [];
    public drumKitNames: string[] = ['sample0', 'sample1', 'sample2', 'sample3', 'sample4', 'sample5', 'sample6', 'sample7'];
    public bpm: number = 120;

    constructor (id: number, title: string)
    {
        this.id = 0;
        this.setTitle(title);

        this.init();
    }

    private init (): void
    {
        for (let i = 0; i < 16; i += 1)
        {
            const pattern = new Pattern(i);
            this.patterns.push(pattern);
            this.drumKitNames.length = 8;
        }
    }

    public getPatterns (): Pattern[]
    {
        try
        {
            return this.patterns;
        }
        catch (error)
        {
            throw new Error(`unknown patterns: , ${error}`);
        }
    }

    public getPattern (id: number): Pattern
    {
        try
        {
            return this.patterns[id];
        }
        catch (error)
        {
            throw new Error(`unknown pattern with id: ${id}, ${error}`);
        }
    }

    public getTitle (): string
    {
        return this.title;
    }

    public setTitle (title: string): void
    {
        this.title = title.trim().substring(0, 16);
    }

    public getBpm (): number
    {
        return this.bpm;
    }

    public setBpm (bpm: number): number
    {
        if (bpm > 39 && bpm < 241)
        {
            this.bpm = bpm;
        }

        return this.bpm;
    }

    loadGroove (song: Song)
    {
        this.patterns.forEach((pattern, i) =>
        {
            pattern.tracks.forEach((track, j) =>
            {
                const config = {
                    level: song.patterns[i].tracks[j].level,
                    vcf: song.patterns[i].tracks[j].vcf,
                    env: song.patterns[i].tracks[j].env,
                    analogSynthParams: song.patterns[i].tracks[j].analogSynthParams,
                    drumParams: song.patterns[i].tracks[j].drumParams,
                    fx: song.patterns[i].tracks[j].fx,
                    name: song.patterns[i].tracks[j].name,
                    pan: song.patterns[i].tracks[j].pan
                }

                track.setTrackConfig(config);
                track.bar = song.patterns[i].tracks[j].bar;
            });
            pattern.maxBarId = song.patterns[i].maxBarId;
        });

        this.drumKitNames = song.drumKitNames;

        this.setTitle(song.title);

        this.setBpm(song.bpm);
    }

    saveGroove ()
    {
        return {
            id: this.id,
            title: this.title,
            patterns: this.patterns,
            bpm: this.bpm,
            drumKitNames: this.drumKitNames
        }
    }
}

