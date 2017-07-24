// Code should be run on page: http://<site>.247sports.com/User/<username>/Replies

var textFile = null;
var makeTextFile = function (text) {
	var data = new Blob([text], {type: 'text/plain'});

	// If we are replacing a previously generated file we need to
	// manually revoke the object URL to avoid memory leaks.
	if (textFile !== null) {
	  window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	return textFile;
};

var getPostsOnPage = function() {
	var newPosts = '';
	var $rows = $('table.manage_tbl tbody tr');
	$rows.each(function() {
			var post = $(this).find('td:eq(2)').text().replace(/\n/g,'');
			var time = $(this).find('td:eq(3)').text();
			var lnk = $(this).find('td:last ul.lnk_lst2 li:eq(2) a').attr('href');
			newPosts += 'Page ' + curPg + '\n' + post + '\t' + time + '\n' + lnk + '\n\n';
		}
	);
	console.log('Current Page: ' + curPg);
	allPosts += newPosts;

}

function loadNextPage() {
	getPostsOnPage();
	
	if (curPg >= numPages) {
		var url = makeTextFile(allPosts);

		console.log('URL:');
		console.log(url);
		
		return;
	}
	
	curPg += 1;
	
	var newurl = window.location.href + '?Page=' + curPg + ' table.manage_tbl';
	var $curtbl = $('table.manage_tbl').remove();
	$section.load(newurl, loadNextPage);

	return;
}

function getFirstPageNum() {
	return parseInt($('a.active.pagn_link').first().text());
}

function getLastPageNum() {
	return parseInt($('a[class="pagn_link"]').last().text());
}

var allPosts = '';
var numPages = getLastPageNum();
var curPg = getFirstPageNum();

var $section = $('section.main_content.full');

loadNextPage();

// Note: Run this following code AFTER everything else has run.

/*var url = makeTextFile(allPosts);

console.log('URL:');
console.log(url);*/