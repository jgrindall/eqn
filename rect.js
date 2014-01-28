
/* Rect */

var Rect = function(bounds, data, index){
	this.bounds = bounds;
	this.index = index;
	this.copyData(data);
	var matcher = new Matcher(this.data);
	this.match = matcher.match();
	this.matched = (this.match.d < Matcher.TOLERANCE);
	console.log("match "+JSON.stringify(this.match));
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



/* Canvas */

var Canvas = function(bounds, data, context){
	this.data = data;
	this.bounds = bounds;
	this.context = context;
	this.getChildren();
	this.highlight();
	this.row = new Row( this.children );
};

Canvas.prototype.linearise = function(){
	return this.row.linearise();
};


Canvas.prototype.highlight = function(child){
	this.context.lineWidth = 1;
	var i, child, num, top, left;
	$("#numbers").empty();
	for(i = 0; i <= this.children.length - 1; i++){
		child = this.children[i];
		left = child.bounds.x;
		top = child.bounds.y;
		num = "<span class='num' style='position:absolute;top:"+top+"px;left:"+left+"px;'>"+i+"</span>";
		$("#numbers").append(num);
		if(child.matched){
			this.context.strokeStyle = ['#00ff00','#00dd00','#00bb00','#009900','#007700','#005500','#003300','#001100'][i % 8];
		}
		else{
			this.context.strokeStyle = ['#ff0000','#dd0000','#bb0000','#990000','#770000','#550000','#330000','#110000'][i % 8];
		}
		this.context.strokeRect(child.bounds.x,child.bounds.y,child.bounds.w,child.bounds.h);
		
	}
};

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

Canvas.prototype.rectHasPoint = function(rect){
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

	
Canvas.prototype.getData = function(){
	
};

Canvas.prototype.getChild = function(p){
	var box = this.getBoundingBox(p);
	if(box.w === this.bounds.w && box.h === this.bounds.h){
		return null;
	}	
	var bounds = {x:box.x, y:box.y, w:box.w, h:box.h};
	return new Rect(bounds, this.data, this.children.length);
};

Canvas.prototype.getBoundingBox = function(p){
	var r = {x : p.x,   y : p.y,   w : 1,   h : 1};
	var complete = false;
	while(!complete){
		//console.log("r is "+JSON.stringify(r));
		complete = true;
		if(this.rightBorder(r)){
			//console.log("rb");
			r.w = r.w + 1;
			complete = false;
		}
		else if(this.topRight(r)){
			//console.log("tr");
			r.w = r.w + 1;
			r.y = r.y - 1;
			r.h = r.h + 1;
			complete = false;
		}
		else if(this.bottomRight(r)){
			//console.log("br");
			r.w = r.w + 1;
			r.h = r.h + 1;
			complete = false;
		}
		else if(this.topBorder(r)){
			//console.log("tb");
			r.y = r.y - 1;
			r.h = r.h + 1;
			complete = false;
		}
		else if(this.bottomBorder(r)){
			//console.log("bb");
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
		//console.log("br check: "+JSON.stringify( {x:r.x + r.w, y:r.y + 1, w:1, h:1}  ));
		return this.rectHasPoint({x:r.x + r.w, y:r.y + r.h + 1, w:1, h:1});
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
	var c, components, r, i, j, adj;
	adj = this.getAdj();
	components = new Graph(adj).getConnected();
	for(i = 0; i <= components.length-1; i++){
		r = [ ];
		c = components[i];
		for(j = 0; j <= c.length-1; j++){
			r.push(this.children[c[j]]);
		}
		this.cols.push(new Column(r));
	}
};

Row.prototype.getAdj = function(){
	var adj = [ ];
	for(var i = 0; i <= this.children.length-1;i++){
		var r = [ ];
		for(var j = 0; j <= this.children.length-1;j++){
			if(i === j){
				r.push(false);
			}
			else{
				r.push(this.overlaps(i, j));
			}
		}
		adj.push(r);
	}
	return adj;
};






/* Column */

var Column = function(children){
	Group.call(this, children);
	if(this.children.length >= 3){
		this.getFrac();
	}
};

Column.prototype = Object.create(Group.prototype);
Column.prototype.constructor = Column;


Column.prototype.linearise = function(){
	var lin;
	if(this.fraction){
		lin = "{"+this.numerator.linearise()+"}/{"+this.denominator.linearise()+"}";
	}
	else if(this.children.length === 1){
		var child = this.children[0];
		if(child.matched){
			if(child.match.symbol === Matcher.HLINE){
				lin = "-";
			}
			else{
				lin = child.match.symbol;
			}
		}
		else{
			lin = Matcher.UNKNOWN;
		}
	}
	else{
		lin = Matcher.UNKNOWN;
	}
	return " |" + lin + "| ";
};

Column.prototype.getFrac = function(){
	var i, child, n, d;
	for(i = 0; i <= this.children.length - 1;i++){
		child = this.children[i];
		if(child.match.symbol === Matcher.HLINE && child.matched && child.bounds.w > 0.75*this.bounds.w && this.isMiddleY(child)){
			n = this.getNumerator(child);
			d = this.getDenominator(child);
			if(n.length >= 1 && d.length >= 1){
				this.fraction = child;
				this.numerator = new Row(n);
				this.denominator = new Row(d);
				break;
			}
		}			
	}
	// poach other chldren from other places.
	
};


Column.prototype.getNumerator = function(line){
	var i, child, r = [ ], bottom;
	console.log("look for numerator in "+JSON.stringify(this.children));
	for(i = 0;i<=this.children.length - 1;i++){
		child = this.children[i];
		console.log("look for numerator in "+child.index);
		bottom = child.bounds.y + child.bounds.h - 1;
		if(bottom < line.bounds.y){
			r.push(child);
		}
	}
	console.log("GOT NUMERATOR "+JSON.stringify(r));
	return r;
};

Column.prototype.getDenominator = function(line){
	var i, child, r = [ ], top;
	console.log("look for denominator in "+JSON.stringify(this.children));
	for(i = 0;i<=this.children.length - 1;i++){
		child = this.children[i];
		console.log("look for denominator in "+child.index);
		top = child.bounds.y;
		if(top > line.bounds.y + line.bounds.h - 1){
			r.push(child);
		}
	}
	console.log("GOT DENOMINATOR "+JSON.stringify(r));
	return r;
};



