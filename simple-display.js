/**
 * Fork from https://github.com/arjun024/facebook-friends-ranking-score/
 */
// ---------------------------------------------------------------------
(function(w, d) {
	'use strict';

	function creator(o, data, node) {
		var content = d.createElement(node);
		content.cellspacing = '3';
		var cell = d.createTextNode(data);
		content.appendChild(cell);
		o.appendChild(content);
	}

	function displayData(arr) {
		var table = d.createElement('table'),
			thead = d.createElement('thead');

		table.appendChild(thead);

		var row = d.createElement('tr');
		creator(row, 'Name', 'th');
		creator(row, 'Type', 'th');
		creator(row, 'Score', 'th');
		thead.appendChild(row);

		var tbody = d.createElement('tbody');
		table.appendChild(tbody);

		var t = arr.length;
		for (var i = 0; i < t; i++) {
			var type = arr[i].type,
				_row = d.createElement('tr');

			creator(_row, arr[i].text, 'td');
			creator(_row, Object.keys(arr[i].grammar_costs)[0].slice(0, -1).substring(1), 'td');
			creator(_row, arr[i].grammar_costs[Object.keys(arr[i].grammar_costs)[0]], 'td');
			tbody.appendChild(_row);
		}
		d.body.innerHTML = '';
		d.body.appendChild(table);
	}

	function getUserId() {
		try {
			//need to find user's unique id. Trying each of the below until succeeds.
			//facebook keeps changing their variables and keys
			var currentUser = require('CurrentUserInitialData');
			return currentUser.USER_ID || currentUser.ACCOUNT_ID || currentUser.id || require('Env').user;
		} catch (e) {
			// e.message: require is not defined
			
			// Grab user ID from cookie
			var ck = d.cookie.match(/c_user=([0-9]+)/);
			if (ck === null) {
				return 0;
			}

			// ["c_user=XXX", "XXX"]
			return ck[1];
		}
	}

	// Make sure the current tab is Facebook
	if (w.top.location.hostname.indexOf('facebook.com') > -1) {
		var id = getUserId();

		// Check login status
		if (parseInt(id) === 0) {
			console.error('Please login to continue!');
		} else {
			var url = '//www.facebook.com/ajax/typeahead/search/facebar/bootstrap/?viewer=' + id + '&__a=1',
				x = new XMLHttpRequest();

			x.onreadystatechange = function() {
				if (x.readyState === 4 && x.status === 200) {
					displayData(JSON.parse(x.responseText.substr(9)).payload.entries);
				}
			};
			x.open('GET', url, true);
			x.send();
		}
	}
})(window, document);