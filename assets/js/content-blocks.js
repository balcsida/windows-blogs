(function(window,$,undefined){'use strict';$(document).ready(function(){$('.lazy-image').unveil(100);if($('.m-product-slideshow').length){$('.m-product-slideshow').each(function(){var $slideshow=$(this),$slideshowNav=$slideshow.next('.m-product-slideshow-nav');$slideshow.slick({slidesToShow:1,slidesToScroll:1,arrows:false,dots:false,asNavFor:$slideshowNav,lazyLoad:'ondemand',});$slideshowNav.slick({slidesToShow:6,slidesToScroll:1,asNavFor:$slideshow,arrows:false,dots:false,centerMode:false,focusOnSelect:true,lazyLoad:'ondemand',});});}
$('.m-hero').each(function(){$(this).on('inview',function(event,visible){if(visible===true){$(this).addClass('visible');}});});$('.embed-lightbox').magnificPopup({type:'inline',preloader:false});$('#m-menu a[href*=#]:not([href=#])').on('click',function(){if(location.pathname.replace(/^\//,'')==this.pathname.replace(/^\//,'')&&location.hostname==this.hostname){var target=$(this.hash);target=target.length?target:$('[name='+this.hash.slice(1)+']');if(target.length){$('html, body').animate({scrollTop:target.offset().top-106},{duration:1000,done:function(){if($('#main-header').hasClass('toggled')){$('#main-header').removeClass('toggled');}}});return false;}}});});$(document).on('click','.m-play-embed',function(e){e.preventDefault();var $this=$(this);var videoContainer=$(this).attr('href'),$video=$($this.data('iframe')),videoURL=$video.attr('src');$(videoContainer).append($video);$video.attr('src',videoURL+'&autoplay=1');$(videoContainer).fadeIn(600,function(){$this.addClass('hidden-thumb');});$('.m-play-close').one('click',function(e){e.preventDefault();$video.attr('src',videoURL);$(this).parent().hide();$(this).closest('.collage-item, .col-media').find('.m-play-embed').removeClass('hidden-thumb');});});$(document).on('click','.append-media',function(e){e.preventDefault();var $button=$(this),initialText='Expand to see more +',hideText='Hide media -',$mediaContainer=$button.parent().prev('.media-container'),hidden=$mediaContainer.is(':hidden');$mediaContainer.slideToggle(function(){if(hidden){$button.text(hideText);$mediaContainer.find('.lazy-image').trigger('unveil');}else{$button.text(initialText);}});});$('body').on('mouseenter','.embedded-popup',function(){this.select();});})(this,jQuery);