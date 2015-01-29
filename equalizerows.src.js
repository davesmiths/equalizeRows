/* equalizeRows v1.0.1 https://github.com/davesmiths/equalizerows */
(function($) {

    'use strict';

    var runEachVectorOf,
        activeCollections,
        delay,
        timeoutID,
        eachRowOf,
        eachColOf;

    // activeCollections, to collect all the elements that can passed so they can be updated on window.resize efficiently
    delay = 100;
    activeCollections = [];


    runEachVectorOf = function(o) {

        // There are two types of vector (row or column):
        /*

        o.type
        -1: off, all items are in the row
        0: Only items that start at the same point are in the row (default)
        1: starts
        2: starts and ends
        3: ends

        */



        var currentTop,
            items,
            spareTops,
            currentTallest,
            collection,
            collectionLength,
            collectionOuterLengths,
            collectionTops,
            $item,
            thisTop,
            thisTall,
            currentRowBottom,
            i,
            leftOrTop,
            outerWidthOrHeight,
            later;

        later = [];
        o.resize.call(o.collection);

        // Set left or top, outerHeight or outerWidth dependent on whether the vector is row or column
        leftOrTop = 'top';
        outerWidthOrHeight = 'outerHeight';
        if (o.vector === 'col') {
            leftOrTop = 'left';
            outerWidthOrHeight = 'outerWidth';
        }

        collection = o.collection.slice();
        collectionLength = collection.length;

        // While there are items in the collection
        while (collectionLength) {

            items = [];
            spareTops = [];
            collectionTops = [];
            collectionOuterLengths = [];

            if (o.type === -1) {
                // All items are in the vector
                items = collection;
            }
            else {

                // Find the items aligned at the start of the vector
                // The following takes into account that source order doesn't equal visual order
                currentTop = Number.POSITIVE_INFINITY;

                for (i = 0; i < collectionLength; i += 1) {

                    $item = $(collection[i]);

                    thisTop = collectionTops[i] = $item.offset()[leftOrTop];
                    thisTall = collectionOuterLengths[i] = $item[outerWidthOrHeight]();

                    if (thisTop < currentTop) {
                        currentTop = thisTop;
                        items = [];
                        currentTallest = 0;
                    }

                    if (thisTop === currentTop) {
                        items.push(collection[i]);
                        if (currentTallest < thisTall) {
                            currentTallest = thisTall;
                        }
                    }

                }
                currentRowBottom = currentTop + currentTallest;

                // Now find the extra ones if they exist
                if (o.type !== 0) {

                    if (o.type === 1 || o.type === 2) {

                        // Find items that start within the tallest
                        // Loop through all items except those that appear at the top
                        for (i = 0; i < collectionLength; i += 1) {

                            // Only work with items not already in the row
                            if ($.inArray(collection[i],items) < 0) {

                                thisTop = collectionTops[i];

                                if (thisTop < currentRowBottom) {
                                    if (o.type === 2) {
                                        if (thisTop + collectionOuterLengths[i] <= currentRowBottom) {
                                            items.push(collection[i]);
                                            spareTops.push([thisTop,collection[i]]);
                                        }
                                    }
                                    else {
                                        items.push(collection[i]);
                                        spareTops.push([thisTop,collection[i]]);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // type === 3
                        // Find items that start within the tallest
                        // Loop through all items except those that appear at the top
                        for (i = 0; i < collectionLength; i += 1) {

                            // Only work with items not already in the row
                            if ($.inArray(collection[i],items) < 0) {

                                thisTop = collectionTops[i] + collectionOuterLengths[i];

                                if (thisTop <= currentRowBottom) {
                                    items.push(collection[i]);
                                    spareTops.push([collectionTops[i],collection[i]]);
                                }
                            }
                        }
                    }
                }
            }

            if (o.vector === 'row') {

                // Do the callback for each row/col
                o.fn.call(items);

    //console.log('o.vector', o.vector, spareTops, items);
                // Check items to see if any of the start positions has changed
                // If has changed then the item needs to be added back in to be re-evaluated
                for (i = 0; i < spareTops.length; i++) {
                    if (spareTops[i][0] !== $(spareTops[i][1]).offset()[leftOrTop]) {
    console.log('spares');
                        items = $(items).not(spareTops[i][1]);
                    }
                }
            }
            else {
                later.push(items);
            }

            // Continue with whatever is left
            collection = $(collection).not(items);
            collectionLength = collection.length;

        }
        if (o.vector === 'col') {

            // Do the callback for each row/col
            for (i = 0; i < later.length; i++) {
                o.fn.call(later[i]);
            }
        }
//console.log('o',o);
        // Run the callback
        o.callback.call(o.collection);

        return this;

    };


    eachRowOf = function(o) {

        var $waits,
            $waitsLength;

        // Sensible defaults
        o.vector = o.vector || 'row';
        o.type = o.type === undefined ? 0 : o.type; // normal or compact or supercompact, may change to 0,1,2
        o.active = o.active === undefined ? false : o.active;
        o.fn = o.fn || function() {};
        o.resize = o.resize || function() {};
        o.callback = o.callback || function() {};
        o.wait = o.wait || '';

        o.collection = this;

        $waits = $(o.wait);
        $waitsLength = $waits.length;
        if ($waitsLength) {
            $waits.each(function() {
                $(this).data('equalizerows-wait', true);
            })
            .on('resized', function() {
                runEachVectorOf(o);
            });
        }
        else if (o.active) {
            activeCollections.push(o);
        }
        if ($waitsLength === 0) {
            runEachVectorOf(o);
        }

        return this;

    };


    eachColOf = function(o) {

        o.vector = 'col';
console.log('eachColOf',o);
        eachRowOf.call(this, o);
        return this;

    };


    // Add window resize event and buffer the calls to prevent a potential overflow of calls to runEachVectorOf
    $(window).on('resize.equalizerows', function() {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
            var activeCollectionsLength = activeCollections.length,
                i;
            for (i = 0; i < activeCollectionsLength; i += 1) {
                runEachVectorOf(activeCollections[i]);
            }
        }, delay);
    });


    // Equalize Rows
    $.fn.equalizeRows = function(o) {

        var propertyIsNotArray,
            propertyLength,
            i,
            j,
            self = this,
            $waits,
            $waitsLength;

        o = o || {};

        // Sensible defaults
        o.type = o.type === undefined ? 0 : o.type; // 0,1,2,3
        o.colType = o.colType === undefined ? 0 : o.colType; // 0,1,2,3
        o.applyTo = o.applyTo === undefined ? 'last' : o.applyTo; // all, first
        o.property = o.property === undefined ? 'height' : o.property; // 'padding-top,padding-bottom', 'padding-top', 'padding-bottom', 'height' // or maybe at some point a function but needs more consideration
        o.active = o.active === undefined ? false : o.active;
        o.here = o.here === undefined ? undefined : o.here;
        o.callback = o.callback || function() {};
        o.wait = o.wait || '';

        propertyIsNotArray = $.type(o.property) !== 'array';
        if (propertyIsNotArray) {
            o.property = o.property.split(',');
        }
        propertyLength = o.property.length;

        $(self).each(function() {
            if ($(this).data('uid.equalizerows') === undefined) {
                $(this).data('uid.equalizerows', self);
            }
        });

        if ($(this).length) {

            eachRowOf.call(this, {
                type: o.type,
                active: o.active,
                wait: o.wait,
                fn: function() {

                    var $row = $(this),
                        rowBottom = 0,
                        rowTallests,
                        columns = [],
                        column,
                        diff,
                        $items,
                        $itemsLength,
                        $colTallest,
                        $colTallestHere,
                        applyCSS;

                    // Find all the items in the row which extend the furthest down the page (the row tallests)
                    rowTallests = [];
                    $row.each(function() {

                        var $this = $(this),
                        offsetBottom;

                        offsetBottom = Math.round($this.offset().top + $this.outerHeight());

                        if (offsetBottom > rowBottom) {
                            rowTallests = [this];
                            rowBottom = offsetBottom;
                        }
                        else if (offsetBottom === rowBottom) {
                            rowTallests.push(this);
                        }

                    });
console.log('row',this);
console.log('rowTallests',rowTallests);

                    // Now work with each column in the row
                    eachColOf.call(this, {

                        type: o.colType,
                        fn: function() {
//console.log('eachColOf callback');
                            var $colTallest,
                                $colTallestHere,
                                diff,
                                colBottom,
                                $col;

                            $col = $(this);
//console.log('  $col',$col);
//console.log('$col.is(rowTallests)',$col.is(rowTallests));
                            // Check if this column needs equalizing
                            if ($col.is(rowTallests) === false) {

                                // It does, now do the do

                                // Find bottom of column
                                colBottom = 0;
                                $col.each(function() {

                                    var $this = $(this),
                                    offsetBottom;

                                    offsetBottom = Math.round($this.offset().top + $this.outerHeight());
                                    if (offsetBottom > colBottom) {
                                        $colTallest = $(this);
                                        colBottom = offsetBottom;
                                    }

                                });
                                columns.push({
                                    $col: $col,
                                    colBottom: colBottom,
                                    $colTallest: $colTallest
                                });
                            }
                        }
                    });
                    applyCSS = function() {
                        var $thisHereNow = o.here ? $(this).find(o.here) : $(this);
                        for (j = 0; j < propertyLength; j += 1) {
                            $thisHereNow.css(o.property[j], parseInt($thisHereNow.css(o.property[j]), 10) + (diff / (propertyLength * $itemsLength)) + 'px');
                        }
                    };
                    for (i = 0; i < columns.length; i++) {

                        column = columns[i];

                        diff = rowBottom - column.colBottom;

console.log('    colTallest',column.$colTallest);

                        if (o.applyTo === 'last') {
                            if (column.$colTallest) {
                                $items = column.$colTallest;
console.log('    last');
                            }
                        }
                        else if (o.applyTo === 'all') {
                            $items = column.$col;
console.log('    all',$items);
                        }
                        else if (o.applyTo === 'first') {
console.log('    first');
                            $items = column.$col.eq(0);
                        }

                        $colTallestHere = o.here ? column.$colTallest.find(o.here) : column.$colTallest;
console.log($items);
                        if ($items) {
                            $itemsLength = $items.length;
                            $items.each(applyCSS);
                        }
                    }
                },
                resize: function() {
                    // Reset CSS
                    $(this).each(function() {
                        var $this = o.here ? $(this).find(o.here) : $(this),
                            uid = $(this).data('uid.equalizerows');
                        if (uid === self && $this.data('equalizerows-wait') !== true) {
                            for (i = 0; i < propertyLength; i += 1) {
                                $this.css(o.property[i], '');
                            }
                        }

                    });
console.log(this);
//debugger;
                },
                callback: o.callback
            });

        }

    };

    /*
    Troubleshooting

    Web fonts can be awkward as they load later than the rest of the page. This can be remedied by triggering window resize handlers once they are loaded.

    Height of link wasn't correct and too short. Turned out that the link contained images which hadn't had the height set. Once they did all was well.

    */
}(jQuery));

/*

Web Font Funs
---------
```
Example
// Web Font Loader by Typekit and Google
// https://github.com/typekit/webfontloader
var WebFontConfig = {
google: {
families: [
'Merriweather:300,400italic,400:latin'
,'Open+Sans:400,600,600italic,700,700italic,400italic,300,300italic'
]
}
,active: function() {
$(function() {
$(window).triggerHandler('resize.equalizerows');
});
}
};
```
*/
