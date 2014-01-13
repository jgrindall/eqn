var Matcher = function(){
	
};

Matcher.SIZES = [{w:4,h:4}, {w:4,h:8}];

Matcher.prototype.match = function(w, h, data){
	this.w = w;
	this.h = h;
	this.data = data;
	this.discreteData = [ ];
	this.discretize();
	var i, d, minD, minIndex, size;
	minD = Infinity;
	minIndex = Infinity;
	for(i = 0; i <= Matcher.KEYS.length-1;i++){
		size = Matcher.SIZES [ Matcher.KEYS[i].size ];
		d = this.getDistance(this.discreteData[Matcher.KEYS[i].size], Matcher.KEYS[i].data, size.w, size.h);
		if(d < minD){
			minD = d;
			minIndex = i;
		}
	}
	return {symbol:Matcher.KEYS[minIndex].symbol, d:d};
};

Matcher.prototype.discretize = function(){
	var i, j, k, dw, dh;
	for(k = 0; k <= Matcher.SIZES.length-1; k++){
		dw = Matcher.SIZES[k].w;
		dh = Matcher.SIZES[k].h;
		this.discreteData[k] = [ ];
		for(i = 0; i <= dw; i++){
			this.discreteData[k][i] = [ ];
			for(j = 0; j <= dh - 1; j++){
				this.discreteData[k][i][j] = this.getDiscretePoint(i, j, dw, dh);
			}
		}
	}	
};	

Matcher.prototype.getDistance = function(data0, data1, w, h){
	var i, j, e, d2 = 0, p0, p1;
	for(i0 = 0; i0 <= w - 1; i0++){
		for(j0 = 0; j0 <= h - 1; j0++){
			for(i1 = 0; i1 <= w - 1; i1++){
				for(j1 = 0; j1 <= h - 1; j1++){
					p00 = data0[i0][j0];
					p01 = data0[i1][j1];
					p10 = data1[i0][j0];
					p11 = data1[i1][j1];
					e = (i0 - i1)*(i0 - i1) + (j0 - j1)*(j0 - j1);
					d2 += Math.exp(-0.5*e)*(p00 - p10)*(p01 - p11);
				}
			}
		}
	}
	return d2;
};

Matcher.prototype.getDiscretePoint = function(i, j, dw, dh){
	var x, y, w, h;
	x = this.w * (i/dw);
	y = this.h * (j/dh);
	w = this.w / dw;
	h = this.h / dh;
	return this.getArea( {x:x, y:y, w:w, h:h} );
};

Matcher.prototype.getArea = function(rect){
	var i, j, r, a = 0;
	for(i = 0; i <= this.w - 1; i++){
		for(j = 0; j <= this.h - 1; j++){
			if(this.data[i][j]){
				r = {x:i, y:j, w:1, h:1};
				a += this.getOverlapArea(r, rect);
			}
		}
	}
	return a/(rect.w * rect.h);
};

Matcher.prototype.getOverlapArea = function(r1, r2){
	var r3, r4, overlap, dx, dy;
	r3 = {left:r1.x, right:r1.x + r1.w, top: r1.y + r1.h, bottom: r1.y};
	r4 = {left:r2.x, right:r2.x + r2.w, top: r2.y + r2.h, bottom: r2.y};
	overlap = {};
	overlap.left = Math.max(r3.left, r4.left);
	overlap.right = Math.min(r3.right, r4.right);
	overlap.top = Math.min(r3.top, r4.top);
	overlap.bottom = Math.max(r3.bottom, r4.bottom);
	dx = overlap.right - overlap.left;
	dy = overlap.top - overlap.bottom;
	if(dx > 0 && dy > 0){
		return (dx * dy);
	}
	return 0;
};


Matcher.D_WIDTH = 4;
Matcher.D_HEIGHT = 4;
Matcher.KEYS = [   {"size":0,"symbol":"a", data:[[0,1,1,1],[1,1,0,1],[1,1,1,0],[0,0,0,1] ]} , {"size":1,"symbol":"b", data:[[0,1,1,1,1,1,1,1],[0,0,0,0,0,1,0,1],[0,0,0,0,0,1,0,1],[0,0,0,0,0,1,1,1]  ]}  ];

