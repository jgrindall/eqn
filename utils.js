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

Utils.match = function(a, search){
	var r = [ ], val;
	for(var i = 0 ; i <= a.length - 1; i++){
		val = a[i];
		if(val === search){
			r.push(i);
		}
	}
	return r;
};

Utils.remove = function(a, toRemove){
	var r = [ ], val;
	for(var i = 0 ; i <= a.length - 1; i++){
		val = a[i];
		if(toRemove.indexOf(val) === -1){
			r.push(val);
		}
	}
	return r;
};

Utils.prepend = function(a, obj, num){
	var r = [ ];
	for(var i = 1; i <= a.length + num; i++){
		if(i <= num){
			// 1 ... num
			r.push($.extend({}, obj));
		}
		else{
			// i 			= num + 1 ...  a.length + num
			// i - num - 1 	= 0 ... a.length - 1  
			r.push(a[i - num - 1]);
		}
	}
	return r;
};


Utils.append = function(a, obj, num){
	var r = [ ];
	for(var i = 0; i <= a.length - 1 + num; i++){
		if(i <= a.length - 1){
			// 1 ... num
			r.push(a[i]);
		}
		else{
			// i 				= 	a.length   ...  a.length + num - 1
			// i - a.length 	= 	0... num-1
			r.push($.extend({}, obj));
		}
	}
	return r;
};

Utils.prependArray = function(a, row, num){
	var r = [ ];
	for(var i = 1; i <= a.length + num; i++){
		if(i <= num){
			// 1 ... num
			r.push(row.slice());
		}
		else{
			// i 			= num + 1 ...  a.length + num
			// i - num - 1 	= 0 ... a.length - 1  
			r.push(a[i - num - 1]);
		}
	}
	return r;
};


Utils.appendArray = function(a, row, num){
	var r = [ ];
	for(var i = 0; i <= a.length - 1 + num; i++){
		if(i <= a.length - 1){
			// 1 ... num
			r.push(a[i]);
		}
		else{
			// i 				= 	a.length   ...  a.length + num - 1
			// i - a.length 	= 	0... num-1
			r.push(row.slice());
		}
	}
	return r;
};


Utils.reverse = function(a){
	var r = [ ];
	for(var i = 0; i <= a.length - 1; i++){
		r.push(a[a.length - 1 - i]);
	}
	return r;
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



Utils.getTable = function(d){
	var w = d.length;
	var h = d[0].length;
	var s = "<li><table style='border:1px solid black;'><tbody>";
	for(var i = 0;i<=h-1; i++){
		s += "<tr>";
		for(var j = 0;j<=w-1; j++){
			if(d[j][i]){
				s+="<td style='background:black;'></td>";
			}
			else{
				s+="<td></td>";
			}
			
		}
		s += "</tr>";
	}
	s+="</tbody></table></li>";
	return s;
};

Utils.logImage = function(data0, data1, d){
	var s0 = Utils.getTable(data0);
	var s1 = Utils.getTable(data1);
	$("#list").append(s0);
	$("#list").append(s1);
	$("#list").append("<li>Distance "+d+"</li>");
	
};
