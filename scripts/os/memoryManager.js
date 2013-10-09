//memoryManager.js

function memoryManager()
{
	this.getBaseValue = function()
	{
		return parseInt(_base);
	}

	this.getNext = function()
	{
		return _Memory[(++_CPU.PC)+ this.getBaseValue()];
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