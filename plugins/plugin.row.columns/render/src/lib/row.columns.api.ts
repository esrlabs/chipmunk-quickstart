import * as Toolkit from 'chipmunk.client.toolkit';

// Delimiter for CSV files.
export const CDelimiters = [';', ',', '\t'];

// For now chipmunk supports only predefined count of columns. Developer cannot change 
// it dynamically. Here we are defining a columns headers
export const CColumnsHeaders = [
    'A',
    'B',
    'C',
    'D',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
];

let delimiter: string | undefined;

/**
 * @class ColumnsAPI
 * @description Implementation of custom row's render, based on TypedRowRenderAPIColumns
 */
export class ColumnsAPI extends Toolkit.TypedRowRenderAPIColumns {

    constructor() {
        super();
    }

    /**
     * Returns list of column's headers
     * @returns { string[] } - column's headers
     */
    public getHeaders(): string[] {
        return CColumnsHeaders;
    }

    /**
     * Should returns parsed row value as array of columns. Length of columns here
     * should be equal to length of columns (see getHeaders)
     * @param str { string } - string value of row
     * @returns { string[] } - values of columns for row
     */
    public getColumns(str: string): string[] {
        const columns: string[] = str.split(this._getDelimiter(str));
        // Because we don't know, how much columns file will have, we are adding missed
        // or removing no needed columns
        if (columns.length < CColumnsHeaders.length) {
            for (let i = CColumnsHeaders.length - columns.length; i >= 0; i += 1) {
                columns.push('-');
            }
        } else if (columns.length > CColumnsHeaders.length) {
            const rest: string[] = columns.slice(CColumnsHeaders.length - 2, columns.length);
            columns.push(rest.join(this._getDelimiter(str)));
        }
        return columns;
    }

    /**
     * This method will be called by chipmunk's core once before render column's headers.
     * @returns { Array<{ width: number, min: number }> } - default width and minimal width for
     * each column
     */
    public getDefaultWidths(): Array<{ width: number, min: number }> {
        return [
            { width: 50, min: 30 },
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

    private _getDelimiter(input: string): string {
        if (delimiter !== undefined) {
            return delimiter;
        } else {
            let score: number = 0;
            CDelimiters.forEach((del: string) => {
                let length = input.split(del).length;
                if (length > score) {
                    score = length;
                    delimiter = del;
                }
            });    
        }
        return delimiter;        
    }

}
