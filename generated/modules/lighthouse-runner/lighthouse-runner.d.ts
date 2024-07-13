export class LighthouseRunner {
    static onList(outputDirectory: string, pages: PageData[], logger: Logger | null): Promise<PageData[]>;
    constructor(outputDirectory: string);
    run(url: string): Promise<LighthouseResult | null>;
    kill(): Promise<void>;
    #private;
}
import type { LighthouseResult } from '../shared/types.js';
import type { PageData } from '../shared/types.js';
import type { Logger } from 'pino';
//# sourceMappingURL=lighthouse-runner.d.ts.map