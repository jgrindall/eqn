var Rect = function(x, y, w, h, data){
	this.data = [ ];
	this.children = [ ];
	this.match = false;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.copyData(data);
	this.process();
};

Rect.prototype.process = function(){
	this.match = matcher.match(this.w, this.h, this.data);
	console.log("found "+JSON.stringify(this.match));
	if(this.match.d > 10){
		console.log("find children");
		this.getChildren();
	}
	// find fractions, brackets, powers	
};

Rect.prototype.getChildren = function(){
	var left, child;
	left = this.findLeftPoint();
	while(left){
		child = this.getChild(left);
		if(child){
			this.children.push(child);
			left = this.findLeftPoint();
		}
		else{
			left = false;
		}
	}
};

Rect.prototype.pointInChild = function(p, child){
	var inx = ( (p.x <= child.x +child.w) && (p.x >= child.x) );
	var iny = ( (p.y <= child.y +child.h) && (p.y >= child.y) );
	return (inx && iny);
};

Rect.prototype.pointInAnyChild = function(p){
	for(var i = 0; i <= this.children.length - 1; i++){
		if(this.pointInChild(p, this.children[i])){
			return true;
		}
	}
	return false;
};

Rect.prototype.findLeftPoint = function(){
	for(var i = 0; i <= this.w - 1; i++){
		for(var j = 0; j <= this.h - 1; j++){
			var p = {x:i, y:j};
			if(this.data[i][j] && !this.pointInAnyChild(p)){
				return p;
			}
		}
	}
	return null;
};

Rect.prototype.getChild = function(p){
	var box = this.getBoundingBox(p);
	if(box.x === this.x && box.y === this.y && box.w === this.w && box.h === this.h){
		return null;
	}	
	return new Rect(box.x, box.y, box.w, box.h, this.data);
};

Rect.prototype.getBoundingBox = function(p){
	var r = {x : p.x,   y : p.y,   w : 1,   h : 1};
	var complete = false;
	while(!complete){
		complete = true;
		if(this.rightBorder(r)){
			r.w = r.w + 1;
			complete = false;
		}
		else if(this.topBorder(r)){
			r.y = r.y - 1;
			r.h = r.h + 1;
			complete = false;
		}
		else if(this.bottomBorder(r)){
			r.h = r.h + 1;
			complete = false;
		}
		else{
			complete = true;
		}
	}
	return r;
};

Rect.prototype.rightBorder = function(r){
	if(r.x + r.w === this.w ){
		return false;
	}
	else{
		return this.rectHasPoint({x:r.x + r.w, y:r.y, w:1, h:r.h});
	}
};

Rect.prototype.topBorder = function(r){
	if(r.y  === 0){
		return false;
	}
	else{
		return this.rectHasPoint({x:r.x, y:r.y - 1, w:r.w, h:1});
	}
};

Rect.prototype.bottomBorder = function(r){
	if(r.y + r.h === this.h){
		return false;
	}
	else{
		return this.rectHasPoint({x:r.x, y:r.y + r.h, w:r.w, h:1});
	}
};

Rect.prototype.rectHasPoint = function(r){
	var i, j;
	for(i = 0; i <= r.w - 1; i++){
		for(j = 0; j <= r.h - 1; j++){
			if(this.data[r.x + i][r.y + j]){
				return true;
			}
		}
	}
	return false;
};

Rect.prototype.copyData = function(data){
	var i, j;
	for(i = 0; i <= this.w - 1; i++){
		this.data[i] = [ ];
		for(j = 0; j <= this.h - 1; j++){
			this.data[i][j] = data[i + this.x][j + this.y];
		}
	}
};

Rect.prototype.getFullColumns = function(){
	var full, r = [ ];
	for(i = 0; i <= this.w - 1; i++){
		full = this.columnFull(i);
		r.push(full);
	}
	return r;
};

Rect.prototype.getFullRows = function(){
	var full, r = [ ];
	for(i = 0; i <= this.h - 1; i++){
		full = this.rowFull(i);
		r.push(full);
	}
	return r;
};

Rect.prototype.columnFull = function(i){
	for(j = 0; j <= this.h - 1;j++){
		if(this.data[i][j]){
			return true;
		}
	}
	return false;
};

Rect.prototype.rowFull = function(i){
	for(j = 0; j <= this.w - 1;j++){
		if(this.data[j][i]){
			return true;
		}
	}
	return false;
};

Rect.prototype.getLeftCorner = function(){
	var i = Utils.findFirst(this.fullColumns, true);
	if(i>=0){
		var j = Utils.findFirst(this.data[i], true);
		if(j>=0){
			return {x:i, y:j};
		}
		return null;
	}
	return null;
};
