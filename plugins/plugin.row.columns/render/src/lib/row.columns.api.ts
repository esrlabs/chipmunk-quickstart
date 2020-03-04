import * as Toolkit from 'chipmunk.client.toolkit';

export const CDelimiter = ';';

export const CColumnsHeaders = [
    'Column 1',
    'Column 2',
    'Column 3',
    'Column 4',
    'Column 5',
    'Column 6',
    'Column 7',
    'Column 8',
    'Column 9',
    'Column 10',
];

export class ColumnsAPI extends Toolkit.TypedRowRenderAPIColumns {

    constructor() {
        super();
    }

    public getHeaders(): string[] {
        return CColumnsHeaders;
    }

    public getColumns(str: string): string[] {
        const columns: string[] = str.split(CDelimiter);
        if (columns.length < CColumnsHeaders.length) {
            for (let i = CColumnsHeaders.length - columns.length; i >= 0; i += 1) {
                columns.push('-');
            }
        } else if (columns.length > CColumnsHeaders.length) {
            const rest: string[] = columns.slice(CColumnsHeaders.length - 2, columns.length);
            columns.push(rest.join(CDelimiter));
        }
        return columns;
    }

    public getDefaultWidths(): Array<{ width: number, min: number }> {
        return [
            { width: 150, min: 30 },
            { width: 50, min: 30 },
            { width: 50, min: 30 },
            { width: 50, min: 30 },
            { width: 50, min: 30 },
            { width: 50, min: 30 },
            { width: 50, min: 30 },
            { width: 50, min: 30 },
            { width: 50, min: 30 },
            { width: 50, min: 30 },
        ];
    }

}
