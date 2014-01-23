
/* Rect */

var Rect = function(bounds, data){
	if(arguments.length === 2){
		this.bounds = bounds;
		this.copyData(data);
		this.match = matcher.match(this.bounds.w, this.bounds.h, this.data);
		this.matched = (this.match.d < Matcher.TOLERANCE);
	}
};

Rect.prototype.copyData = function(data){
	var i, j;
	this.data = [ ];
	for(i = 0; i <= this.bounds.w - 1; i++){
		this.data[i] = [ ];
		for(j = 0; j <= this.bounds.h - 1; j++){
			this.data[i][j] = data[i + this.bounds.x][j + this.bounds.y];
		}
	}
};

Rect.prototype.columnFull = function(i){
	for(j = 0; j <= this.bounds.h - 1;j++){
		if(this.data[i][j]){
			return true;
		}
	}
	return false;
};

Rect.prototype.rectHasPoint = function(rect){
	var i, j;
	for(i = 0; i <= rect.w - 1; i++){
		for(j = 0; j <= rect.h - 1; j++){
			if(this.data[rect.x + i][rect.y + j]){
				return true;
			}
		}
	}
	return false;
};






/* Canvas */

var Canvas = function(bounds, data){
	Rect.apply(this, arguments);
	this.getChildren();
	this.row = new Row( this.children );
	console.log(this.row.linearise());
};

Canvas.prototype = Object.create(Rect.prototype);
Canvas.prototype.constructor = Canvas;

