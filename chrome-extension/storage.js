// vim: set sw=2 sts=2 ts=8 et syntax=javascript:
/*
@copyright: (c) 2012, #douhack
@author: webknjaz
@version: 1.0.2 Beta
@license: GNU/GPL v3
@depends on: JQuery and $.totalStorage plugin
*/

/***********************************************************************************
 *                                                                                 *
 * (c) 2012, wk                                                                    *
 *                                                                                 *
 * USAGE:                                                                          *
 * assuming there is following entry in localStorage:                              *
 * test     |   {'ololo': 100500, 'tmp': {'sdf': 'ololo', 'k': 'v'}}               *
 * $.storage.get('test.tmp.k')             // will return "v"                      *
 * $.storage.set('test.tmp.foo': 'bar')    // will change previous to              *
 * test     |   {'ololo': 100500, 'tmp': {'sdf': 'ololo', 'k': 'v', 'foo': 'bar'}} *
 * $.storage.inc('test.ololo', 100500)          // will change previous to         *
 * test     |   {'ololo': 201000, 'tmp': {'sdf': 'ololo', 'k': 'v', 'foo': 'bar'}} *
 *                                                                                 *
 ***********************************************************************************/

$.storage = {
		'version': '1.0.2',
		'author': 'webknjaz',
		'get': function(path) {
			var spath = path.split('.');
			
			if (spath.length < 1)
				return null;
			
			var res = $.totalStorage(spath.shift());
			
			if (typeof(res) === 'undefined')
				return null;
			
			if (spath.length < 1)
				return res;
			
			while (typeof(p = spath.shift()) !== 'undefined')
			{
				if (typeof(res) === 'undefined' || res === null)
					return null;
				res = res[p];
				if (typeof(res) === 'undefined')
					return null;
			}
			
			return res;
		},
		'set': function(path, value) {
			var spath = path.split('.');
			var key = spath.shift();
			var val = $.totalStorage(key);

			
			if (typeof(val) === 'number' && val >= 10000000000000000)
				throw new Error('Out of range');
			
			var v = value;
			
			while (typeof(p = spath.pop()) !== 'undefined')
			{
				var tmp = v;
				v = {};
				v[p] = tmp;
			}
			
			//console.log('v = ' + v);
			//console.log('val = ' + val);
			val = $.extend(true, {}, val, v);
			//console.log('v = ' + v);
			//console.log('val = ' + val);
			
			$.totalStorage(key, val); // val?
		},
		'inc': function(path, inc) {
			switch (typeof(inc))
			{
				case 'undefined':
					inc = 1;
					break;
				case 'number':
					break;
				default:
					if (inc == null)
						inc = 0;
					else
						inc = parseInt(inc);
			}
			
			//console.log(inc);
			//console.log(typeof inc);
			
			var prev = $.storage.get(path);
			switch (typeof(prev))
			{
				case 'undefined':
					prev = 0;
					break;
				case 'number':
					break;
				default:
					if (prev == null)
						prev = 0;
					else
						prev = parseInt(prev);
			}
			
			//console.log(prev);
			//console.log(typeof prev);
			
			var res = prev + inc;
			
			//console.log(res);
			//console.log(typeof res);
			
			if (res == prev)
				throw new Error('Out of range');

			$.storage.set(path, res);
		}
};