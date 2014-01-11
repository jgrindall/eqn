var Rect = function(x, y, w, h, data){

	console.log("Rect constructor "+x+", "+y+", "+w+", "+h);
	
	this.data = [ ];
	this.segments = [ ];
	this.strips = [ ];
	this.width = w;
	this.height = h;
	this.copyData(x, y, w, h, data);
	this.fullColumns = this.getFullColumns();
	this.leftCorner = this.getLeftCorner();
	console.log("full columns: "+ this.fullColumns );
	console.log("leftCorner: "+ this.leftCorner );
	this.process();
};

Rect.prototype.process = function(){
	this.segmentHoriz();
};

Rect.prototype.copyData = function(x, y, w, h, data){
	var i, j;
	for(i = 0; i <= this.width - 1; i++){
		this.data[i] = [ ];
		for(j = 0; j <= this.height - 1; j++){
			this.data[i][j] = data[i + x][j + y];
		}
	}
};

Rect.prototype.segmentHoriz = function(){
	var i, strip, stripData;
	stripData = Utils.getStrips(this.fullColumns, true);
	console.log("segmentHoriz "+stripData);
	for(i = 0; i <= stripData.length-1; i++){
		console.log("make strip "+stripData[i]);
		strip = new Strip(stripData[i][0], 0, stripData[i][1] - stripData[i][0], this.height, this.data);
		this.strips.push(strip);
	}
	console.log("s length "+this.strips.length);
};

Rect.prototype.getFullColumns = function(){
	var full, r = [ ];
	for(i = 0; i <= this.width - 1; i++){
		full = this.columnFull(i);
		r.push(full);
	}
	return r;
};

Rect.prototype.columnFull = function(i){
	for(j = 0; j <= this.height - 1;j++){
		if(this.data[i][j]){
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
			return [i, j];
		}
		return null;
	}
	return null;
};

var Strip = function(){
	Rect.apply(this, arguments);
};

Strip.prototype = new Rect();

Strip.prototype.process = function(){
	
};
