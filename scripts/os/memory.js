//for Memory

function Memory() 
{
	var memoryArray = new Array();
	
	for(i = 0; i<_TotalMemory; i++) //+1 cuz undefined when memory rewritten; it was +1, but this is not giving me a problem w/o it...
	{
		memoryArray[i] = "00";
	}
	return memoryArray;
}

function makeMemoryTable() //automagically
{
	var memoryTable = document.getElementById("memoryTable");
	
	var rows = [];
	var cells = [];
	
	for( var i = 0; i < 96; i++ ) //3 sections 32*3
	{
		rows[i] = memoryTable.insertRow(i);
		cells[i] = [];
		
		for( var j = 0; j<9; j++ )
		{
			cells[i][j] = document.createElement("td");
			if (j === 0)
			{
				var pos = (i*8).toString(16).toUpperCase();
				if (pos.length === 1) {pos = "$000"+pos;}
				else if (pos.length === 2) {pos = "$00"+pos;}
				else if (pos.length === 3) {pos = "$0"+pos;}
				else{pos="$"+pos;}
				cells[i][j].innerHTML = (pos);
			}
			else {cells[i][j].innerHTML = "00";}
			rows[rows.length-1].appendChild(cells[i][j]);
		}
	}
	_MemoryDisplayCells = cells;
}

function updateMemoryTable() //updates memory table if/when different values should be displayed
{
	var i = 0;
	for(var row = 0; row<96; row++)
	{
		for(var coll = 1; coll<9; coll++)
		{
			_MemoryDisplayCells[row][coll].innerHTML = _Memory[i];
			i++;
		}
	}	
}

 
//I don't think I was using the clearMemoryTable function anyway

