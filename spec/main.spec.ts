'use strict';

import {Dropdown} from './../src/scripts/main';
import {Options} from './../src/scripts/main';
import {Select} from './../src/scripts/main';

describe(`Class Dropdown`, function() {});

describe(`Class Options`, function() {});

describe(`Class Select.`, function() {
    beforeEach(function() {
        this.getSettings = ({
            viewport: {
                height: screenHeight = 1000,
                width: screenWidth = 1000,
                edgeIndent: screenEdgeIndent = 0
            } = {},
            dropdownLocation: {
                top: dropdownTop = 0,
                left: dropdownLeft = 0,
                width: dropdownWidth = 0
            } = {},
            selectedOptionOffset = 0,
            optionListHeight = 0
        }) => {
            return {
                viewport: {
                    height: screenHeight,
                    width: screenWidth,
                    edgeIndent: screenEdgeIndent
                },

                dropdownLocation: {
                    top: dropdownTop,
                    left: dropdownLeft,
                    width: dropdownWidth
                },

                selectedOptionOffset: selectedOptionOffset,
                optionListHeight: optionListHeight
            }
        };
    });

    describe(`getLocation:`, function() {
        describe(`in any case -`, function() {
            beforeEach(function() {
                var select = new Select(this.getSettings({
                    dropdownLocation: {left: 100, width: 100},
                }));

                this.location = select.getLocation();
            });

            it(`should get 'width' from dropdown location`, function(){
                expect(this.location.style.width).toBe(100);
            });

            it(`should get 'left' position from dropdown location`, function(){
                expect(this.location.style.left).toBe(100);
            });
        });

        describe(`no overflow case -`, function() {
            beforeEach(function() {
                var select = new Select(this.getSettings({
                    viewport: {height: 300},
                    dropdownLocation: {top: 100},
                    selectedOptionOffset: 20,
                    optionListHeight: 100
                }));

                this.location = select.getLocation();
            });

            it(`should calculate 'top' position`, function(){
                expect(this.location.style.top).toBe(80);
            });

            it(`should calculate 'bottom' position`, function(){
                expect(this.location.style.bottom).toBe(120);
            });

            it(`should set 'scrollTop' to '0'`, function() {
                expect(this.location.scrollTop).toBe(0);
            });
        });

        describe(`overflow`, function() {
            describe(`top case (with viewport edge indent) -`, function() {
                beforeEach(function() {
                    var select = new Select(this.getSettings({
                        viewport: {
                            height: 300,
                            edgeIndent: 10
                        },

                        dropdownLocation: {top: 100},
                        selectedOptionOffset: 180,
                        optionListHeight: 200
                    }));

                    this.location = select.getLocation();
                });

                it(`should set 'scrollTop' depending on the selected option`, function() {
                    expect(this.location.scrollTop).toBe(90);
                });
                
                it(`should set 'top' to predefined extrema position`, function() {
                    expect(this.location.style.top).toBe(10);
                });
            });

            describe(`bottom case (with viewport edge indent) -`, function() {
                beforeEach(function() {
                    var select = new Select(this.getSettings({
                        viewport: {
                            height: 300,
                            edgeIndent: 10
                        },

                        dropdownLocation: {top: 200},
                        selectedOptionOffset: 0,
                        optionListHeight: 200
                    }));

                    this.location = select.getLocation();
                });

                it(`should set 'bottom' to predefined extrema position`, function() {
                    expect(this.location.style.bottom).toBe(10);
                });
            });
            
            // describe(`both (top and bottom) case`, function() { // перші два теста - марні
            //     beforeEach(function() {
            //         var select = new Select(this.getSettings({
            //             viewport: {
            //                 height: 300,
            //                 edgeIndent: 10
            //             },
            //
            //             dropdownLocation: {top: 100},
            //             selectedOptionOffset: 200,
            //             optionListHeight: 500
            //         }));
            //
            //         this.location = select.getLocation();
            //     });
            //    
            //     it(`should set both sides to the predefined extrema positions`, function() {
            //         expect(this.location.style.top).toBe(10);
            //         expect(this.location.style.bottom).toBe(10);
            //     });
            //    
            //     it(`should set 'scrollTop' depending on the selected option`, function() {
            //         expect(this.location.scrollTop).toBe(110);
            //     });
            // });
        });
        
        // TODO: випадок, дропдаун розташований заблизько до краю
    });
});
