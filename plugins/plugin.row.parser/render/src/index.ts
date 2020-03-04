import * as Toolkit from 'chipmunk.client.toolkit';
import { default as AnsiUp } from 'ansi_up';

const ansiup = new AnsiUp();
ansiup.escape_for_html = false;

const REGS = {
    COLORS: /\x1b\[[\d;]{1,}[mG]/,
    COLORS_GLOBAL: /\x1b\[[\d;]{1,}[mG]/g,
};

const ignoreList: { [key: string]: boolean } = {};

// To create selection parse we should extend class from RowCommonParser class
// Our class should have at least one public methods:
// - parse(str: string, themeTypeRef: Toolkit.EThemeType, row: Toolkit.IRowInfo)
export class ASCIIColorsParser extends Toolkit.RowCommonParser {

    /**
     * Method with be called by chipmunk for each row in main view and search results view.
     * @param str { string } - row value as string
     * @param themeTypeRef { EThemeType } - name of current color theme
     * @param row { IRowInfo } - information about row
     * @returns { string } - parsed row as string. It can include HTML tags
     */
    public parse(str: string, themeTypeRef: Toolkit.EThemeType, row: Toolkit.IRowInfo): string {
        if (typeof row.sourceName === "string") {
            if (ignoreList[row.sourceName] === undefined) {
                ignoreList[row.sourceName] = row.sourceName.search(/\.dlt$/gi) !== -1;
            }
            if (!ignoreList[row.sourceName]) {
                if (row.hasOwnStyles) {
                    // Only strip ANSI escape-codes
                    return str.replace(REGS.COLORS_GLOBAL, "");
                } else if (REGS.COLORS.test(str)) {
                    // ANSI escape-codes to html color-styles
                    return ansiup.ansi_to_html(str);
                }
            }
        }
        return str;
    }
}

// To delivery plugin into chipmunk we should use chipmunk's gateway
// It's stored in global variable "chipmunk"
// Gateway has a method "setPluginExports". With this method we can
// define a list of exported parsers.
const gate: Toolkit.PluginServiceGate | undefined = (window as any).logviewer;
if (gate === undefined) {
    console.error(`Fail to find chipmunk gate.`);
} else {
    gate.setPluginExports({
        // Name of property (in this case it's "ascii" could be any. Chipmunk doesn't check
        // a name of property, but detecting a parent class.
        ascii: new ASCIIColorsParser(),
    });
}
