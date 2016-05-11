export interface Viewport {
    height: number;
    width: number;
    edgeIndent: number;
}
export interface BoundingRectangle {
    left: number;
    top: number;
    bottom: number;
    width: number;
}
export interface OptionSettings {
    height: number;
    minHeight: number;
    selectedOffset: number;
}
export interface DropdownSettings {
    viewport: Viewport;
    button: BoundingRectangle;
    options: OptionSettings;
}
export interface OptionsLocation {
    boundingRectangle: BoundingRectangle;
    scrollTop: number;
}
export declare class OptionsHTML {
    constructor({screenEdgeIndent, minHeight}: {
        screenEdgeIndent?: number;
        minHeight?: number;
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
export declare class Options {
    constructor({node, screenEdgeIndent, minHeight}: {
        node: any;
        screenEdgeIndent: any;
        minHeight: any;
    });
    open({type, location, selectedIndex}: {
        type: any;
        location: any;
        selectedIndex: any;
    }): void;
    getOptionListNode(): any;
    getOptionNode(index: any): any;
    private node;
    private screenEdgeIndent;
    private minHeight;
    private options;
}
export declare class Select {
    constructor({viewport, button, options}: DropdownSettings);
    getLocation(): OptionsLocation;
    private viewport;
    private options;
    private button;
    private getVerticalPosition(baseTop, baseBottom);
    private getScrollTop(baseTop);
    private getOverflowedPosition(currentSideName, baseValues);
    private getButtonDistanceToEdge(edgeName);
    private getSmallModePosition(currentSideName, oppositeSideName);
    private gerSmallModeTop(currentSide);
    private gerSmallModeBottom(currentSide);
    private hasOverflow(offset);
    private capitalize(str);
}
