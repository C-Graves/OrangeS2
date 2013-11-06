function Scheduler()
{
	console.log("entered scheduler");
	this.contextSwitch = function()
	{
		if(_ReadyQueue.peek() !=null)
		{
			_CurrentProcess = _ReadyQueue.dequeue();
			
				_CurrentProcess.updatePC;
				_CurrentProcess.updateAcc;
				_CurrentProcess.updateXreg;
				_CurrentProcess.updateYreg;
				_CurrentProcess.updateZflag;
				
				console.log(_CurrentProcess);
		
		}
	
	
	}

}

