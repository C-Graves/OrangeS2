function Scheduler()
{
	this.algorithm = _RoundRobin; //will change this, but should make it automagically use RR
	this.contextSwitch = function()
	{
		this.quantum = _Quantum;
		
		this.algorithm = _RoundRobin
		
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
			
			
			//clearReadyQueueDisp();
		
		}
		
		_CurCycleCount = 1;
		//console.log(_CurCycleCount);
	
	}

}

