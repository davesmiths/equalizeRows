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
_CSS property to change, defaults to height, but is a comma separated list e.g. "padding-bottom,padding-top" will work too_

Advanced Options
----------------

data-equalizerows-type and data-equalizerows-colType
_The row and column type being used, defaults to 0_
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