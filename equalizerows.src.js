
(function($) {
    
    'use strict';
    
    var runEachVectorOf
		,activeCollections
        ,delay
       	,timeoutID
		,eachRowOf
		,eachColOf
    ;
	
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
	
		
		
    	var currentTop
			,items
			,currentTallest
			,collection
			,collectionLength
			,$item
			,thisTop
			,thisTall
			,currentRowBottom
			,i
			,leftOrTop
			,outerWidthOrHeight
		;
		
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
	
		while (collectionLength) {
			
			items = [];
			
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
					
					thisTop = $item.offset()[leftOrTop];
					thisTall = $item[outerWidthOrHeight]();
					
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
				
				if (o.type !== 0) {
					
					if (o.type === 1 || o.type === 2) {
					
						// Find items that start within the tallest
						// Loop through all items except those that appear at the top
						for (i = 0; i < collectionLength; i += 1) {
							
							// Only work with items not already in the row
							if ($.inArray(collection[i],items) < 0) {
								
								thisTop = $(collection[i]).offset()[leftOrTop];
								
								if (thisTop < currentRowBottom) {
									if (o.type === 2) {
										if (thisTop + $(collection[i])[outerWidthOrHeight]() <= currentRowBottom) {
											items.push(collection[i]);
										}
									}
									else {
										items.push(collection[i]);
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
								
								thisTop = $(collection[i]).offset()[leftOrTop] + $(collection[i])[outerWidthOrHeight]();
								
								if (thisTop <= currentRowBottom) {
									items.push(collection[i]);
								}
							}
						}
					}
				}
			}
			
			// Do the callback for each row
			o.fn.call(items);
			
			collection = $(collection).not(items);
			collectionLength = collection.length;
		
		}
		
    	return this;
		
    };

    
    eachRowOf = function(o) {
		
		// Sensible defaults
		o.vector = o.vector || 'row';
		o.type = o.type === undefined ? 0 : o.type; // normal or compact or supercompact, may change to 0,1,2
		o.active = o.active === undefined ? false : o.active;
		o.fn = o.fn || function() {};
		o.resize = o.resize || function() {};
		
		o.collection = this;
		
		if (o.active) {
			activeCollections.push(o);
		}
		
		runEachVectorOf(o);
		
    	return this;
    	
    };

    
    eachColOf = function(o) {
		
		o.vector = 'col';
		eachRowOf.call(this, o);
    	return this;
    	
    };
	
	
	// Add window resize event and buffer the calls to prevent a potential overflow of calls to runEachVectorOf
	setTimeout(function() {
		$(window).on('resize.equalizerows', function() {
			clearTimeout(timeoutID);
			timeoutID = setTimeout(function() {
				var activeCollectionsLength = activeCollections.length
					,i
				;
				for (i = 0; i < activeCollectionsLength; i += 1) {
					runEachVectorOf(activeCollections[i]);
				}
			}, delay);
		});
	}, 50);
	
	
	// Equalize Rows
	$.fn.equalizeRows = function(o) {
		
		var propertyIsNotArray
			,propertyLength
			,i
		;
		
		o = o || {};
		
		// Sensible defaults
		o.type = o.type === undefined ? 0 : o.type; // 0,1,2,3
		o.colType = o.colType === undefined ? 0 : o.colType; // 0,1,2,3
		o.applyTo = o.applyTo === undefined ? 'last' : o.applyTo; // all, first
		o.property = o.property === undefined ? 'height' : o.property; // 'padding-top,padding-bottom', 'padding-top', 'padding-bottom', 'height' // or maybe at some point a function but needs more consideration
		o.active = o.active === undefined ? false : o.active;
		o.here = o.here === undefined ? undefined : o.here;
		
//console.log(o.here, o.property, o.active, o.type, o.applyTo, o.colType);
		
		propertyIsNotArray = $.type(o.property) !== 'array';
		if (propertyIsNotArray) {
			o.property = o.property.split(',');
		}
		propertyLength = o.property.length;
		
		if ($(this).length) {

			eachRowOf.call(this, {
				type:o.type
				,active:o.active
				,fn:function() {
	
					var $row = $(this)
						,rowBottom = 0
						,rowTallests
					;
					
					// Find all the items in the row which extend the furthest down the page (the row tallests)
					rowTallests = [];
					$row.each(function() {
						
						var $this = $(this)
							,offsetBottom
						;
						
						offsetBottom = $this.offset().top + $this.outerHeight();
						
						if (offsetBottom > rowBottom) {
							rowTallests = [this];
							rowBottom = offsetBottom;
						}
						else if (offsetBottom === rowBottom) {
							rowTallests.push(this);
						}
						
					});
					
					// Now work with each column in the row
					eachColOf.call(this, {
						type:o.colType
						,fn:function() {
						
							var $colTallest
								,$colTallestHere
								,diff
								,colBottom
								,$items
								,$itemsLength
								,$col
							;
							
							$col = $(this);
							
							// Check if this column needs equalizing
							if ($col.is(rowTallests) === false) {
								
								
								// It does, now do the do
								
								// Find bottom of column
								colBottom = 0;
								$col.each(function() {
									
									var $this = $(this)
										,offsetBottom
									;
									
									offsetBottom = $this.offset().top + $this.outerHeight();
									if (offsetBottom > colBottom) {
										$colTallest = $(this);
										colBottom = offsetBottom;
									}
									
								});
									
								diff = rowBottom - colBottom;
								
								if (o.applyTo === 'last') {
									if ($colTallest) {
										$items = $colTallest;
									}
								}
								else if (o.applyTo === 'all') {
									$items = $col;
								}
								else if (o.applyTo === 'first') {
									$items = $col.eq(0);
								}
								
								$colTallestHere = o.here ? $colTallest.find(o.here) : $colTallest;
								
								if ($items) {
									$itemsLength = $items.length;
									$items.each(function() {
										var $thisHereNow = o.here ? $(this).find(o.here) : $(this);
										for (i = 0; i < propertyLength; i += 1) {
											$thisHereNow.css(o.property[i], parseFloat($colTallestHere.css(o.property[i]), 10) + (diff / (propertyLength * $itemsLength)) + 'px');
											 // 0.4 was needed in Firefox in the demo, so need to investigate what is happening here
										}
									});
								}
							
							}
						
						
						}
					});
					
				}
				,resize: function() {
					// Reset CSS
					$(this).each(function() {
						var $this = o.here ? $(this).find(o.here) : $(this);
						for (i = 0; i < propertyLength; i += 1) {
							$this.css(o.property[i], '');
						}
					});
				}
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


equalizeRows
============

jQuery plugin to equalise the height of items in rows and columns

Going to put a demo up at some point, but in the meantime here's how to use


Getting Started
----------
```
<script src="jquery-equalizerows.js"></script>
<script>
$(function() {
	
	$('[data-equalizerows]').each(function() {
		
		var $this = $(this)
			,selector = $this.data('equalizerows')
			,here = $this.data('equalizerows-here')
			,property = $this.data('equalizerows-property')
			,active = $this.is('[data-equalizerows-active]') && $this.data('equalizerows-active') !== false ? true : false
			,type = $this.data('equalizerows-type')
			,colType = $this.data('equalizerows-colType')
			,applyTo = $this.data('equalizerows-applyTo')
		;
		if (selector) {
			$this.find(selector).equalizeRows({
				type:type
				,active:active
				,property:property
				,here:here
				,colType:colType
				,applyTo:applyTo
			});
		}
	});
	
});
</script>
```

The rest can be done in HTML
```
<div data-equalizerows=".link">
  ...
    <a class="link">Hello</a>
  ...
    <a class="link">Doobie doo</a>
  ...
</div>
```

Basic Options

data-equalizerows=".link"
  Turns on equalizerows and indicates which items to work with
data-equalizerows-active
  Turns on window.resize event handling, defaults to off
data-equalizerows-here=".link-title"
  Selects a descendent element where the equalizing will be applied, defaults to the item we're working with
data-equalizerows-property="padding-bottom"
  CSS property to change, defaults to height, but is a comma separated list e.g. "padding-bottom,padding-top" will work too

Advanced Options
data-equalizerows-type and data-equalizerows-colType
  The row and column type being used, defaults to 0
0 Normal: Items that start at the same y point are in the row
1 Compact: Normal plus items that end within the tallest item are in the row
2 Super Compact: Normal plus items that start within the tallest item are in the row
999 Ultra Compact: The whole collection is considered in the row

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