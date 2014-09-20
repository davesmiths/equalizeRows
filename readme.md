equalizeRows
============

jQuery plugin to equalise the height of items in rows and columns


Getting Started
----------
```
<script src="jquery.js"></script>
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

... or with JavaScript
```
<script>
    $('.link').equalizeRows(options);
</script>
```

Options
-------------

data-equalizerows=".link"   
_selector: Turns on equalizerows and indicates which items to work with_

data-equalizerows-active   
_boolean: Turns on window.resize event handling, default is false_

data-equalizerows-here=".link-title"   
_selector: Selects a descendent element where the equalizing will be applied, defaults to the item we're working with_

data-equalizerows-property="padding-bottom"   
_comma-separated list of CSS properties: CSS property used to equalize items, defaults to height, but is also a comma separated list so "padding-bottom,padding-top" will work_

data-equalizerows-type   
data-equalizerows-colType   
_-1,0,1,2,3: The row and column type being used, defaults to 0_

Type 0   
_Items that start at the same y offset are in a row_

Type 1   
_Includes items that start within the length of the tallest Type 0 item_

Type 2   
_Includes items that start and end within the length of the tallest Type 0 item_

Type 3   
_Includes items that end within the length of the tallest Type 0 item_

Type -1   
_All items in the collection are considered in a row_
