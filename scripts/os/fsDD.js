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

function krnFindD(filename)
{
	var keyVal = 0;
	var valueString;
	var occupiedBit;
	var data;
	var curfilename;
	
	for (key in localStorage)
	{
		keyVal = parseInt(key);
		
		if(keyVal >= 0 && keyVal <= DIREND)
		{
			valueString = (localStorage[key]).toString();
			occupiedBit = valueString.charAt(0);
			data = valueString.slice(4,valueString.length);
		
			if(parseInt(occupiedBit) === 1)
			{
				curfilename = data.substring(0, data.indexOf("-"));
				if(filename === curfilename)
				{
					return(key);
				}
			}
		}
	
	}
	return null;
}

function krnLinkedFileBlocks(firstFKey)
{
	var fileList = [firstFKey];
	var curKey = firstFKey;
	var curString = "";
	
	console.log("firstFKey: "+firstFKey);
	console.log("curKey: "+curKey);
	while(curKey.toString() != TSB)
	{
		console.log("entered while");
		curString = localStorage[curKey];
		console.log(typeof(curString));
		curStringS = curString.toString();
		console.log(curStringS);
		
		var t = curStringS.charAt(1);
		var s = curStringS.charAt(2);
		var b = curStringS.charAt(3);
		
		var theKey = (t+""+s+""+b);
		console.log("theKey: "+theKey);
		
		if(theKey != TSB)
		{
			fileList.push(theKey);
		}
		
		curKey = theKey;	
	}
	
	return fileList;
}

function krnMakeLinkFileBlocks(firstKey, curKey)
{
	var originalString = localStorage[curKey].toString();
	var data = originalString.slice(4,originalString.length);
	
	var curString = localStorage[curKey].toString();
	var t = curString.charAt(0);
	var s = curString.charAt(1);
	var b = curString.charAt(2);
	
	
	localStorage[firstKey] = fileSystemVal(1,t,s,b,data);
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

	if(filename)
	{
		var dKey = krnFindD(filename);
		var valueString = localStorage[dKey].toString();
		var t = valueString.charAt(1);
		var s = valueString.charAt(2);
		var b = valueString.charAt(3);
		
		var firstFKey = (t+""+s+""+b);
		
		var linkedFiles = krnLinkedFileBlocks(firstFKey);
		
		var valueString;
		var data;
		var dataList = [];
	
		for(i in linkedFiles)
		{
			valueString = localStorage[linkedFiles[i]].toString();
			data = valueString.slice(4,valueString.length);
			if(data.indexOf("-") != -1)
			{
				data = data.substring(0, data.indexOf("-"));
			}
			dataList.push(data);
		}
	
		return dataList.toString();
	}

	else
	{
		return "couldn't find filename to read from";
	}
}

function krnWriteFile(filename, data)
{
	if(filename)
	{
		var dKey = krnFindD(filename);
		
		if(dKey){
			
			var valueString = localStorage[dKey].toString();
			var t = valueString.charAt(1);
			var s = valueString.charAt(2);
			var b = valueString.charAt(3);
			
			var fKey = (t+""+s+""+b);
			console.log(fKey + ": fKey");
			
			if(data.length <= MAXLENGTH)
			{
				localStorage[fKey] = fileSystemVal(1, 9, 9, 9, data);
			}
			
			else
			{
				var spaceNeeded = Math.ceil( data.length / MAXLENGTH );
				var dataList = [];
				
				for(var i = 0; i < spaceNeeded; i++)
				{
					dataList[i] = data.substring((i*MAXLENGTH), ((i+ 1)*MAXLENGTH));
				}
			
				console.log(dataList[0]);
				localStorage[fKey] = krnSetValOcc(TSB, dataList[0]);
				
				var curKey = "";
				var nextKey = fKey;
				
				for(var j = 1; j < dataList.length; j++)
				{
					curKey = nextKey;
					nextKey = krnFindOpenFBlock();
					
					localStorage[nextKey] = krnSetValOcc(TSB, dataList[j]);

				}
			}
		
			return true;
		}
	}

	else
	{
		return "couldn't find filename to read from";
	}

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
					fsKey = (t+""+s+""+b);
					fsValue = fileSystemVal(0, 9, 9, 9, "");					
					localStorage[fsKey] = fsValue;
				}
			}
		}
		
		// Assign the MBR to TSB[0,0,0]
		localStorage[MBR] = fileSystemVal(1, 9, 9, 9, "MBR");
		
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




