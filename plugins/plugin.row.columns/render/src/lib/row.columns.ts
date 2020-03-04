import * as Toolkit from 'chipmunk.client.toolkit';
import { ColumnsAPI } from './row.columns.api';

export class Columns extends Toolkit.TypedRowRender<ColumnsAPI> {

    private _api: ColumnsAPI = new ColumnsAPI();

    constructor() {
        super();
    }

    public getType(): Toolkit.ETypedRowRenders {
        return Toolkit.ETypedRowRenders.columns;
    }

    public isTypeMatch(sourceName: string, sourceMeta?: string): boolean {
        return sourceName.search(/\.csv$/gi) !== -1;
    }

    public getAPI(): ColumnsAPI {
        return this._api;
    }

}
