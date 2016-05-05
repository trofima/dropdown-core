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

// export interface Option {
//
// }
export interface Viewport {
    height:number,
    width:number,
    edgeIndent:number,
}

export interface BoundingRectangle {
    left:number,
    top:number,
    bottom:number,
    width:number,
}

export interface OptionSettings {
    height:number,
    minHeight:number,
    selectedOffset:number,
}

export interface DropdownSettings {
    viewport:Viewport,
    button:BoundingRectangle,
    options:OptionSettings,
}

export interface OptionsLocation {
    boundingRectangle: BoundingRectangle,
    scrollTop:number,
}

// export class Dropdown {
//     constructor() {
//     }
//
//     open() {
//     }
//
//     close() {
//     }
//
//     private options:Array<Option>;
// }

// OptionsHTML рендерить і віддає необхідні елементи в Options,
// це забезпечить найбільший рівень інкапсуляції і розподіл відповідальності
// (рендер (що), позиціонування-скрол...-все що в).

export class OptionsHTML {
    constructor({screenEdgeIndent = 10, minHeight = 180}) {
        this.node = document.getElementById('dropdown-options');
        this.node.innerHTML = this.render();
        this.options = new Options({
            node: this.node,
            screenEdgeIndent: screenEdgeIndent,
            minHeight: minHeight
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

export class Options {
    constructor({node, screenEdgeIndent, minHeight}) {
        this.node = node;
        this.screenEdgeIndent = screenEdgeIndent;
        this.minHeight = minHeight;
    }

    protected open({type, location, selectedIndex}) {
        this.options = new Select({
            viewport: {
                height: document.documentElement.clientHeight,
                width: document.documentElement.clientWidth,
                edgeIndent: this.screenEdgeIndent
            },

            options: {
                height: this.getOptionListNode().offsetHeight,
                minHeight: this.minHeight,
                selectedOffset: this.getOptionNode(selectedIndex).offsetTop,
            },

            button: location,
        });

        var location = this.options.getLocation();

        for (var name in location.boundingRectangle) {
            this.node.querySelector('.options').style.setProperty(name, location.boundingRectangle[name] + 'px');
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
    private minHeight;
    private options;
}

export class Select {
    constructor({
        viewport,
        button,
        options,
    }: DropdownSettings) {
        this.viewport = viewport;
        this.button = button;
        this.options = options;
    }

    getLocation():OptionsLocation {
        var scrollTop = 0;
        var top = this.button.top - this.options.selectedOffset;
        var bottom = this.viewport.height - top - this.options.height;

        if (this.hasOverflow(top)) {
            scrollTop = -top + this.viewport.edgeIndent;
            top = this.viewport.edgeIndent;

            if (this.button.top - this.viewport.edgeIndent < this.options.minHeight) {
                top = this.button.bottom;
                bottom = this.viewport.height - top - this.options.height;
            }
        }
        
        if (this.hasOverflow(bottom)) {
            bottom = this.viewport.edgeIndent;
            
            if (this.viewport.height - (this.button.bottom) - this.viewport.edgeIndent < this.options.minHeight) {
                bottom = this.viewport.height - this.button.top;
                top = this.button.top - this.options.height;

                if (this.hasOverflow(top))
                    top = this.viewport.edgeIndent;
            }
        }
        
        return {
            boundingRectangle: {
                top: top,
                bottom: bottom,
                left: this.button.left,
                width: this.button.width,
            },

            scrollTop: scrollTop,
        };
    }

    private hasOverflow(offset):boolean {
        return offset < this.viewport.edgeIndent;
    }

    private viewport:Viewport;
    private options; //TODO: interface
    private button:BoundingRectangle;
}