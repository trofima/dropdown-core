export interface Option {
}
export interface DropdownLocation {
    top: number;
    left: number;
    width: number;
}
export interface Screen {
    height: number;
    width: number;
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
    screen: Screen;
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
    constructor();
    protected open({type, location, selectedOptionNode, optionListNode}: {
        type: any;
        location: any;
        selectedOptionNode: any;
        optionListNode: any;
    }): void;
    private locate();
    private scroll();
    private dropdown;
}
export declare class OptionsHTML {
    constructor();
    render(): string;
    open({type, options, location}: {
        type: any;
        options: any;
        location: any;
    }): void;
    renderOption(option: any): string;
    getOptionListNode(): any;
    getOptionNode(index: any): any;
    private node;
    private options;
}
export declare class Select {
    constructor({screen, dropdownLocation, selectedOptionOffset, optionListHeight}: OptionsSettings);
    getLocation(): OptionsLocation;
    private screen;
    private dropdownLocation;
    private selectedOptionOffset;
    private optionListHeight;
}
