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

$.storage = {
        'get': function(path){
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
                res = res[p];
                if (typeof(res) === 'undefined')
                    return null;
            }
            
            return res;
        },
        'set': function(path, value){
            var spath = path.split('.');
            var key = spath.shift();
            var val = $.totalStorage(key);
            var v = value;
            
            while (typeof(p = spath.pop()) !== 'undefined')
            {
                var tmp = v;
                v = {};
                v[p] = tmp;
            }
            
            if (typeof(val) !== 'undefined')
                $.extend(true, v, val);
            
            $.totalStorage(key, v);
        },
        'inc': function(path, inc){
            if (typeof(inc) !== 'undefined')
                inc = 1;
            
            $.storage.set(path, $.storage.get(path) + $.storage.get('config.waste_interval'));
        }
};