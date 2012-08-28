//Copyright (c) 2012  #douhack
//authors: wk, G3D, vessi, zasadnyy
//vim: set sw=2 sts=2 ts=8 et syntax=javascript:

//This file depends on JQuery $.totalStorage

// (c) wk
//
// USAGE:
// assuming there is following entry in localStorage:
// test     |   {'ololo': 100500, 'tmp': {'sdf': 'ololo', 'k': 'v'}}
// $.storage.get('test.tmp.k')           // will return "v"
// $.storage.set('test.tmp.foo': 'bar')  // will change previous to 
// test     |   {'ololo': 100500, 'tmp': {'sdf': 'ololo', 'k': 'v', 'foo': 'bar'}}
// $.storage.inc('ololo', 100500)  // will change previous to 
// test     |   {'ololo': 201000, 'tmp': {'sdf': 'ololo', 'k': 'v', 'foo': 'bar'}}

$.storage = {
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
            if (typeof(val) === 'undefined')
				return;
            var v = value;
            
            while (typeof(p = spath.pop()) !== 'undefined')
            {
                var tmp = v;
                v = {};
                v[p] = tmp;
            }
            
            //console.log('v = ' + v);
            //console.log('val = ' + val);
            $.extend(true, val, v);
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
					prev = parseInt(prev);
			}
			
			//console.log(prev);
			//console.log(typeof prev);
			
			var res = prev + inc;
			
			//console.log(res);
			//console.log(typeof res);
			
            $.storage.set(path, res);
        }
};