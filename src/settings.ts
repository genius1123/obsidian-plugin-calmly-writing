import { App, PluginSettingTab, Setting } from 'obsidian';
import TypewriterSound from './main';

export interface TypewriterSoundSettings {
	isTypewriterSoundOpen: boolean;
}

export const DEFAULT_SETTINGS: TypewriterSoundSettings = {
	isTypewriterSoundOpen: true,
};

export class TypewriterSoundSettingsTab extends PluginSettingTab {
	plugin: TypewriterSound;

	constructor(app: App, plugin: TypewriterSound) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h3', { text: 'General settings' });

		// 切换icon图标
		new Setting(containerEl)
			.setName('Toggle')
			.setDesc('Toggle this OFF if you want to close it')
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.isTypewriterSoundOpen).onChange((value) => {
					this.plugin.settings.isTypewriterSoundOpen = value;
					this.plugin.saveSettings();
				}),
			);
	}
}
