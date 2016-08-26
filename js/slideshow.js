(function () {

    function loadScript(url, callback) {

        var script = document.createElement("script")
        script.type = "text/javascript";

            script.onload = function () {
                callback();
            };

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
	
	if (window.jQuery) {
		runMain();
	} else {
		loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js", function () {
			 //jQuery loaded
			 runMain();
		});
	}


})();

var getContentGalleryPathName = function (path, type) {
	var splitpath = path.split('/');
	var loc = -1;
	for (var i = 0; i < splitpath.length; i++) {
		if (splitpath[i].toUpperCase() == type.toUpperCase()) {
			loc = i;
		}
	}
	if (~loc) {
		splitpath[loc] = 'ContentGallery';
	}
	
	return splitpath.join('/');
}

var getContentGalleryUrl = function (type) {
	var newPathName = getContentGalleryPathName(window.location.pathname, type);
	var parser = document.createElement('a');
	parser.href = window.location.href;
	parser.pathname = newPathName;
	
	return parser.href;
}

var checkNull = function (value) {
	return !value ? '' : value
}

var getFullImageFromThumb = function (path) {
	var splitpath = path.split('/');
	splitpath[splitpath.length - 1] = splitpath[splitpath.length - 1].split('_').pop();
	return splitpath.join('/')
}

var addSlides = function () {
	var $d = $('div[data-slides]').first();
	var $j = $.parseJSON($d.attr('data-slides'));
	//var n = parseInt($('span.slidetotal').text());
	var n = $j.length;
	$('#activeArticle').empty();
	var title = '';
	var body = '';

	for (var i = 1; i < n; i++) {
		var bottom = function() {if (i == (n-1)) {return '<hr>'} else {return ''}}
		title = checkNull($j[i].Title);
		body = checkNull($j[i].Body);
		var imgcheck = '';
    
		// Check if body contains an image. If yes, skip the if statement. If no, add the image to the content
		if (body.indexOf('<img') == -1) {
			imgcheck = '<img src="' + getFullImageFromThumb($j[i].Thumb) + '">';
		}

		var $new = $('<div class="content-gallery-content" data-slide="' + i + '"><hr><h2>' + 
			title + '</h2>' + body + bottom() + imgcheck + '</div>');
    
		$('#activeArticle').append($new);
	}
}

function runMain() {

	var $datatype = $('article.content.article').first().attr('data-type');

	if ($datatype == 'contentgallery') {

		addSlides();

	} else if ($datatype == 'gallery') {

		var n = $('div.photogroup').find('a').length;
		var contentGalleryUrl = getContentGalleryUrl($datatype);
		var $curelem = $('div.article-container.loaded.active').find('div.hidden').first().load(contentGalleryUrl + 
			' div[data-slides]', addSlides);

	}
}
