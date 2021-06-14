import { h, render } from "preact";
import App from './ui/App';

// @ts-ignore
window.AudioContext = window.AudioContext || window.webkitAudioContext;

const app = h(App, null);

render(app, document.body);
