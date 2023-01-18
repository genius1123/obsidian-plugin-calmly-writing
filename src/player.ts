const cp = require('child_process');
const path = require('path');
const player = require('play-sound')();


const _isWindows = process.platform === 'win32';
const _playerWindowsPath = path.join(app.vault.adapter.getBasePath() + "\\.obsidian\\plugins\\calmly-writing\\src", 'sound', 'sounder.exe');
console.log('_playerWindowsPath',_playerWindowsPath)

export interface PlayerConfig {
    /**
     * Specify volume of the sounds
     */
    macVol: number;
    winVol: number;
    linuxVol: number;
}

const playerAdapter = (opts: PlayerConfig) => ({
    afplay: ['-v', opts.macVol],
    mplayer: ['-af', `volume=${opts.linuxVol}`],
});



export default {
    play(filePath: string, config: PlayerConfig) : Promise<void> {
		console.log("play", "play");
		
        return new Promise ((resolve, reject) => {
            if (_isWindows) {
				console.log("asdfasfdasdfasdfasdf");
				console.log('cp',cp)
                cp.execFile(_playerWindowsPath, ['/vol', config.winVol, filePath]);
                resolve();
            } else {
				console.log(123123123);
				
                player.play(filePath, playerAdapter(config), (err: any) => {
                if (err) {
                    console.error("Error playing sound:", filePath, " - Description:", err);
                    return reject(err);
                }
                    resolve();
                });
            }
        });
    }
};
