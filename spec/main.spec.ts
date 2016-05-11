'use strict';

// import {Dropdown} from './../src/scripts/main';
// import {Options} from './../src/scripts/main';
import {Select} from './../src/scripts/main';

// describe(`Class Dropdown`, function() {});

// describe(`Class Options`, function() {});

describe(`Class Select.`, function() {
    beforeEach(function() {
        this.getSettings = ({
            viewport: {
                height: screenHeight = 1000,
                width: screenWidth = 1000,
                edgeIndent: screenEdgeIndent = 0,
            } = {},
            button: {
                top: dropdownTop = 0,
                left: dropdownLeft = 0,
                width: dropdownWidth = 0,
                bottom: dropdownBottom = 0,
            } = {},
            options: {
                boundingRectangle: {
                    height: optionsHeight = 0,
                    top: optionsTop = 0,
                    bottom: optionsBottom = 0,
                } = {},
                selectedOffset: selectedOffset = 0,
                minHeight: minHeight = 0,
            } = {},
        }) => {
            return {
                viewport: {
                    height: screenHeight,
                    width: screenWidth,
                    edgeIndent: screenEdgeIndent,
                },

                button: {
                    top: dropdownTop,
                    left: dropdownLeft,
                    width: dropdownWidth,
                    bottom: dropdownBottom,
                },

                options: {
                    boundingRectangle: {
                        height: optionsHeight,
                        top: optionsTop,
                        bottom: optionsBottom,
                    },

                    selectedOffset: selectedOffset,
                    minHeight: minHeight,
                },
            }
        };
    });

    describe(`getLocation:`, function() {
        describe(`in any case -`, function() {
            beforeEach(function() {
                var select = new Select(this.getSettings({
                    button: {left: 100, width: 100},
                }));

                this.location = select.getLocation();
            });

            it(`should get 'width' from dropdown location`, function(){
                expect(this.location.boundingRectangle.width).toBe(100);
            });

            it(`should get 'left' position from dropdown location`, function(){
                expect(this.location.boundingRectangle.left).toBe(100);
            });
        });

        describe(`no overflow case -`, function() {
            beforeEach(function() {
                var select = new Select(this.getSettings({
                    viewport: {height: 300},
                    button: {top: 100},
                    options: {selectedOffset: 20, boundingRectangle: {height: 100}},
                }));

                this.location = select.getLocation();
            });

            it(`should calculate 'top' position`, function(){
                expect(this.location.boundingRectangle.top).toBe(80);
            });

            it(`should calculate 'bottom' position`, function(){
                expect(this.location.boundingRectangle.bottom).toBe(120);
            });

            it(`should set 'scrollTop' to '0'`, function() {
                expect(this.location.scrollTop).toBe(0);
            });
        });

        describe(`overflow case - `, function() {
            describe(`top case (with viewport edge indent) -`, function() {
                beforeEach(function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 100},
                        options: {selectedOffset: 91, boundingRectangle: {height: 200}},
                    }));

                    this.location = select.getLocation();
                });

                it(`should set 'top' to predefined extrema position`, function() {
                    expect(this.location.boundingRectangle.top).toBe(10);
                });

                it(`should set 'scrollTop' depending on the selected option`, function() {
                    expect(this.location.scrollTop).toBe(1);
                });
            });

            describe(`bottom case (with viewport edge indent) -`, function() {
                beforeEach(function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 200},
                        options: {selectedOffset: 0, boundingRectangle: {height: 91}},
                    }));

                    this.location = select.getLocation();
                });

                it(`should set 'bottom' to predefined extrema position`, function() {
                    expect(this.location.boundingRectangle.bottom).toBe(10);
                });
            });

            describe(`
            top case and the option list height is going to be too small
            (the dropdown is too close to the top edge of the screen)
            `, function() {
                it(`should set 'top' to be right under the bottom edge of the dropdown`, function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 99, bottom: 119},
                        options: {
                            boundingRectangle: {height: 100},
                            selectedOffset: 90,
                            minHeight: 90
                        },
                    }));

                    var location = select.getLocation();
                    
                    expect(location.boundingRectangle.top).toBe(119);
                });

                it(`should set 'bottom' to fit all options`, function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 99, bottom: 119},
                        options: {
                            boundingRectangle: {height: 100},
                            selectedOffset: 90,
                            minHeight: 90
                        },
                    }));

                    var location = select.getLocation();

                    expect(location.boundingRectangle.bottom).toBe(81);
                });

                it(`
                should set 'bottom' to predefined extrema, 
                if after changing top option list have gotten bottom overflow
                `, function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 99, bottom: 120},
                        options: {
                            boundingRectangle: {height: 171},
                            selectedOffset: 90,
                            minHeight: 90
                        },
                    }));

                    var location = select.getLocation();

                    expect(location.boundingRectangle.bottom).toBe(10);
                });

                it(`should set 'top' as usual, is there is no overflow`, function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 11, bottom: 31},
                        options: {
                            boundingRectangle: {height: 100},
                            selectedOffset: 1,
                            minHeight: 90
                        },
                    }));

                    var location = select.getLocation();

                    expect(location.boundingRectangle.top).toBe(10);
                });
            });

            describe(`
            bottom case and the option list height is going to be too small
            (the dropdown is too close to the bottom edge of the screen)
            `, function() {
                it(`should set 'bottom' to be right upon the top edge of the dropdown`, function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 201, bottom: 221},
                        options: {
                            boundingRectangle: {height: 90},
                            selectedOffset: 0,
                            minHeight: 90
                        },
                    }));

                    var location = select.getLocation();
                    
                    expect(location.boundingRectangle.bottom).toBe(99);
                });

                it(`should set 'top' to fit all options`, function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 201, bottom: 221},
                        options: {
                            boundingRectangle: {height: 90},
                            selectedOffset: 0,
                            minHeight: 90
                        },
                    }));

                    var location = select.getLocation();

                    expect(location.boundingRectangle.top).toBe(111);
                });
                
                it(`
                should set 'top' to predefined extrema, 
                if after changing bottom option list have gotten top overflow
                `, function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 201, bottom: 221},
                        options: {
                            boundingRectangle: {height: 192},
                            selectedOffset: 0,
                            minHeight: 90
                        },
                    }));

                    var location = select.getLocation();

                    expect(location.boundingRectangle.top).toBe(10);
                });
                
                it(`should set 'bottom' as usual, is there is no overflow`, function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 269, bottom: 289},
                        options: {
                            boundingRectangle: {height: 100},
                            selectedOffset: 79,
                            minHeight: 90
                        },
                    }));

                    var location = select.getLocation();

                    expect(location.boundingRectangle.bottom).toBe(10);
                });
            });

            describe(`
            both overflow case 
            and the dropdown is too close to the one of the screen edges
            `, function() {
                it(`should set 'top' and 'bottom' to predefined extrema`, function() {
                    var select = new Select(this.getSettings({
                        viewport: {height: 300, edgeIndent: 10},
                        button: {top: 99, bottom: 201},
                        options: {
                            boundingRectangle: {height: 282},
                            selectedOffset: 90,
                            minHeight: 90
                        },
                    }));

                    var location = select.getLocation();

                    expect(location.boundingRectangle.top).toBe(10);
                    expect(location.boundingRectangle.bottom).toBe(10);
                });
            });
        });
    });
    
    describe(`getScrollData:`, function() {
        describe(`no overflow case -`, function() {
            it(`should set 'distance' to 0`, function() {
                var select = new Select(this.getSettings({
                    viewport: {height: 300},
                    button: {top: 100},
                    options: {selectedOffset: 20, boundingRectangle: {bottom: 100}},
                }));
                
                var scrollData = select.getScrollData(10);
                
                expect(scrollData.distance).toBe(0);
            });
        });
        
        describe(`both overflow case -`, function() {
            it(`should set 'distance' to 'deltaY'`, function() {
                var select = new Select(this.getSettings({
                    viewport: {height: 300, edgeIndent: 10},
                    button: {top: 100},
                    options: {selectedOffset: 91, boundingRectangle: {bottom: 291}},
                }));

                var scrollData = select.getScrollData(10);

                expect(scrollData.distance).toBe(10);
            });
        });

        describe(`top overflow case,`, function() {
            beforeEach(function() {
                var select = new Select(this.getSettings({
                    viewport: {height: 300, edgeIndent: 10},
                    button: {top: 100},
                    options: {selectedOffset: 100, boundingRectangle: {bottom: 280}},
                }));

                this.scrollData = select.getScrollData(-10);
            });

            it(`should set 'distance' to a new bottom position`, function() {
                expect(this.scrollData.distance).toBe(10);
            });

            it(`should set 'edge' to 'bottom'`, function() {
                expect(this.scrollData.edge).toBe('bottom');
            });
        });

        describe(`bottom overflow case,`, function() {
            describe(`scroll up -`, function() {
                it(`should `, function() {

                });
            });

            describe(`scroll down -`, function() {
                it(`should `, function() {

                });
            });
        });
    });
});
