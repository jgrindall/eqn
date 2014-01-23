var Utils = {};
				
Utils.findFirst = function(a, search){
	// return x,y position that contains "search"
	for(var i=0;i<=a.length-1;i++){
		if(a[i] === search){
			return i;
		}
	}
	return -1;
};

Utils.findLast = function(a, search){
	// return x,y position that contains "search"
	for(var i=a.lengtgh-1; i>=0;i--){
		if(a[i] === search){
			return i;
		}
	}
	return -1;
};

Utils.fillConstant = function(val, num){
	var r = [ ];
	for(i = 1; i <= num; i++){
		r.push(val);
	}
	return r;
};

Utils.fillFrom = function(from, to){
	var r = [ ];
	for(i = from; i <= to; i++){
		r.push(i);
	}
	return r;
};
