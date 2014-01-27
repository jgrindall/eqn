var Graph = function(adj){
	this.adj = adj;
	this.num = adj.length;
};

Graph.prototype.getNeighbours = function(i){
	var r = [ ];
	for(var j = 0; j<= this.num - 1;j++){
		if(i != j && this.adj[i][j]){
			r.push(j);
		}
	}
	return r;
};

Graph.prototype.getNext = function(){
	var i;
	for(i = 0;i <= this.visited.length-1; i++){
		if(!this.visited[i]){
			return i;
		}
	}
	return -1;
};

Graph.prototype.allDone = function(){
	return (this.getNext() === -1);
};

Graph.prototype.doNext = function(){
	var next, top, neighbours;
	next = this.getNext();
	this.stack.push(next);
	this.visited[next] = true;
	this.temp = [ ];
	var n = 0;
	while(!this.stack.isEmpty() && n < 10){
		top = this.stack.pop();
		this.temp.push(top);
		this.visited[top] = true;
		neighbours  = this.getNeighbours(top);
		neighbours = Utils.remove(neighbours, Utils.match(this.visited, true));
		this.stack.addAll(Utils.reverse(neighbours));
		n++;
	}
	this.components.push(this.temp);
};

Graph.prototype.getConnected = function(){
	this.temp = [ ];
	this.components = [ ];
	this.stack = new NoRepeatStack();
	this.visited = Utils.fillConstant(false, this.num);
	var k = 0 ;
	while(!this.allDone() && k < 10){
		this.doNext();
		k++;
	}
	return this.components;
};
