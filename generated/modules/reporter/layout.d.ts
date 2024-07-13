export class Layout {
    static from(layout: Layout): Layout;
    static fromAssets(name: string): Promise<Layout>;
    constructor(layout: string);
    addVariable(key: string, value: string | Layout): Layout;
    toString(): string;
    #private;
}
//# sourceMappingURL=layout.d.ts.map