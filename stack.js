
var Stack = function(){
	this.s = [];
};

Stack.prototype.push = function(n){
	this.s.push(n);
};

Stack.prototype.pop = function(){
	var r = this.s.pop();
	return r;
};

Stack.prototype.isEmpty = function(){
	return this.s.length === 0;
};

Stack.prototype.addAll = function(s){
	for(var i  = 0;i <= s.length - 1;i++){
		this.push(s[i]);
	}
};


var NoRepeatStack = function(){
	Stack.call(this);
};

NoRepeatStack.prototype = Object.create(Stack.prototype);
NoRepeatStack.prototype.constructor = NoRepeatStack;

NoRepeatStack.prototype.push = function(n){
	if(this.s.indexOf(n) === -1){
		this.s.push(n);
	}
};