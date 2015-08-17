// Usage: 
//
// 1. Put this in the file that gets first loaded by RequireJS
// 2. Once the page has loaded, type window.rtree.map() in the console
//    This will map all dependencies in the window.rtree.tree object
// 3. To generate UML call window.rtree.toUml(). The output can be used
//    here: http://yuml.me/diagram/scruffy/class/draw
requirejs.onResourceLoad = function (context, map, depMaps) {
  if (!window.rtree) {
    window.rtree = {};
    window.rtree.tree = {};
	window.rtree.map = function() {
	  var dep, key, rt, val, _i, _len, _ref;
	  rt = rtree.tree;
	  for (key in rt) {
		val = rt[key];
		if (rt.hasOwnProperty(key)) {
		  _ref = val.deps;
		  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		    dep = _ref[_i];
		    val.map[dep] = rt[dep];
		  }
		}
	  }
	};
	window.rtree.toUml = function() {
	  var dep, key, rt, uml, val, _i, _len, _ref;
	  rt = rtree.tree;
	  uml = [];
	  for (key in rt) {
		val = rt[key];
		if (rt.hasOwnProperty(key)) {
		  _ref = val.deps;
		  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		    dep = _ref[_i];
		    uml.push("[" + key + "]->[" + dep + "]");
		  }
		}
	  }
	  return uml.join("\n");
	};

  }
  r = window.rtree.tree;
  o = {deps: [], map: {}};
  if (!r[map.name]) {
    r[map.name] = o;
  }
  if (map.parentMap && map.parentMap.name) {
    if (!r[map.parentMap.name]) {
      r[map.parentMap.name] = o;
    }
    if (map.parentMap.name !== map.name) {
      r[map.parentMap.name].deps.push(map.name);
    }
  }
};