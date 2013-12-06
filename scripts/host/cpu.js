/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;      
        this.isExecuting = false;  
    };
	
	this.update = function(PC, ACC, X, Y, Z)
	{
		this.PC = PC;
		this.Acc = ACC;
		this.Xreg = X;
		this.Yreg = Y;
		this.Zflag = Z;
	
	}
    
    this.cycle = function() {
	
		
        krnTrace("CPU cycle");
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.
		console.log("ALGORITHM IS... "+ _Scheduler.algorithm);
		if(_Scheduler.algorithm === _RoundRobin)
		{
			if(_CurCycleCount > _Quantum)
			{
				_Scheduler.contextSwitch();
			}
		}
		else if(_Scheduler.algorithm === _FCFS || _Scheduler.algorithm == _Priority)
		{
			if(_CurrentProcess.state === TERMINATED)
			{
				_Scheduler.contextSwitch();
			}
		}
		
		
		this.execute(this.fetch());
		
		_CurCycleCount++;
		//console.log("incrementing cycle: "+_CurCycleCount++);
		//update CPU values in realtime
		
		//this.state === RUNNING;
		
		this.updatePC();
		this.updateAcc();
		this.updateXreg();
		this.updateYreg();
		this.updateZflag();
		
	
		
		try{ updateMemoryTable();}
		catch(err){}//skip it
	};
		//updates CPU in CPU Status table
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
		
		
		
		this.fetch = function()
		{
			var baseAdjust = _MemoryManager.getBaseValue();
			return _Memory[this.PC + baseAdjust]; //0 === the base of the program -change later
		};
		
		this.execute = function(opcode)  //something is still not quite right, but it is able to produce the right output at this time
		{								 //has to do with being stored into 4 instead of 4B, for example
				console.log("Entered execute");
				console.log(this.PC);
				console.log(opcode);
				//if(_CurrentProcess.state != TERMINATED){ 				
				_CurrentProcess.update(RUNNING, this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
				
				console.log("PC is: " + this.PC + " ACC is: " + this.Acc);
				if(opcode === "A9") //Load accumulator with a constant
				{
					this.Acc = parseInt(_MemoryManager.getNext(),16);
					this.PC++;
				}
				else if(opcode === "AD") //Load the accumulator in memory
				{
					var nextCell = parseInt(_MemoryManager.getNext(),16);
					var nextNext = parseInt(_MemoryManager.getNext(),16);
					var addressH = (nextNext + nextCell);
					var addressD = _MemoryManager.translateToDec(addressH); 
					if(_MemoryManager.isValid(addressD))
					{
						this.Acc = parseInt(_Memory[addressD]);
					}
					else
					{
						krnTrace("Invalid memory access during AD. Program ended."); //halt system? //errors?
					}
					this.PC++;
				}
				else if(opcode === "8D") //Store the accumulator in memory
				{
					var nextCell = parseInt(_MemoryManager.getNext());//
					var nextNext = parseInt(_MemoryManager.getNext());//
					console.log("nextcell: " + nextCell + " and nextnext: "+nextNext);
					var addressH = (nextNext + nextCell);
					addressH = addressH.toString();
					
					var addressD = _MemoryManager.translateToDec(addressH); 
					if(_MemoryManager.isValid(addressD))
					{
						var accToHex = this.Acc.toString(16).toUpperCase();
						//var accToHex = this.Acc;//.toString().toUpperCase();
						if(accToHex.length === 1) {accToHex = "0" + accToHex;}
						_Memory[addressD] = accToHex;
						console.log(_Memory[addressD]);
					}
					else
					{
						krnTrace("Invalid memory access during 8D. Program ended."); //halt system? //errors?
					}
					this.PC++;
				}
				else if(opcode === "6D") //Add with carry
				{						 // adds content of address to the contents of acc- results in acc
					var nextCell = parseInt(_MemoryManager.getNext());// 
					var nextNext = parseInt(_MemoryManager.getNext());//
					var addressH = (nextNext + nextCell);
					var addressD = _MemoryManager.translateToDec(addressH); 
					if(_MemoryManager.isValid(addressD))
					{
						this.Acc = this.Acc + parseInt(_Memory[addressD],16);
						
						//var accToHex = this.Acc.toString(16).toUpperCase();
						//console.log("accToHex value: " + accToHex);
						//if(accToHex.length === 1) {accToHex = "0" + accToHex;}
						//_Memory[addressD] = accToHex;
					}
					else
					{
						krnTrace("Invalid memory access during 6D. Program ended."); //halt system? //errors?
					}
					this.PC++;
				}
				else if(opcode === "A2") //Load the X register with a constant
				{
					//this.Xreg = parseInt(_MemoryManager.getNext(),16);
					this.Xreg = parseInt(_MemoryManager.getNext());
					this.PC++;
				}
				else if(opcode === "AE") //Load the X register from memory
				{
					var nextCell = parseInt(_MemoryManager.getNext());
					var nextNext = parseInt(_MemoryManager.getNext());
					var addressH = (nextNext + nextCell);
					var addressD = _MemoryManager.translateToDec(addressH); 
					if(_MemoryManager.isValid(addressD))
					{
						this.Xreg = parseInt(_Memory[addressD],16); //maybe right
					}
					else 
					{
						krnTrace("Invalid memory access during AE. Program ended."); //halt system? //errors?
					}

					this.PC++;
				}
				else if(opcode === "A0") //Load the Y register with a constant
				{
					//this.Yreg = parseInt(_Memory[(this.PC + 1)+0],16);
					this.Yreg =_MemoryManager.getNext();
					//var test = this.Yreg =(_Memory[_MemoryManager.getNext()]);
					this.PC++;
				}
				else if(opcode === "AC") //Load the Y register from memory
				{
					var baseAdjust = _MemoryManager.getBaseValue();
					var nextCell = parseInt(_MemoryManager.getNext());
					var nextNext = parseInt(_MemoryManager.getNext());
					var addressH = (nextNext + nextCell);
					var addressD = _MemoryManager.translateToDec(addressH); 
					if(_MemoryManager.isValid(addressD))
					{
						this.Yreg = parseInt(_Memory[addressD],16);
					}
					else
					{
						krnTrace("Invalid memory access during AC. Program ended."); //halt system? //errors?
					}
					this.PC++;
				}
				else if(opcode === "EA") //No Operation
				{
					this.PC++;
				}
				else if(opcode === "EC") //Compare a byte in memory to the X reg & sets the Z flag if equal
				{			
					var nextCell = parseInt(_MemoryManager.getNext());
					var nextNext = parseInt(_MemoryManager.getNext());
					var addressH = (nextNext + nextCell);
					var addressD = _MemoryManager.translateToDec(addressH); 
					if(_MemoryManager.isValid(addressD))
					{
						if(parseInt(_Memory[addressD]) === this.Xreg){this.Zflag = 1;}
						else{this.Zflag = 0;}
					}
					else
					{
						krnTrace("Invalid memory access during AC. Program ended."); //halt system? //errors?
					}	
					this.PC++;
				}
				else if(opcode === "D0") //Branch X bytes if Z flag = 0
				{
					if(this.Zflag === 0)
					{
						var branchVal = parseInt(_MemoryManager.getNext(),16);
						this.PC += branchVal;
						if(this.PC > 255)
						{
							this.PC -= 256;
						}
						this.PC++;
					}
					else
					{
						this.PC += 2;
					}
				}

				else if(opcode === "EE") //Increment the value of a byte
				{
					var nextCell = parseInt(_MemoryManager.getNext());
					var nextNext = parseInt(_MemoryManager.getNext());
					var addressH = (nextNext + nextCell);
					var addressD = _MemoryManager.translateToDec(addressH); 
					if(_MemoryManager.isValid(addressD))
					{
						var decimalOf = parseInt(_Memory[addressD], 16);
						decimalOf++;
						var hexOf = decimalOf.toString(16).toUpperCase();
						if(hexOf.length === 1){hexOf = "0"+hexOf;}
						_Memory[addressD] = hexOf;
					}
					else
					{
						krnTrace("Invalid memory access during AC. Program ended."); //halt system? //errors?
					}	
					this.PC++;
				}
				else if(opcode === "FF") //System Call
				{						 //$01 in X reg = print the int stored in the Y reg	 
					if(this.Xreg === 1)  //$02 in X reg = print the string stored at address in Y reg
					{
						var val = parseInt(this.Yreg).toString();
						for(var i=0; i< val.length; i++)
						{
							_StdIn.putText(val.charAt(i));
						}
						_StdIn.advanceLine();
					}
					else if(this.Xreg === 2)
					{
						var addressD = 	parseInt(this.Yreg,16) + _MemoryManager.getBaseValue();	
						var terminateString = "00";
						var current = _Memory[addressD];
						var keyCode = 0;
						var ch = "";
						while(current != terminateString)
						{
							keyCode = parseInt(current,16);
							chr = String.fromCharCode(keyCode);
							_StdIn.putText(chr);
							addressD++;
							current = _Memory[addressD];
						}
						_StdIn.advanceLine();
					}
					this.PC++;
				}
				else if(opcode === "00") //Break (system call)
				{	
					_CurrentProcess.updatePC;
					_CurrentProcess.updateAcc;
					_CurrentProcess.updateXreg;
					_CurrentProcess.updateYreg;
					_CurrentProcess.updateZflag;
					
					_CurrentProcess.update(TERMINATED, this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
					
					//console.log(_MemoryManager.getMemloc());
					_MemoryManager.setAvail(_MemoryManager.getMemloc());
					//_MemoryManager.setAvail(_CurrentProcess.slot);
					console.log(_MemoryManager.getOpenMemLoc());
					

					//console.log(_ReadyQueue.peek());
					if(_ReadyQueue.peek())  // != null) 
					{
						//_CurrentProcess = _ReadyQueue.dequeue();
						//clearCPU();
						_Scheduler.contextSwitch();
					}
					else
					{
						//this.PC++;
					_StdIn.putText(">");
					_CPU.isExecuting = false;
					clearCPU();
					clearReadyQueueDisp();
					}
				}
				else{this.PC++;}
			//}
		};
		
		
}


function clearCPU()
{
	_CPU.PC = 0;
	_CPU.Acc = 0;
	_CPU.Xreg = 0;
	_CPU.Yreg = 0;
	_CPU.Zflag = 0;
}

