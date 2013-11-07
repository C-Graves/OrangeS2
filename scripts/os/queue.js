/* ------------
   Queue.js
   
   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at http://www.w3schools.com/jsref/jsref_obj_array.asp .
   Look at the push and shift methods, as they are the least obvious here.
   
   ------------ */
   
function Queue()
{
    // Properties
    this.q = new Array();

    // Methods
    this.getSize = function() {
        return this.q.length;    
    };

    this.isEmpty = function(){
        return (this.q.length == 0);    
    };

    this.enqueue = function(element) {
        this.q.push(element);        
    };
    
    this.dequeue = function() {
        var retVal = null;
        if (this.q.length > 0)
        {
            retVal = this.q.shift();
        }
        return retVal;        
    };
	
	this.peek = function(){
		if(this.q.length > 0)
		{
			return (this.q[0]);
		}
		else {return null;}
	
	}
	
	//this.getItem = function(index){
	//	var contains = contents[index];
	//	
	//	if(contains){return contains.object
	
	//}
    
    this.toString = function() {
        var retVal = "";
        for (var i in this.q)
        {
            retVal += "[" + this.q[i] + "] ";
        }
        return retVal;
    };
}

function updateReadyQueueDisp()
{
	console.log("entered updateReadyQueueDisp()");
	var totalProcesses = _ReadyQueue.getSize();
	
	if ( totalProcesses > 3 ) 
	{
		totalProcesses = 3;
	} 
	
	clearReadyQueueDisp();
	
	for(var i = 0; i < totalProcesses; i++)
	{
		var RQpid = document.getElementById("rq" +(i+1)+"pid").innerHTML = _CurrentProcess.pid;
		var RQstate = document.getElementById("rq" +(i+1)+"state").innerHTML = _CurrentProcess.state;
		var RQbase = document.getElementById("rq" +(i+1)+"base").innerHTML = _CurrentProcess.base;
		var RQlimit = document.getElementById("rq" +(i+1)+"limit").innerHTML = _CurrentProcess.limit;
		console.log("pid: " + RQpid + " state: "+RQstate+ " base: "+RQbase+" limit: "+RQlimit); 
	}

}

function clearReadyQueueDisp()
{
	for(var i = 0; i < 3; i++)
	{
		var RQpid = document.getElementById("rq" +(i+1)+"pid").innerHTML = "---";
		var RQstate = document.getElementById("rq" +(i+1)+"state").innerHTML = "---";
		var RQbase = document.getElementById("rq" +(i+1)+"base").innerHTML = "---";
		var RQlimit = document.getElementById("rq" +(i+1)+"limit").innerHTML = "---";
		
	}
}

