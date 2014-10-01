/* equalizeRows v1.0.0 https://github.com/davesmiths/equalizerows */!function(t){"use strict"
var e,i,o,r,n,c
o=100,i=[],e=function(e){var i,o,r,n,c,p,s,a,h,l,f,u,y,v,d
for(e.resize.call(e.collection),v="top",d="outerHeight","col"===e.vector&&(v="left",d="outerWidth"),c=e.collection.slice(),p=c.length;p;){if(o=[],r=[],a=[],s=[],-1===e.type)o=c
else{for(i=Number.POSITIVE_INFINITY,y=0;p>y;y+=1)h=t(c[y]),l=a[y]=h.offset()[v],f=s[y]=h[d](),i>l&&(i=l,o=[],n=0),l===i&&(o.push(c[y]),f>n&&(n=f))
if(u=i+n,0!==e.type)if(1===e.type||2===e.type)for(y=0;p>y;y+=1)t.inArray(c[y],o)<0&&(l=a[y],u>l&&(2===e.type?l+s[y]<=u&&(o.push(c[y]),r.push([l,c[y]])):(o.push(c[y]),r.push([l,c[y]]))))
else for(y=0;p>y;y+=1)t.inArray(c[y],o)<0&&(l=a[y]+s[y],u>=l&&(o.push(c[y]),r.push([a[y],c[y]])))}for(e.fn.call(o),y=0;y<r.length;y++)r[y][0]!==t(r[y][1]).offset()[v]&&(o=t(o).not(r[y][1]))
c=t(c).not(o),p=c.length}return this},n=function(t){return t.vector=t.vector||"row",t.type=void 0===t.type?0:t.type,t.active=void 0===t.active?!1:t.active,t.fn=t.fn||function(){},t.resize=t.resize||function(){},t.collection=this,t.active&&i.push(t),e(t),this},c=function(t){return t.vector="col",n.call(this,t),this},t(window).on("resize.equalizerows",function(){clearTimeout(r),r=setTimeout(function(){var t,o=i.length
for(t=0;o>t;t+=1)e(i[t])},o)}),t.fn.equalizeRows=function(e){var i,o,r,p=this
e=e||{},e.type=void 0===e.type?0:e.type,e.colType=void 0===e.colType?0:e.colType,e.applyTo=void 0===e.applyTo?"last":e.applyTo,e.property=void 0===e.property?"height":e.property,e.active=void 0===e.active?!1:e.active,e.here=void 0===e.here?void 0:e.here,e.callback=e.callback||function(){},i="array"!==t.type(e.property),i&&(e.property=e.property.split(",")),o=e.property.length,t(p).each(function(){void 0===t(this).data("uid.equalizerows")&&t(this).data("uid.equalizerows",p)}),t(this).length&&n.call(this,{type:e.type,active:e.active,fn:function(){var i,n=t(this),p=0
i=[],n.each(function(){var e,o=t(this)
e=Math.round(o.offset().top+o.outerHeight()),e>p?(i=[this],p=e):e===p&&i.push(this)}),c.call(this,{type:e.colType,fn:function(){var n,c,s,a,h,l,f
f=t(this),f.is(i)===!1&&(a=0,f.each(function(){var e,i=t(this)
e=Math.round(i.offset().top+i.outerHeight()),e>a&&(n=t(this),a=e)}),s=p-a,"last"===e.applyTo?n&&(h=n):"all"===e.applyTo?h=f:"first"===e.applyTo&&(h=f.eq(0)),c=e.here?n.find(e.here):n,h&&(l=h.length,h.each(function(){var i=e.here?t(this).find(e.here):t(this)
for(r=0;o>r;r+=1)i.css(e.property[r],parseInt(i.css(e.property[r]),10)+s/(o*l)+"px")})))}})},resize:function(){t(this).each(function(){var i=e.here?t(this).find(e.here):t(this),n=t(this).data("uid.equalizerows")
if(n===p)for(r=0;o>r;r+=1)i.css(e.property[r],"")})}}),e.callback.call(p)}}(jQuery)