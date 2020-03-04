import * as Toolkit from 'chipmunk.client.toolkit';

// To create selection parse we should extend class from SelectionParser class
// Our class should have at least two public methods:
// - getParserName(selection: string): string | undefined
// - parse(selection: string, themeTypeRef: Toolkit.EThemeType)
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
        try {
            const date: Date = new Date(selection);
            return this._isValidDate(date) ? 'Convert to DateTime' : undefined;
        } catch (e) {
            // Selection cannot be coverted into DateTime.
            // Return undefined to do NOT show parser in context menu
            return undefined;
        }
    }

    /**
     * Method with be called by chipmunk if user will select menu item (see getParserName)
     * in context menu of selection in main view.
     * @param selection { string } - selected text in main view of chipmunk
     * @param themeTypeRef { EThemeType } - name of current color theme
     * @returns { string } - parsed string
     */
    public parse(selection: string, themeTypeRef: Toolkit.EThemeType): string {
        return (new Date(selection)).toUTCString();
    }

    private _isValidDate(date: Date | number) {
        const num: number = date as number;
        return date instanceof Date && !isNaN(num);
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
    });
}