Canvas.prototype.getChildren = function(){
	var left, child;
	this.children = [ ];
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

Canvas.prototype.findLeftPoint = function(){
	var i, j, p;
	for(i = 0; i <= this.bounds.w - 1; i++){
		for(j = 0; j <= this.bounds.h - 1; j++){
			p = {x:i, y:j};
			if(this.data[i][j] && !this.pointInAnyChild(p)){
				return p;
			}
		}
	}
	return null;
};

Canvas.prototype.pointInChild = function(p, child){
	var inx = ( (p.x <= child.bounds.x + child.bounds.w) && (p.x >= child.bounds.x) );
	var iny = ( (p.y <= child.bounds.y + child.bounds.h) && (p.y >= child.bounds.y) );
	return (inx && iny);
};

Canvas.prototype.pointInAnyChild = function(p){
	for(var i = 0; i <= this.children.length - 1; i++){
		if(this.pointInChild(p, this.children[i])){
			return true;
		}
	}
	return false;
};

Canvas.prototype.getChild = function(p){
	var box = this.getBoundingBox(p);
	if(box.w === this.bounds.w && box.h === this.bounds.h){
		return null;
	}	
	var bounds = {x:box.x, y:box.y, w:box.w, h:box.h};
	return new Rect(bounds, this.data);
};

Canvas.prototype.getBoundingBox = function(p){
	var r = {x : p.x,   y : p.y,   w : 1,   h : 1};
	var complete = false;
	while(!complete){
		complete = true;
		if(this.rightBorder(r)){
			r.w = r.w + 1;
			complete = false;
		}
		else if(this.topRight(r)){
			r.w = r.w + 1;
			r.y = r.y - 1;
			r.h = r.h + 1;
			complete = false;
		}
		else if(this.bottomRight(r)){
			r.w = r.w + 1;
			r.h = r.h + 1;
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

Canvas.prototype.rightBorder = function(r){
	if(r.x + r.w === this.bounds.w ){
		return false;
	}
	else{
		return this.rectHasPoint({x:r.x + r.w, y:r.y, w:1, h:r.h});
	}
};

Canvas.prototype.topRight = function(r){
	if(r.x + r.w === this.bounds.w || r.y === 0 ){
		return false;
	}
	else{
		return this.rectHasPoint({x:r.x + r.w, y:r.y - 1, w:1, h:1});
	}
};

Canvas.prototype.bottomRight = function(r){
	if(r.x + r.w === this.bounds.w || r.y === this.bounds.h - 1){
		return false;
	}
	else{
		return this.rectHasPoint({x:r.x + r.w, y:r.y + 1, w:1, h:1});
	}
};

Canvas.prototype.topBorder = function(r){
	if(r.y  === 0){
		return false;
	}
	else{
		return this.rectHasPoint({x:r.x, y:r.y - 1, w:r.w, h:1});
	}
};

Canvas.prototype.bottomBorder = function(r){
	if(r.y + r.h === this.bounds.h){
		return false;
	}
	else{
		return this.rectHasPoint({x:r.x, y:r.y + r.h, w:r.w, h:1});
	}
};

Canvas.prototype.getLastFull = function(start){
	while(this.fullCols[start]){
		start ++;
		if(start === this.bounds.w){
			return start - 1;
		}
	}
	return start - 1;
};

Canvas.prototype.getLeftCorner = function(){
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








/* Group */

var Group = function(children){
	if(arguments.length === 1){
		this.children = children;
		this.getSize();
	}
};

Group.prototype.overlaps = function(i, j){
	var c0 = this.children[i];
	var c1 = this.children[j];
	var i0 = (c0.bounds.x >= c1.bounds.x && c0.bounds.x <= c1.bounds.x + c1.bounds.w - 1);
	var i1 = (c1.bounds.x >= c0.bounds.x && c1.bounds.x <= c0.bounds.x + c0.bounds.w - 1)
	return i0 || i1;
};

Group.prototype.getSize = function(){
	var xmin = Infinity, ymin = Infinity, i, child, xmax = -1, ymax = -1;
	for(i = 0; i<= this.children.length - 1; i++){
		child = this.children[i];
		xmin = Math.min(xmin, child.bounds.x);
		ymin = Math.min(ymin, child.bounds.y);
		xmax = Math.max(xmax, child.bounds.x + child.bounds.w);
		ymax = Math.max(ymax, child.bounds.y + child.bounds.h);
	}
	this.bounds = {x: xmin, y: ymin, w: xmax - xmin, h: ymax - ymin};
};

Group.prototype.isMiddleY = function(child){
	var tol, y0, y1,d, p;
	tol = 25;
	y0 = child.bounds.y - this.bounds.y + child.bounds.h/2;
	y1 = this.bounds.h / 2;
	d = (Math.abs(y1 - y0));
	p = 100*d / this.bounds.h;
	return (p < tol);
};








/* Row */

var Row = function(children){
	Group.call(this, children);
	this.getAdj();
	this.getCols();
};

Row.prototype = Object.create(Group.prototype);
Row.prototype.constructor = Row;

Row.prototype.linearise = function(){
	var s = "";
	for(var i = 0; i <= this.cols.length-1;i++){
		s += this.cols[i].linearise();
	}
	return s;
};

Row.prototype.getCols = function(){
	this.cols = [ ];
	var c, components, r, i, j;
	components = new Graph(this.adj).getConnected();
	for(i = 0; i <= components.length-1; i++){
		r = [ ];
		c = components[i];
		for(j = 0; j <= c.length-1; j++){
			r.push(this.children[c[j]]);
		}
		this.cols.push(new Column(r));
	}
	console.log(this.cols.length+" cols");
};

Row.prototype.getAdj = function(){
	this.adj = [ ];
	for(var i = 0; i <= this.children.length-1;i++){
		var r = [ ];
		for(var j = 0; j <= this.children.length-1;j++){
			r.push(this.overlaps(i, j));
		}
		this.adj.push(r);
	}
};






/* Column */

var Column = function(children){
	Group.call(this, children);
	this.getFrac();
};

Column.prototype = Object.create(Group.prototype);
Column.prototype.constructor = Column;

Column.prototype.linearise = function(){
	if(this.fraction){
		return "{"+this.numerator.linearise()+"}/{"+this.denominator.linearise()+"}";
	}
	else if(this.children.length === 1){
		var child = this.children[0];
		console.log("child to linearise "+JSON.stringify(child));
		if(child.matched){
			return child.match.symbol;
		}
		else{
			return "?";
		}
	}
	else{
		return "?";
	}
};

Column.prototype.getFrac = function(){
	var i, child, n, d;
	for(i = 0; i <= this.children.length - 1;i++){
		child = this.children[i];
		if(child.match.symbol === "-" && child.matched && child.bounds.w > 0.75*this.bounds.w && this.isMiddleY(child)){
			n = this.numerator(child);
			d = this.denominator(child);
			if(n.length >= 1 && d.length >= 1){
				this.fraction = child;
				this.numerator = new Row(n);
				this.denominator = new Row(d);
				break;
			}
		}			
	}
};


Column.prototype.numerator = function(line){
	var i, child, r = [ ], bottom;
	for(i = 0;i<=this.children.length - 1;i++){
		child = this.children[i];
		bottom = child.bounds.y + child.bounds.h - 1;
		if(bottom < line.bounds.y){
			r.push(child);
		}
	}
	return r;
};

Column.prototype.denominator = function(line){
	var i, child, r = [ ], top;
	for(i = 0;i<=this.children.length - 1;i++){
		child = this.children[i];
		top = child.bounds.y;
		if(top > line.bounds.y + line.bounds.h - 1){
			r.push(child);
		}
	}
	return r;
};
