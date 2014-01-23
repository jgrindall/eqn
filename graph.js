var Graph = function(adj){
	this.adj = adj;
	this.num = adj.length;
	this.temp = [ ];
	this.components = [ ];
	this.visited = Utils.fillConstant(false, this.num);
};

Graph.prototype.getNeighbours = function(i){
	var r = [ ];
	for(var j = 0; j<= this.num - 1;j++){
		if(this.adj[i][j]){
			r.push(j);
		}
	}
	return r;
};

Graph.prototype.countVisited = function(n){
	var c = 0;
	for(var i = 0;i <= n.length-1; i++){
		if(this.visited[n[i]]){
			c++;
		}
	}
	return c;
};

Graph.prototype.visit = function(i){
	this.temp.push(i);
	this.visited[i] = true;
	var neighbours = this.getNeighbours(i);
	var visitCount = this.countVisited(neighbours);
	if(visitCount === neighbours.length){
		this.components.push(this.temp);
		this.temp = [ ];
	}
	else{
		this.visitArray(neighbours);
	}
};

Graph.prototype.getConnected = function(){
	var all = Utils.fillFrom(0, this.num - 1);
	this.visitArray(all);
	return this.components;
};

Graph.prototype.visitArray = function(arr){
	for(var i = 0; i <= arr.length - 1;i++){
		if(!this.visited[arr[i]]){
			this.visit(arr[i]);
		}
	}
};

