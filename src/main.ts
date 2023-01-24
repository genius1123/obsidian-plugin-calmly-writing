import { App, FileSystemAdapter, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, TypewriterSoundSettings, TypewriterSoundSettingsTab } from './settings';
import { window_onkeydown } from "./keydown";
import {debounce}  from 'loadsh';


export default class TypewriterSound extends Plugin {
	settings: TypewriterSoundSettings;

	async onload() {
		this.addSettingTab(new TypewriterSoundSettingsTab(this.app, this));
		await this.loadSettings();
		

		document.onkeydown = debounce((e) => { window_onkeydown(e); }, 100)
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
