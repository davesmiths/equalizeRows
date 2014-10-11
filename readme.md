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

data-equalizerows=".link"
_selector: Turns on equalizerows and indicates which items to work with_

data-equalizerows-active
_boolean: Turns on window.resize event handling, default is false_

data-equalizerows-here=".link-title"
_selector: Selects a descendent element where the equalizing will be applied, defaults to the item we're working with_

data-equalizerows-property="height"
_comma-separated list of CSS properties: CSS properties used to equalize items, defaults to height. "padding-bottom,padding-top" will work_

data-equalizerows-type="0"
data-equalizerows-coltype
_-1,0,1,2,3: Defines which items are in a row or column, defaults to 0_

data-applyto="last"
_first,last,all: Defaults to last. Sets which items in a column are equalized_


Row and Col Types
-----------------

Type 0
_Items that start at the same y offset are in a row_

Type 1
_Includes items that start within the length of the longest Type 0 item_

Type 2
_Includes items that start and end within the length of the longest Type 0 item_

Type 3
_Includes items that end within the length of the longest Type 0 item_

Type -1
_All items in the collection are considered in a row_


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
