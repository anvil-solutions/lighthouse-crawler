export class Crawler {
    constructor(startUrl: string, logger: Logger | null);
    crawl(url?: string): Promise<void>;
    getResults(): PageData[];
    #private;
}
import type { PageData } from '../shared/types.js';
import type { Logger } from 'pino';
//# sourceMappingURL=crawler.d.ts.map