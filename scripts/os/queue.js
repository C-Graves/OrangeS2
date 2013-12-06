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

    //this.enqueue = function(element,priority) {
	//	console.log("enqueued");
    //    this.q.push(element,priority); //
		
    //};
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
	
	};
	
	this.remove = function(index){
		var savedPart = this.q.splice(0,index);
		//console.log(savedPart);
		//console.log(this.q);
		this.q.shift();
		this.q = savedPart.concat(this.q);
		//console.log(this.q);
	};
	
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
	
	this.sort = function(a,b) {
	
	(function(a,b){return a.pid - b.pid});
	
	};
}

function updateReadyQueueDisp() //This isn't quite working, but it does show how it switches.
{								// Not sure why it is doubling.
	var totalProcesses = _LoadedJobs.length;
	var activePID = "";
	
	if(_LoadedJobs.length >= 1)
	{	
		for(var j = 0; j < totalProcesses; j++)
			{
				if(_LoadedJobs[j].state != 4)
				{
					//console.log(_LoadedJobs[j].pid);
					activePID += _LoadedJobs[j].pid +",";
				}
			
			}
	
	//console.log(activePID);
	var splitPIDs = activePID.split(",");
	//console.log(splitPIDs);
	
	if ( totalProcesses > 3 ) 
	{
		//if(_LoadedJobs[i].state == 2)
		//{
		//	console.log(_LoadedJobs[i].pid);
		//	
		//}
		totalProcesses = 3;
	} 
	
	clearReadyQueueDisp();
	
	for(var i = 0; i < splitPIDs.length-1; i++)
	{
		var RQpid = document.getElementById("rq" +(i+1)+"pid").innerHTML = _LoadedJobs[splitPIDs[i]].pid;
		var RQstate = document.getElementById("rq" +(i+1)+"state").innerHTML = translateState(_LoadedJobs[splitPIDs[i]].state);
		var RQbase = document.getElementById("rq" +(i+1)+"base").innerHTML = _LoadedJobs[splitPIDs[i]].base;
		var RQlimit = document.getElementById("rq" +(i+1)+"limit").innerHTML = _LoadedJobs[splitPIDs[i]].limit;
		//console.log("pid: " + RQpid + " state: "+RQstate+ " base: "+RQbase+" limit: "+RQlimit); 
	}
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

function translateState(num)
{									//so its readable text
	if (num === 0) {return "NEW";}
	else if (num === 1) {return "LOADED";}
	else if (num === 2) {return "READY";}
	else if (num === 3) {return "RUNNING";}
	else if (num === 4) {return "TERMINATED";}
	else{return num;}
}