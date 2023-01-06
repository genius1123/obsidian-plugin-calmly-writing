import { App, FileSystemAdapter, Plugin, addIcon } from 'obsidian';
import { DEFAULT_SETTINGS, OpenVSCodeSettings, OpenVSCodeSettingsTab } from './settings';

const svg = `
<svg role="img" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <title>calmly writing</title>
    <path
		fill="currentColor"
		d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
	/>
</svg>
`;

addIcon('calmly-writing-logo', svg);

type AppWithPlugins = App & {
	plugins: {
		disablePlugin: (id: string) => unknown;
		enablePlugin: (id: string) => unknown;
		enabledPlugins: Set<string>;
		plugins: Record<string, any>;
	};
};

let DEV = false;

export default class OpenVSCode extends Plugin {
	ribbonIcon: HTMLElement;
	settings: OpenVSCodeSettings;

	async onload() {
		this.addSettingTab(new OpenVSCodeSettingsTab(this.app, this));
		await this.loadSettings();

		this.refreshIconRibbon();

		this.addCommand({
			id: 'open-vscode',
			name: 'Open as Visual Studio Code workspace',
			callback: this.openVSCode.bind(this),
		});

		this.addCommand({
			id: 'open-vscode-via-url',
			name: 'Open as Visual Studio Code workspace using a vscode:// URL',
			callback: this.openVSCodeUrl.bind(this),
		});

		DEV =
			(this.app as AppWithPlugins).plugins.enabledPlugins.has('hot-reload') &&
			(this.app as AppWithPlugins).plugins.plugins['hot-reload'].enabledPlugins.has(this.manifest.id);

		if (DEV) {
			this.addCommand({
				id: 'open-vscode-reload',
				name: 'Reload the plugin in dev',
				callback: this.reload.bind(this),
			});

			this.addCommand({
				id: 'open-vscode-reset-settings',
				name: 'Reset plugins settings to default in dev',
				callback: this.resetSettings.bind(this),
			});
		}
	}

	async openVSCode() {
		if (!(this.app.vault.adapter instanceof FileSystemAdapter)) {
			return;
		}
		const { executeTemplate } = this.settings;

		const path = this.app.vault.adapter.getBasePath();
		const file = this.app.workspace.getActiveFile();
		const filePath = file?.path ?? '';

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { exec } = require('child_process');

		let command = executeTemplate.trim() === '' ? DEFAULT_SETTINGS.executeTemplate : executeTemplate;
		command = replaceAll(command, '{{vaultpath}}', path);
		command = replaceAll(command, '{{filepath}}', filePath);
		if (DEV) console.log('[openVSCode]', { command });
		exec(command, (error: never, stdout: never, stderr: never) => {
			if (error) {
				console.error(`[openVSCode] exec error: ${error}`);
			}
		});
	}

	async openVSCodeUrl() {
		if (!(this.app.vault.adapter instanceof FileSystemAdapter)) {
			return;
		}
		const { openFile, useUrlInsiders } = this.settings;

		const path = this.app.vault.adapter.getBasePath();
		const file = this.app.workspace.getActiveFile();
		const filePath = file?.path ?? '';
		if (DEV)
			console.log('[open-vscode]', {
				settings: this.settings,
				path,
				filePath,
			});

		// https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls
		const protocol = useUrlInsiders ? 'vscode-insiders://' : 'vscode://';
		let url = `${protocol}file/${path}`;

		if (openFile) {
			url += `/${filePath}`;
			/*
			By default, opening a file via the vscode:// URL will cause that file to open
			in the front-most window in VSCode. We assume that it is preferred that files from
			Obsidian should all open in the same workspace.

			As a workaround, we issue two open requests to VSCode in quick succession: the first to
			bring the workspace to front, the second to open the file.

			There is a ticket requesting this feature for VSCode:
			https://github.com/microsoft/vscode/issues/150078
			*/

			// HACK: first open the _workspace_ to bring the correct window to the front....
			const workspacePath = replaceAll(this.settings.workspacePath, '{{vaultpath}}', path);
			window.open(`vscode://file/${workspacePath}`);

			// ...then open the _file_ in a setTimeout callback to allow time for the workspace to be activated
			setTimeout(() => {
				if (DEV) console.log('[openVSCode]', { url });
				window.open(url);
			}, 200); // anecdotally, this seems to be the min required for the workspace to activate
		} else {
			if (DEV) console.log('[openVSCode]', { url });
			window.open(url);
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	refreshIconRibbon = () => {
		this.ribbonIcon?.remove();
		if (this.settings.ribbonIcon) {
			this.ribbonIcon = this.addRibbonIcon('vscode-logo', 'calmly-writing', () => {
				const ribbonCommand = this.settings.ribbonCommandUsesCode ? 'openVSCode' : 'openVSCodeUrl';
				this[ribbonCommand]();
			});
		}
	};

	/**
	 * [pjeby](https://forum.obsidian.md/t/how-to-get-started-with-developing-a-custom-plugin/8157/7)
	 *
	 * > ...while doing development, you may need to reload your plugin
	 * > after making changes. You can do this by reloading, sure, but it’s easier
	 * > to just go to settings and then toggle the plugin off, then back on again.
	 * >
	 * > You can also automate this process from within the plugin itself, by
	 * > including a command that does something like this:
	 */
	async reload() {
		const id = this.manifest.id;
		const plugins = (this.app as AppWithPlugins).plugins;
		await plugins.disablePlugin(id);
		await plugins.enablePlugin(id);
		console.log('[open-vscode] reloaded', this);
	}

	async resetSettings() {
		console.log('[open-vscode]', { old: this.settings, DEFAULT_SETTINGS });
		this.settings = DEFAULT_SETTINGS;
		await this.saveData(this.settings);
	}
}

// https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
function escapeRegExp(string: string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAll(str: string, find: string, replace: string) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
