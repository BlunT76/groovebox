# Imp GrooveBox
Experimentation and learning of webaudio.
- 16 pattern of 8 drum tracks and 8 synth tracks
- step sequencer with 1 to 16 bar, 40 to 240 bpm
- mono synth, 2 osc, 1 noise, 1 lfo
- import of wav sample
- 5 fx: distortion, eq 3 band, flanger, delay, reverb
... wip

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Writing Code

Download the repo, **DON'T CLONE** it, run `npm install` from your project directory. Then, you can start the local development
server by running `npm start`.

After starting the development server with `npm start`, you can edit any files in the `src` folder
and webpack will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |