export interface Option {
}
export interface DropdownLocation {
    top: number;
    left: number;
    width: number;
}
export interface Viewport {
    height: number;
    width: number;
    edgeIndent: number;
}
export interface OptionsLocation {
    style: {
        top: number;
        bottom: number;
        left: number;
        width: number;
    };
    scrollTop: number;
}
export interface OptionsSettings {
    viewport: Viewport;
    dropdownLocation: DropdownLocation;
    selectedOptionOffset: number;
    optionListHeight: number;
}
export declare class Dropdown {
    constructor();
    open(): void;
    close(): void;
    private options;
}
export declare class Options {
    constructor({node, screenEdgeIndent}: {
        node: any;
        screenEdgeIndent: any;
    });
    protected open({type, location, selectedIndex}: {
        type: any;
        location: any;
        selectedIndex: any;
    }): void;
    getOptionListNode(): any;
    getOptionNode(index: any): any;
    private node;
    private screenEdgeIndent;
    private options;
}
export declare class OptionsHTML {
    constructor({screenEdgeIndent}: {
        screenEdgeIndent: any;
    });
    render(): string;
    open({type, options, location, selectedIndex}: {
        type: any;
        options: any;
        location: any;
        selectedIndex: any;
    }): void;
    renderOption(option: any): string;
    private node;
    private options;
}
export declare class Select {
    constructor({viewport, dropdownLocation, selectedOptionOffset, optionListHeight}: OptionsSettings);
    getLocation(): OptionsLocation;
    private calculateTop();
    private calculateBottom(top);
    private hasTopOverflow(top);
    private calculateScrollTop(top);
    private viewport;
    private dropdownLocation;
    private selectedOptionOffset;
    private optionListHeight;
}
