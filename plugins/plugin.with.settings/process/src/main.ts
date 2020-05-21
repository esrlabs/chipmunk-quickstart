
import PluginIPCService, { ServiceState, ServiceSettings, Entry, ESettingType, IPCMessages, Field, ElementInputStringRef } from 'chipmunk.plugin.ipc';

/**
 * To create settings field we should use abstract class Field<T>.
 * T: string, boolean or number
 */
export class SomestringSetting extends Field<string> {

    /**
     * We should define reference to one of controller to render setting:
     */
    private _element: ElementInputStringRef = new ElementInputStringRef({
        placeholder: 'Test placeholder',
    });

    /**
     * Returns default value
     */
    public getDefault(): Promise<string> {
        return new Promise((resolve) => {
            resolve('');
        });
    }

    /**
     * Validation of value. Called each time user change it. Also called before save data into
     * setting file.
     * Should reject on error and resolve on success.
     */
    public validate(state: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof state !== 'string') {
                return reject(new Error(`Expecting string type for "SomestringSetting"`));
            }
            if (state.trim() !== '' && (state.length < 5 || state.length > 15)) {
                return reject(new Error(`${state.length} isn't valid length. Expected 5 < > 15`));
            }
            resolve();
        });
    }

    /**
     * Should return reference to render component
     */
    public getElement(): ElementInputStringRef {
        return this._element;
    }

}

class Plugin {

    constructor() {
        this._setup();
        this._read();
    }

    private _setup() {
        // Create a group (section) for settings
        ServiceSettings.register(new Entry({
            key: 'testBEEntry',
            path: '', // Put settings into root of settings tree
            name: 'Backend Plugin Settings',
            desc: 'This is some kind of settings, delivered from backend',
            type: ESettingType.standard,
        })).then(() => {
            console.log(`Group is registred`);
            ServiceSettings.register(new SomestringSetting({
                key: 'pluginBESetting',
                path: 'testBEEntry',
                name: 'BE String setting',
                desc: 'This is test of string setting',
                type: ESettingType.standard,
                value: '',
            })).then(() => {
                console.log(`Setting is registred`);
            }).catch((error: Error) => {
                console.log(`Fail due: ${error.message}`);
            });
        }).catch((error: Error) => {
            console.log(`Fail due: ${error.message}`);
        });

    }

    private _read() {
        // Read some settings
        ServiceSettings.get<boolean>('PluginsUpdates', 'general.plugins').then((value: boolean) => {
            console.log(value);
        }).catch((error: Error) => {
            console.log(error);
        });
    }

}

const app: Plugin = new Plugin();

// Notify core about plugin
ServiceState.accept().catch((err: Error) => {
    console.log(`Fail to notify core about plugin due error: ${err.message}`);
});