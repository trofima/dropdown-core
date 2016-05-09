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
        var baseTop = this.button.top - this.options.selectedOffset;
        var baseBottom = this.viewport.height - baseTop - this.options.height;
        var verticalPositions = this.getVerticalPosition(baseTop, baseBottom);


        return {
            boundingRectangle: {
                top: verticalPositions.top,
                bottom: verticalPositions.bottom,
                left: this.button.left,
                width: this.button.width,
            },

            scrollTop: this.getScrollTop(baseTop),
        };
    }

    private getVerticalPosition(baseTop, baseBottom) {
        var hasTopOverflow = this.hasOverflow(baseTop);
        var hasBottomOverflow = this.hasOverflow(baseBottom);

        if (hasTopOverflow && hasBottomOverflow)
            return {
                top: this.viewport.edgeIndent,
                bottom: this.viewport.edgeIndent,
            };
        else if (hasTopOverflow || hasBottomOverflow)
            return this.getOverflowedPosition(hasTopOverflow ? 'top' : 'bottom', {
                top: baseTop,
                bottom: baseBottom,
            });

        return {
            top: baseTop,
            bottom: baseBottom,
        }
    }

    private getOverflowedPosition(currentSideName, baseValues) {
        var sideMirrorMap = {
            top: 'bottom',
            bottom: 'top',
        };

        var oppositeSideName = sideMirrorMap[currentSideName];

        if (this.getButtonDistanceToEdge(currentSideName) < this.options.minHeight) {
            let currentSidePosition = this[currentSideName](currentSideName);//TODO: clean
            let oppositeSidePosition = this[oppositeSideName](currentSideName);

            return {
                [currentSideName]: currentSidePosition,
                [oppositeSideName]: this.hasOverflow(oppositeSidePosition)
                    ? this.viewport.edgeIndent
                    : oppositeSidePosition,
            };
        }

        return {
            [currentSideName]: this.viewport.edgeIndent,
            [oppositeSideName]: baseValues[oppositeSideName],
        };
    }

    private hasOverflow(offset):boolean {
        return offset < this.viewport.edgeIndent;
    }

    private getButtonDistanceToEdge(edgeName) {
        return edgeName === 'top'
            ? this.button.top - this.viewport.edgeIndent
            : this.viewport.height - this.button.top - this.viewport.edgeIndent;
    }

    private getMovedPosition() {

    }

    private top(currentSide) { //TODO: rename
        var resultMap = {
            top: this.button.bottom,
            bottom: this.button.top - this.options.height
        };

        return resultMap[currentSide];
    }

    private bottom(currentSide) { //TODO: rename
        var resultMap = {
            top: this.viewport.height - this.button.bottom - this.options.height,
            bottom: this.viewport.height - this.button.top,
        };

        return resultMap[currentSide];
    }

    private getScrollTop(baseTop) {
        if (this.hasOverflow(baseTop))
            return -baseTop + this.viewport.edgeIndent;

        return 0;
    }

    private viewport:Viewport;
    private options:OptionSettings;
    private button:BoundingRectangle;
}