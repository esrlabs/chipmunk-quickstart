import * as Toolkit from 'chipmunk.client.toolkit';
import { ColumnsAPI } from './row.columns.api';

/**
 * @class Columns
 * @description Chipmunk supports custom renders for rows. It means, before row 
 * (in main view and view of search result) will be show, chipmunk will apply 
 * available custom renders. Render could be bound with type of income data. 
 * For example with type of opened file.
 * To bind render with type of income data developer should use abstract class
 * TypedRowRender. As generic class, developer should provide render, which
 * should be used for such data. 
 * In this example we are using predefined render of columns
 */
export class Columns extends Toolkit.TypedRowRender<ColumnsAPI> {

    // Store instance of custom render to avoid recreating of it with each new
    // chipmunk's core request
    private _api: ColumnsAPI = new ColumnsAPI();

    constructor() {
        super();
    }

    /**
     * This method will be called by chipmunk to detect, which kind of render we are
     * going to use.
     * @returns { ETypedRowRenders } - tells chipmunk's core, which kind of render will be used
     */
    public getType(): Toolkit.ETypedRowRenders {
        // We will use columns render.
        return Toolkit.ETypedRowRenders.columns;
    }

    /**
     * This method will be called for each row in main view and view of search results
     * @param sourceName { string } - name of source of incoming data. For example for file
     * it will be filename. For plugin - plugin name.
     * @param sourceMeta { string } - optional data, which could better describe incoming data.
     * For example for text file it will be "plain/text"; for DLT file - "dlt"
     * @returns { boolean } - in "true" custom render will be applied for row; in "false" custom
     * render will be ignored
     */
    public isTypeMatch(sourceName: string, sourceMeta?: string): boolean {
        // In this example, we are creating custom render for CSV file, to show its content
        // as columns.
        // So, let's just check file name for expected extension.
        return sourceName.search(/\.csv$/gi) !== -1;
    }

    /**
     * Caller for API of custom render. Would be called by chipmunk's core for each row, which returns
     * "true" via "isTypeMatch"
     * @returns { Class }
     */
    public getAPI(): ColumnsAPI {
        return this._api;
    }

}
