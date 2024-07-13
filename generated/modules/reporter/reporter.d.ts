export class Reporter {
    constructor(outputDirectory: string);
    cleanOutput(): Promise<void>;
    createReport(pages: PageData[]): Promise<string>;
    #private;
}
import type { PageData } from '../shared/types.js';
//# sourceMappingURL=reporter.d.ts.map