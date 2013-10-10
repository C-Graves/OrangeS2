//memoryManager.js

function memoryManager()  //basic helper functions to keep code clean-er when dealing with memory
{
	this.getBaseValue = function()
	{
		return parseInt(_base);
	}

	this.getNext = function()
	{
		var nextest = (++_CPU.PC);
		return _Memory[nextest+ this.getBaseValue()];
		
	}

	this.isValid = function(address)
	{
		var base = _base;
		var limit = _limit;
		return (address >= base && address <= limit);
	}
	
	this.translateToDec = function(hexAddress)
	{
		return parseInt( hexAddress, 16) + this.getBaseValue();
	}
}