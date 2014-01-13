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

Utils.getStrips = function(a, search){
	var c, i, prevc = false, strips = [ ], s = [ ];
	for(i = 0; i <= a.length - 1; i++){
		c = (a[i] === search);
		if(c){
			if(!prevc){
				s[0] = i;
			}
		}
		else{
			if(prevc){
				s[1] = i - 1;
				strips.push(s);
				s = [ ];
			}
		}
		prevc = c;
	}
	return strips;
};