'use strict';
// import {Options} from "./";

// var template = `
//     <section class="dropdown-options {this.state.className} {this.state.visible ? 'expanded' : ''}">
//         <div class="options" ref="options" onWheel="{this.wheelScroll}" onScroll="{this.handleScroll}" tabindex="0" onMouseLeave="{this.onMouseLeave}" onMouseDown="(e) => e.nativeEvent.stopImmediatePropagation()">
//             <i class="top arrow" onMouseEnter="() => this.scrollTo(-1)" onMouseLeave="{this.stopScrollAnimation}">
//                 <symbols.symbol name="arrowDown"></symbols.symbol>
//             </i>
//
//             <header>input for combobox</header>
//
//             <ol class="list" ref="list">{this.getCached('options')}</ol>
//
//             <footer rt-if="this.getCached('footer')" class="options-footer" ref="footer" key="options-footer">{this.getCached('footer')}</footer>
//
//             <i class="bottom arrow" onMouseEnter="() => this.scrollTo(1)" onMouseLeave="{this.stopScrollAnimation}">
//                 <symbols.symbol name="arrowDown"></symbols.symbol>
//             </i>
//
//             <div class="mouse-events-blocker" ref="mouseEventsBlocker" onMouseMove="{this.hideMouseEventsBlocker}"></div>
//         </div>
//     </section>`;

export interface Option {

}

export interface DropdownLocation {
    top:number,
    left:number,
    width:number,
}

export interface Viewport {
    height:number,
    width:number,
    edgeIndent:number,
}

export interface OptionsLocation {
    style:{
        top:number,
        bottom:number,
        left:number,
        width:number,
    },

    scrollTop:number,
}

export interface OptionsSettings {
    viewport:Viewport,
    dropdownLocation:DropdownLocation,
    selectedOptionOffset:number,
    optionListHeight:number,
}

export class Dropdown {
    constructor() {
    }

    open() {
    }

    close() {
    }

    private options:Array<Option>;
}

export class Options {
    constructor({node, screenEdgeIndent}) {
        this.node = node;
        this.screenEdgeIndent = screenEdgeIndent;
    }

    protected open({type, location, selectedIndex}) {
        this.options = new Select({
            viewport: {
                height: document.documentElement.clientHeight,
                width: document.documentElement.clientWidth,
                edgeIndent: this.screenEdgeIndent
            },

            dropdownLocation: location,
            selectedOptionOffset: this.getOptionNode(selectedIndex).offsetTop,
            optionListHeight: this.getOptionListNode().offsetHeight,
        });

        var location = this.options.getLocation();

        for (var name in location.style) {
            this.node.querySelector('.options').style.setProperty(name, location.style[name] + 'px');
        }
        
        this.getOptionListNode().scrollTop = location.scrollTop;
    };

    getOptionListNode() {
        return this.node.querySelector('.list');
    }

    getOptionNode(index) {
        return this.node.querySelector('.list').querySelectorAll('.item')[index];
    }

    private node;
    private screenEdgeIndent;
    private options;
}

// OptionsHTML рендерить і віддає необхідні елементи в Options,
// це забезпечить найбільший рівень інкапсуляції і розподіл відповідальності
// (рендер (що), позиціонування-скрол...-все що в).

export class OptionsHTML {
    constructor({screenEdgeIndent}) {
        this.node = document.getElementById('dropdown-options');
        this.node.innerHTML = this.render();
        this.options = new Options({
            node: this.node,
            screenEdgeIndent: screenEdgeIndent
        });
    }

    render() {
        return `
            <div class="options" ref="options" tabindex="0">
                <ol class="list" ref="list"></ol>
            </div>
        `;
    }

    open({type, options, location, selectedIndex}) {
        this.options.getOptionListNode().innerHTML = options.map(this.renderOption).join("\n");

        this.options.open({
            type: type,
            location: location,
            selectedIndex: selectedIndex
        });
    }

    renderOption(option) {
        return `<li class="item">${option.content}</li>`;
    }

    private node;
    private options;
}

export class Select {
    constructor({
        viewport,
        dropdownLocation,
        selectedOptionOffset,
        optionListHeight
    }: OptionsSettings) {
        this.viewport = viewport;
        this.dropdownLocation = dropdownLocation;
        this.selectedOptionOffset = selectedOptionOffset;
        this.optionListHeight = optionListHeight;
    }

    getLocation():OptionsLocation {
        var top = this.calculateTop();
        var bottom = this.calculateBottom(top);
        var hasTopOverflow = this.hasTopOverflow(top);
        var hasBottomOverflow = this.hasBottomOverflow(bottom);

        return {
            style: {
                top: hasTopOverflow ? this.viewport.edgeIndent : top,
                bottom: hasBottomOverflow ? this.viewport.edgeIndent: bottom,
                left: this.dropdownLocation.left,
                width: this.dropdownLocation.width,
            },

            scrollTop: this.calculateScrollTop(top, hasTopOverflow),
        };
    }

    private calculateTop():number {
        return this.dropdownLocation.top - this.selectedOptionOffset;
    }

    private calculateBottom(top):number {
        return this.viewport.height - top - this.optionListHeight;
    }

    private calculateScrollTop(top, hasTopOverflow):number {
        return hasTopOverflow ? -top + this.viewport.edgeIndent : 0;
    }
    
    private hasTopOverflow(top):boolean {
        return top < this.viewport.edgeIndent;
    }

    private hasBottomOverflow(bottom):boolean {
        return bottom < this.viewport.edgeIndent;
    }
    
    private viewport:Viewport;
    private dropdownLocation:DropdownLocation;
    private selectedOptionOffset:number;
    private optionListHeight:number;
}