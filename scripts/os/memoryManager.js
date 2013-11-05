//memoryManager.js

function memoryManager()  //basic helper functions to keep code clean-er when dealing with memory
{
	this.memoryTable = {
		loc0:
		{
			empty:true,
			base:0,
			limit:255,
			memloc:0
		},
		loc1:
		{
			empty:true,
			base:256,
			limit:511,
			memloc:1
		},
		loc2:
		{
			empty:true,
			base:512,
			limit:767,
			memloc:2
		},		
	};
	
	
	
	
	this.getBaseValue = function()
	{
		return _CurrentProcess.base;
	}

	this.getNext = function()
	{
		var nextest = (++_CPU.PC);
		return _Memory[nextest+ this.getBaseValue()];
		
	}

	this.isValid = function(address)
	{
		var base = _CurrentProcess.base;
		var limit = _CurrentProcess.limit;
		return (address >= base && address <= limit);
	}
	
	this.translateToDec = function(hexAddress)
	{
		return parseInt( hexAddress, 16); //+ this.getBaseValue();
	}
	
	this.openMemLocExists = function()
	{
		var loc0Avail = this.memoryTable.loc0.open;
		var loc1Avail = this.memoryTable.loc1.open;
		var loc2Avail = this.memoryTable.loc2.open;
		
		return (loc0Avail || loc1Avail || loc2Avail);
	}
	
	this.getOpenMemLoc = function()
	{
		if(_MemoryManager.memoryTable.loc0.open == true) {return(_MemoryManager.memoryTable.loc0);}
		else if (_MemoryManager.memoryTable.loc1.open == true) {return(_MemoryManager.memoryTable.loc1);}
		else if (_MemoryManager.memoryTable.loc2.open == true) {return(_MemoryManager.memoryTable.loc2);}
		else {return null;}
	}
	
	this.setAvail = function(memloc)
	{
		var loc0Avail = this.memoryTable.loc0.open;
		var loc1Avail = this.memoryTable.loc1.open;
		var loc2Avail = this.memoryTable.loc2.open;
		
		if(memloc = 0)
		{
		if (loc0Avail = loc0Avail) { this.memoryTable.loc0.open = false; }
		else{this.memoryTable.loc0.open = false;}
		}
		
		else if(memloc = 1)
		{
		if (loc1Avail = loc1Avail) { this.memoryTable.loc1.open = false; }
		else{this.memoryTable.loc1.open = false;}
		}
		else if(memloc = 2)
		{
		if (loc2Avail = loc2Avail) { this.memoryTable.loc2.open = false; }
		else{this.memoryTable.loc2.open = false;}
		}
		else{}//do nothing

	}
	
	this.getMemInfo = function(memloc)
	{
		var base = 0;
		var limit = 0;
		var memoryArray = [];
		
		if(memloc = 0)
		{
			base = _MemoryManager.memoryTable.loc0.base;
			limit = _MemoryManager.memoryTable.loc0.limit;
		}

		else if(memloc = 1)
		{
			base = _MemoryManager.memoryTable.loc0.base;
			limit = _MemoryManager.memoryTable.loc0.limit;
		}

		else if(memloc = 2)
		{
			base = _MemoryManager.memoryTable.loc0.base;
			limit = _MemoryManager.memoryTable.loc0.limit;
		}
		
		else {_StdIn.putText("Not a valid memory location.");} //shouldn't happen?
		
		for(var i = base; i<limit; i++)
		{
			memoryArray.push(_Memory[i]);
		}
		
		return memoryArray;
	}
	

	
}