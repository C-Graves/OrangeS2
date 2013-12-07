function Scheduler()
{
	console.log(this.algorithm);
	this.algorithm = _RoundRobin; //will change this, but should make it automagically use RR
	console.log(this.algorithm);
	this.quantum = _Quantum;
		
	//this.algorithm = _RoundRobin
	
	this.contextSwitch = function()
	{
			
		//console.log("Peeking! "+ _ReadyQueue.peek());
		if(_ReadyQueue.peek() !=null)
		{
			//Performing context switch
			if(_CurrentProcess.state != TERMINATED)
			{
				
				//_CurrentProcess = _ReadyQueue.dequeue();
				//console.log("in loop");
				_CurrentProcess.update(READY, _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
				
				_CurrentProcess.updatePC;
				_CurrentProcess.updateAcc;
				_CurrentProcess.updateXreg;
				_CurrentProcess.updateYreg;
				_CurrentProcess.updateZflag;
				
				_CPU.update(_CurrentProcess.PC, _CurrentProcess.Acc, _CurrentProcess.Xreg,
							_CurrentProcess.Yreg, _CurrentProcess.Zflag);
				
				updateReadyQueueDisp();
				
				_ReadyQueue.enqueue(_CurrentProcess);//, _CurrentProcess.priority);
			}
			
			_CurrentProcess = _ReadyQueue.dequeue();
			
			console.log(_CurrentProcess.memloc + "currentProcess.slot");
			
			if(_CurrentProcess.memloc === -1)
			{
				console.log("CurrentProcess slot was -1");
				console.log("ready queue size " + _ReadyQueue.getSize());
				if(_ReadyQueue.getSize() != 0 && !_MemoryManager.openMemLocExists())
				{
					_MemoryManager.rollOut(_LoadedJobs[_ReadyQueue.getSize()-1]);
					console.log("Did this do anything? ");// +_MemoryManager.rollOut(_ReadyQueue.q[(_ReadyQueue.getSize()-1)]));
				}
				_MemoryManager.rollIn(_CurrentProcess);
			}
			
			_CPU.update(_CurrentProcess.PC, _CurrentProcess.Acc, _CurrentProcess.Xreg,
							_CurrentProcess.Yreg, _CurrentProcess.Zflag);
							
			_CurrentProcess.updatePC;
			_CurrentProcess.updateAcc;
			_CurrentProcess.updateXreg;
			_CurrentProcess.updateYreg;
			_CurrentProcess.updateZflag;
			
			
			//clearReadyQueueDisp();
		
		}
		
		_CurCycleCount = 1;
		//console.log(_CurCycleCount);
	
	}

}

