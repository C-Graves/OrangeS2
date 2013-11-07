function Scheduler()
{
	console.log("entered scheduler"); 
	this.contextSwitch = function()
	{
		this.quantum = _Quantum;
		
		this.algorithm = _RoundRobin
	
		if(_ReadyQueue.peek() )  // !=null)
		{
			if(_CurrentProcess.state != TERMINATED)
			{
				
				//_CurrentProcess = _ReadyQueue.dequeue();
			
				_CurrentProcess.update(READY, _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
				
				_CurrentProcess.updatePC;
				_CurrentProcess.updateAcc;
				_CurrentProcess.updateXreg;
				_CurrentProcess.updateYreg;
				_CurrentProcess.updateZflag;
				
				_CPU.update(_CurrentProcess.PC, _CurrentProcess.Acc, _CurrentProcess.Xreg,
							_CurrentProcess.Yreg, _CurrentProcess.Zflag);
				
				console.log(_CurrentProcess);
				
				_ReadyQueue.enqueue(_CurrentProcess);
			}
			
			_CurrentProcess = _ReadyQueue.dequeue();
			
			_CPU.update(_CurrentProcess.PC, _CurrentProcess.Acc, _CurrentProcess.Xreg,
							_CurrentProcess.Yreg, _CurrentProcess.Zflag);
							
			_CurrentProcess.updatePC;
			_CurrentProcess.updateAcc;
			_CurrentProcess.updateXreg;
			_CurrentProcess.updateYreg;
			_CurrentProcess.updateZflag;
		
		}
		
		_CurCycleCount = 1;
	
	
	}

}

