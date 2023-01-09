
import * as path from 'path';
import player, { PlayerConfig } from './player';

const _basePath: string = app.vault.adapter.getBasePath() + "\\.obsidian\\plugins\\calmly-writing\\src"

// const returnNew: string = path.join(_basePath, 'sound', 'return-new.mp3');
// const _deleteAudio: string = path.join(_basePath, 'sound', 'delete.mp3');
// const _otherKeysAudio: string = path.join(_basePath, 'sound', 'key.mp3');
// const _cutAudio: string = path.join(_basePath, 'sound', 'cut.mp3');
// const _pasteAudio: string = path.join(_basePath, 'sound', 'paste.mp3');
// const _enterAudio: string = path.join(_basePath, 'sound', 'enter.mp3');
// const _tabAudio: string = path.join(_basePath, 'sound', 'tab.mp3');
// const _arrowsAudio: string = path.join(_basePath, 'sound', 'arrow.mp3');


const returnNew: string = path.join(_basePath, 'sound', 'return-new.wav');
const _deleteAudio: string = path.join(_basePath, 'sound', 'delete.wav');
const _otherKeysAudio: string = path.join(_basePath, 'sound', 'key.wav');
const _cutAudio: string = path.join(_basePath, 'sound', 'cut.wav');
const _pasteAudio: string = path.join(_basePath, 'sound', 'paste.wav');
const _enterAudio: string = path.join(_basePath, 'sound', 'enter.wav');
const _tabAudio: string = path.join(_basePath, 'sound', 'tab.wav');
const _arrowsAudio: string = path.join(_basePath, 'sound', 'arrow.wav');


let config: PlayerConfig = {
    macVol: 1,
    winVol: 100,
    linuxVol: 100
};


export const window_onkeydown = function (e) {
	console.log('====================================');
	console.log(e);
	console.log('====================================');
	console.log(returnNew);
	console.log('returnNew',returnNew)
	
	player.play(_deleteAudio, config);
}
