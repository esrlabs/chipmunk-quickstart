/*
 * Public API Surface of terminal
 */

import { Columns } from './lib/row.columns';

const columns = new Columns();

// For Angular based plugin would be enough to make export with instance of
// render. No needs to use gateway
export { columns };
