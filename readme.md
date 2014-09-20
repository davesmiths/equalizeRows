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

Basic Options
-------------

data-equalizerows=".link"   
_Turns on equalizerows and indicates which items to work with_

data-equalizerows-active   
_Turns on window.resize event handling, default is off; false_

data-equalizerows-here=".link-title"   
_Selects a descendent element where the equalizing will be applied, defaults to the item we're working with_

data-equalizerows-property="padding-bottom"   
_CSS property to change, defaults to height, but is also a comma separated list so "padding-bottom,padding-top" will work_

Advanced Options
----------------

data-equalizerows-type and data-equalizerows-colType   
_The row and column type being used, defaults to 0_

Type 0   
_Items that start at the same y offset are in the row_

Type 1   
_Includes items that start within the length of the tallest Type 0 item_

Type 2   
_Includes items that start and end within the length of the tallest Type 0 item_

Type 3   
_Includes items that end within the length of the tallest Type 0 item_

Type -1   
_All items in the collection are considered in the row_

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