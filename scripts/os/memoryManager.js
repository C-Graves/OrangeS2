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
	
	this.getMemloc = function()
	{
		return _CurrentProcess.memloc;
	}

	this.getNext = function()
	{
		var nextest = (++_CPU.PC);
		return _Memory[nextest+ this.getBaseValue()];
		console.log("Got next");
	}


	this.isValid = function(address)
	{
		var base = _CurrentProcess.base;
		var limit = _CurrentProcess.limit;
		return (address >= base && address <= limit);
	}
	
	this.translateToDec = function(hexAddress)
	{
		return parseInt( hexAddress, 16) + this.getBaseValue();
	}
	
	this.openMemLocExists = function()
	{
		var loc0Avail = this.memoryTable.loc0.empty;
		var loc1Avail = this.memoryTable.loc1.empty;
		var loc2Avail = this.memoryTable.loc2.empty;
		
		//console.log((loc0Avail));
		return (loc0Avail || loc1Avail || loc2Avail);
		
	}
	
	this.getOpenMemLoc = function()
	{
		if(_MemoryManager.memoryTable.loc0.empty == true) {return(_MemoryManager.memoryTable.loc0);}
		else if (_MemoryManager.memoryTable.loc1.empty == true) {return(_MemoryManager.memoryTable.loc1);}
		else if (_MemoryManager.memoryTable.loc2.empty == true) {return(_MemoryManager.memoryTable.loc2);}
		else {return null;}
	}
	
	this.setAvail = function(memloc)
	{
		var loc0Avail = this.memoryTable.loc0.empty;
		var loc1Avail = this.memoryTable.loc1.empty;
		var loc2Avail = this.memoryTable.loc2.empty;
		
		if(memloc == 0)
		{
			if (loc0Avail = loc0Avail) { this.memoryTable.loc0.empty = false; }
			else{this.memoryTable.loc0.empty = true;}
		}
		
		else if(memloc == 1)
		{
			if (loc1Avail = loc1Avail) { this.memoryTable.loc1.empty = false; }
			else{this.memoryTable.loc1.empty = true;}
		}
		else if(memloc == 2)
		{
			if (loc2Avail = loc2Avail) { this.memoryTable.loc2.empty = false; }
			else{this.memoryTable.loc2.empty = true;}
		}
		else{}//do nothing

	}
	
	this.getMemInfo = function(memloc)
	{
		var base = -1;
		var limit = -1;
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
	
	
	this.rollIn = function(process)
	{
		var file = "process"+ process.pid.toString();
		var opcode = krnfsDD.readFile(file);
		var opcodeArray = opcode.split(/\s/);
		var memSlot = _MemoryManager.getOpenMemLoc();
		
		process.base = memoryTable.base;
		process.limit = memoryTable.limit;
		process.slot = memoryTable.memloc;
		process.state = LOADED;
		
		this.setAvail(process.slot);
		
		var opcode = "";
		for(var j = process.base; j < opcodeArray.length + process.base; j++)
		{
			opcode = opcodeArray[j-process.base];
			_Memory[j] = opcode.toUpperCase();
		}
		
		krnfsDD.deleteFile(file);
	}
	
	this.rollOut = function(process)
	{
		var file = "process"+ process.pid.toString();
		var opcodeArray = getMemInfo(process.slot);
		var data = opcodeArray.join(" ");
		
		krnfsDD.createFile(file);
		krnfsDD.writeFile(file, data);
		
		this.setAvail(process.slot);
		
		if(process.slot === 0){clearMemory0();}
		if(process.slot === 1){clearMemory1();}
		if(process.slot === 2){clearMemory2();}
		
		process.base = -1;
		process.limit = -1;
		process.slot = -1;
		process.state = ONDISK;
		
	}
	

	
}