export class DiagramRenderer {
    static page(page?: PageData | null): string;
    constructor(pages: PageData[]);
    links(): string;
    linksToPage(page: PageData): string;
    linksFromPage(page: PageData): string;
    #private;
}
import type { PageData } from '../shared/types';
//# sourceMappingURL=diagram-renderer.d.ts.map