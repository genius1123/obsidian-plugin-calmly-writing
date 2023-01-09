import { App, FileSystemAdapter, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, TypewriterSoundSettings, TypewriterSoundSettingsTab } from './settings';
import { window_onkeydown } from "./keydown";
import * as path from 'path';
import player, { PlayerConfig } from './player';


export default class TypewriterSound extends Plugin {
	settings: TypewriterSoundSettings;

    private _basePath: string = this.app.vault.adapter.getBasePath() + "\\.obsidian\\plugins\\calmly-writing\\src"

    private returnNew: string = path.join(this._basePath, 'sound', 'return-new.mp3');
    private _deleteAudio: string = path.join(this._basePath, 'sound', 'delete.mp3');
    private _otherKeysAudio: string = path.join(this._basePath, 'sound', 'key.mp3');
    private _cutAudio: string = path.join(this._basePath, 'sound', 'cut.mp3');
    private _pasteAudio: string = path.join(this._basePath, 'sound', 'paste.mp3');
    private _enterAudio: string = path.join(this._basePath, 'sound', 'enter.mp3');
    private _tabAudio: string = path.join(this._basePath, 'sound', 'tab.mp3');
    private _arrowsAudio: string = path.join(this._basePath, 'sound', 'arrow.mp3');

	async onload() {
		this.addSettingTab(new TypewriterSoundSettingsTab(this.app, this));
		await this.loadSettings();
		console.log(this._deleteAudio);
		console.log('player',player)
		

		document.onkeydown = (e) => { window_onkeydown(e); }
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
