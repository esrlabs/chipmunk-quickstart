// tslint:disable: max-classes-per-file

import * as Toolkit from 'chipmunk.client.toolkit';
import { Field, ElementInputStringRef, IField } from 'chipmunk.client.toolkit';

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
            if (state.trim() !== '' && (state.length < 3 || state.length > 10)) {
                return reject(new Error(`${state.length} isn't valid length. Expected 3 < > 10`));
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

/**
 * Create service (to have access to chipmunk API)
 */
class Service extends Toolkit.APluginService {
    constructor() {
        super();
        // Listen moment when API will be available
        this.onAPIReady.subscribe(() => {
            this.read();
            this.setup();
        });
    }

    public setup() {
        const api: Toolkit.IAPI | undefined = this.getAPI();
        if (api === undefined) {
            return;
        }
        // Create a group (section) for settings
        api.getSettingsAPI().register(new Toolkit.Entry({
            key: 'selectionparser',
            path: '', // Put settings into root of settings tree
            name: 'Datetime Converter',
            desc: 'Converter any format to datetime format',
            type: Toolkit.ESettingType.standard,
        }));
        // Create setting
        api.getSettingsAPI().register(new SomestringSetting({
            key: 'pluginselectionparser',
            path: 'selectionparser',
            name: 'String setting',
            desc: 'This is test of string setting',
            type: Toolkit.ESettingType.standard,
            value: '',
        }));
    }

    public read() {
        const api: Toolkit.IAPI | undefined = this.getAPI();
        if (api === undefined) {
            return;
        }
        // Read some settings
        api.getSettingsAPI().get<boolean>('PluginsUpdates', 'general.plugins').then((value: boolean) => {
            console.log(value);
        }).catch((error: Error) => {
            console.log(error);
        });
    }
}

// To create selection parse we should extend class from SelectionParser class
// Our class should have at least two public methods:
// - getParserName(selection: string): string | undefined
// - parse(selection: string, themeTypeRef: Toolkit.EThemeType)
// tslint:disable-next-line: max-classes-per-file
export class SelectionParser extends Toolkit.SelectionParser {

    /**
     * Method with be called by chipmunk before show context menu in main view.
     * If selection acceptable by parser, method should return name on menu item
     * in context menu of chipmunk.
     * If selection couldn't be parsered, method should return undefined. In this
     * case menu item in context menu for this parser will not be show.
     * @param selection { string } - selected text in main view of chipmunk
     * @returns { string } - name of menu item in context menu
     * @returns { undefined } - in case if menu item should not be shown in context menu
     */
    public getParserName(selection: string): string | undefined {
        const date: Date | undefined = this._getDate(selection);
        return date instanceof Date ? 'Convert to DateTime' : undefined;
    }

    /**
     * Method with be called by chipmunk if user will select menu item (see getParserName)
     * in context menu of selection in main view.
     * @param selection { string } - selected text in main view of chipmunk
     * @param themeTypeRef { EThemeType } - name of current color theme
     * @returns { string } - parsed string
     */
    public parse(selection: string, themeTypeRef: Toolkit.EThemeType): string {
        const date: Date | undefined = this._getDate(selection);
        return date !== undefined ? date.toUTCString() : '';
    }

    private _getDate(selection: string): Date | undefined {
        const num: number = parseInt(selection, 10);
        if (!isFinite(num) || isNaN(num)) {
            return undefined;
        }
        const date: Date = new Date(num);
        return date instanceof Date ? date : undefined;
    }

}

// To delivery plugin into chipmunk we should use chipmunk's gateway
// It's stored in global variable "chipmunk"
// Gateway has a method "setPluginExports". With this method we can
// define a list of exported parsers.
const gate: Toolkit.PluginServiceGate | undefined = (window as any).chipmunk;
if (gate === undefined) {
    // This situation isn't possible, but let's check it also
    console.error(`Fail to find chipmunk gate.`);
} else {
    gate.setPluginExports({
        // Name of property (in this case it's "datetime" could be any. Chipmunk doesn't check
        // a name of property, but detecting a parent class.
        datetime: new SelectionParser(),
        // Share service with chipmunk
        service: new Service(),
    });
}
