(function(window,$,undefined){'use strict';function EqualColumns(element,options){var defaults={extraHeight:0,columnClass:'.column',ignoreClass:'.iso-height-ignore',skipClass:'.iso-height-skip',onInit:function(){}};this.options=$.extend({},defaults,options);this.element=element;this.$container_elem=$(element);this.$cols=$(this.options.columnClass,this.$container_elem).not(this.options.ignoreClass);this.heights=[];this.init();}
EqualColumns.prototype={init:function(){var self=this;self.options.onInit.call(self);$(window).on('load',function(){self.applyOrReset();});$(window).on('resize',function(){wb.debounce(self.applyOrReset(),300);});},applyOrReset:function(){var self=this;if(wb.largerThan('tablet-wide')){self.applyHeights();}else{self.resetHeights();}},resetHeights:function(){var self=this;self.heights=[];self.$cols.css('min-height','0');},applyHeights:function(){var self=this;self.resetHeights();self.$cols.each(function(){if($(this).is(self.options.skipClass)){return true;}
var colHeight=$(this).outerHeight();self.heights.push(colHeight);});var max=Math.max.apply(Math,self.heights);self.$cols.css('min-height',max+self.options.extraHeight);}};$.extend($.fn,{equalcolumns:function(options){return this.each(function(){if(!$.data(this,'wb_'+'equalcolumns')){$.data(this,'wb_'+'equalcolumns',new EqualColumns(this,options));}});}});})(this,jQuery);