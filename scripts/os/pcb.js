//PCB

function processControlBlock(state, pid, PC, base, limit, memloc, priority) // 
{
	this.state = state; 		//ready, terminated, 
	this.pid = pid;				//PID
	this.PC = PC;				//Program Counter
	this.base = base;			//base for mem location
	this.limit = limit;			//limit for mem location
	this.memloc = memloc;		//location in memory 0 1 2
	this.priority = priority;	//priority assigned
	
	this.Acc = 0;
	this.Xreg = 0;
	this.Yreg = 0;
	this.Zflag = 0;

	//this.updatePC();
	//this.updateAcc();
	//this.updateXreg();
	//this.updateYreg();
	//this.updateZflag();
	//this.updateState();
	
	this.update = function(state, PC, ACC, X, Y, Z)
	{
		this.state = state;
		this.PC = PC;
		this.Acc = ACC;
		this.Xreg = X;
		this.Yreg = Y;
		this.Zflag = Z;
	
	
	}
	
		this.updatePC = function()
		{
			var cpuTable = document.getElementById("pcStatus").innerHTML=this.PC;
		};
		this.updateAcc = function()
		{
			var cpuTable = document.getElementById("accStatus").innerHTML=this.Acc;
		};
		this.updateXreg = function()
		{
			var cpuTable = document.getElementById("xStatus").innerHTML=this.Xreg;
		};
		this.updateYreg = function()
		{
			var cpuTable = document.getElementById("yStatus").innerHTML=this.Yreg;
		};
		this.updateZflag = function()
		{
			var cpuTable = document.getElementById("zStatus").innerHTML=this.Zflag;
		};
		this.updateState = function()
		{
			var state = this.state;
		}

}

