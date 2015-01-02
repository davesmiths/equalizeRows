equalizeRows
============

jQuery plugin to equalise the height of items in rows and columns


Usage
-----

```
<div data-equalizerows=".link">
...
	<a class="link">Hello</a>
...
	<a class="link">Doobie doo</a>
...
</div>
```
Add jQuery, equalizerows.js and do the business
```
<script src="jquery.js"></script>
<script src="jquery-equalizerows.js"></script>
<script>
$(function() {

	'use strict';

    $($('[data-equalizerows]').get().reverse()).each(function() {

        var $this = $(this)
            ,selector = $this.data('equalizerows')
        ;

		// Prevent multiple initiations so this code snippet can be reused as and when
		if ($this.data('equalizerows-initiated') === undefined) {

			$this.data('equalizerows-initiated', true);

			if (selector) {
				$this.find(selector).equalizeRows({
					type:$this.data('equalizerows-type')
					// Active defaults to off
					,active:$this.is('[data-equalizerows-active]') && $this.data('equalizerows-active') !== false ? true : false
					// Active defaults to on
					//,active:$this.is('[data-equalizerows-active]') && $this.data('equalizerows-active') === false ? false : true
					,property:$this.data('equalizerows-property')
					,here:$this.data('equalizerows-here')
					,colType:$this.data('equalizerows-colType')
					,applyTo:$this.data('equalizerows-applyTo')
				});
			}
		}
    });

});
</script>
```

Options
-------

**data-equalizerows=".link"**  
Turns on equalizerows and which items to work with  
Value is a selector  

**data-equalizerows-active**  
Turns on window.resize event handling  
Value is a boolean  
Default is false

**data-equalizerows-here=".link-title"**  
Selects a descendent element where the equalizing will be applied  
Value is a selector  
Defaults to the item we're working with

**data-equalizerows-property="height"**  
CSS properties used to equalize items. "padding-bottom,padding-top" works  
Value is a comma-separated list of CSS properties  
Defaults to height

**data-equalizerows-type="0"  
data-equalizerows-coltype="0"**  
Defines which items are in a row or column  
Value is one of -1,0,1,2,3  
Defaults to 0

**data-equalizerows-applyto="last"**  
Sets which items in a column are equalized  
Value is one of first,last,all  
Defaults to last


Row and Col Types
-----------------
The following explains what the different row and col types are when used in:  
data-equalizerows-type="0"  
data-equalizerows-coltype="0"

**Type 0**  
Items that start at the same y offset are in a row

**Type 1**  
Adds items to the row or col that start within the length of the longest Type 0 item

**Type 2**  
Adds items to the row or col that start and end within the length of the longest Type 0 item

**Type 3**  
Adds items to the row or col that end within the length of the longest Type 0 item

**Type -1**  
All items in the collection are considered in a row or col


Advanced
--------

###With JavaScript
```
<script>
	var options = {
		//type: 0
		//,active: 1
		//,property: 'height'
		//,here: 'a'
		//,colType: 0
		//,applyTo: 'first'
		//,callback: function() {}
	};
	$('.link').equalizeRows(options);
</script>
```

###Callback
Add a callback that is called after each instance
```
<script>

    $('.stuff').equalizeRows({

		callback: function() {

			this; // this is the whole collection, i.e., .stuff

			// The following detects a RoyalSlider instance and calls its resize function
			$(this).each(function() {
				var royalSlider = $(this).data('royalSlider');
				if (royalSlider && royalSlider.updateSliderSize) {
					royalSlider.updateSliderSize();
				}
			});

		}

	});

</script>
```
