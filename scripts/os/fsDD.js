/* ----------------------------------
   fsDD.js
   
   Requires deviceDriver.js
   
   The Kernel File System Device Driver.
   ---------------------------------- */
   
fsDD.prototype = new DeviceDriver;
   
function fsDD()                   
{
	//Override the base method pointers.
    this.driverEntry = krnFileDriverEntry;
    this.isr = null;
	
	this.createFile = krnCreateFile;
	this.readFile = krnReadFile;
	this.writeFile = krnWriteFile;
	this.deleteFile = krnDeleteFile;
	this.format = krnFormat;

	
	
}

function krnFileDriverEntry()
{
    this.status = "loaded";
	krnFormat();
}

function fileSystemKey(track, sector, block)
{
	var key = (track+""+sector+""+block);
	return key;

}

function fileSystemVal(used, track, sector, block, data)
{
	var val = (used+""+track+""+sector+""+block+""+ krnFiller(data) );
	return val;
} 

function krnFindOpenDBlock()
{
	var keyVal = 0;
	var valueString;
	var occupiedBit;
	
	for (key in localStorage)
	{
		keyVal = parseInt(key);
		
		if(keyVal >= 0 && keyVal <= DIREND)
		{
			valueString = localStorage[key].toString();
			console.log(valueString);
			occupiedBit = valueString.charAt(0);
			console.log(occupiedBit);
		
			if(parseInt(occupiedBit) === 0)
			{
				return(key);
			}
		}
	
	}
	return null;
}

function krnFindOpenFBlock()
{
	var keyVal = 0;
	var valueString;
	var occupiedBit;
	
	for (key in localStorage)
	{
		keyVal = parseInt(key);
		
		if(keyVal >= FILESTART && keyVal <= FILEEND)
		{
			valueString = localStorage[key].toString();
			occupiedBit = valueString.charAt(0);
		
			if(parseInt(occupiedBit) === 0)
			{
				return(key);
			}
		}
	
	}
	return null;

}

function krnSetValOcc(key, data)
{
	var valueString =key.toString();
	var t = valueString.charAt(0);
	var s = valueString.charAt(1);
	var b = valueString.charAt(2);
	
	return ( fileSystemVal(1,t,s,b,data) );
}


function krnCreateFile(filename)
{
	//look for open block - dKey
	var dKey = krnFindOpenDBlock();
	//get that key - fKey
	var fKey = krnFindOpenFBlock();
	if (dKey && fKey && filename.length < MAXLENGTH)
	{
		localStorage[dKey] = krnSetValOcc(fKey, filename);
		localStorage[fKey] = krnSetValOcc(TSB, "");
		
		return true;
	}
	
	else
	{	
		return false;
	}
	
}

function krnReadFile(filename)
{

	//_StdIn.putText("Inside of reading of filename "+filename ".");
	if(filename)
	{
		return "fake test data";
	}

	else
	{
		return "couldn't find filename to read from";
	}
}

function krnWriteFile(filename, data)
{

	//_StdIn.putText("Inside of writing '" + data + "' to filename "+filename ".");
	
	return true;
}

function krnDeleteFile(filename)
{

	//_StdIn.putText("Inside of deleting the filename "+filename ".");
	return true;

}


function krnFormat()
{
		localStorage.clear();
		
		var fsKey = "";
		var fsValue = "";

		// track 
		for(var t = 0; t < 4; t++)
		{
			// sector
			for(var s = 0; s < 8; s++)
			{
				// block
				for(var b = 0; b < 8; b++)
				{
					fsKey = fileSystemKey(t, s, b);
					fsValue = fileSystemVal(0, -1, -1, -1, "");					
					localStorage[fsKey] = fsValue;
				}
			}
		}
		
		// Assign the MBR to TSB[0,0,0]
		localStorage[MBR] = fileSystemVal(1, -1, -1, -1, "MBR");
		
		return true;
	
}



function makeFileSystem()
{
	var fileSystem = document.getElementById("fileTable");
	var rows = [];
	var cells = [];
	
//	while(fileSystem.hasChildNodes())
//	{
//		fileSystem.removeChild(fileSystem.firstChild);
//	}
	
	for(var i=0; i < localStorage.length; i++)
	{
		rows[i] = fileSystem.insertRow(i);
		cells[i] = [];
		for(var j = 0; j < 2; j++)
		{
			cells[i][j] = document.createElement("td");
			
			if(j === 0)
			{
				cells[i][j].innerHTML = localStorage.key(i);
			}
			else
			{
				cells[i][j].innerHTML = "&nbsp;";
			}
			rows[rows.length - 1].appendChild(cells[i][j]);
		}
	}
	_FileSystemDisplayCells = cells;
}

function krnFiller(data)
{
	var currentLength = data.length;
	for( var i = currentLength; i < MAXLENGTH; i++ )
	{
		data += "-";
	}
	return data;
}

function updateFileSystem()
{
	var i = 0;
	for( key in localStorage)
	{
		_FileSystemDisplayCells[i][1].innerHTML = localStorage[key];
		i++;
	}
}




