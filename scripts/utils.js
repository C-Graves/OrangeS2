/* --------  
   Utils.js

   Utility functions.
   -------- */

function trim(str) {     // Use a regular expression to remove leading and trailing spaces.
	return str.replace(/^\s+ | \s+$/g, "");
	/* 
	Huh?  Take a breath.  Here we go:
	- The "|" separates this into two expressions, as in A or B.
	- "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
    - "\s+$" is the same thing, but at the end of the string.
    - "g" makes is global, so we get all the whitespace.
    - "" is nothing, which is what we replace the whitespace with.
	*/
	
}

function rot13(str) {   // An easy-to understand implementation of the famous and common Rot13 obfuscator.
                        // You can do this in three lines with a complex regular expression, but I'd have
    var retVal = "";    // trouble explaining it in the future.  There's a lot to be said for obvious code.
    for (var i in str) {
        var ch = str[i];
        var code = 0;
        if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
            code = str.charCodeAt(i) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
            retVal = retVal + String.fromCharCode(code);
        } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
            code = str.charCodeAt(i) - 13;  // It's okay to use 13.  See above.
            retVal = retVal + String.fromCharCode(code);
        } else {
            retVal = retVal + ch;
        }
    }
    return retVal;
}

function getDate()
	{
		var datetime = "";
		var timeofday = "";
		var currentDate = new Date();
		var hours = currentDate.getHours();
		if ((parseInt(hours))>11) {
		timeofday = "pm";
		}
		else{
		timeofday = "am";
		}
		if ((parseInt(hours))>12) {
		hours = parseInt(hours) - 12;
		} else if (((parseInt(hours))==0)){
		hours = 12;
		timeofday = "am";
		} 
		
		var minutes = currentDate.getMinutes();
		if((parseInt(minutes))<10)
		{
		minutes = "0" + minutes ;
		}
		var month = currentDate.getMonth() + 1;
		var day = currentDate.getDate();
		var year = currentDate.getFullYear();		
		
		datetime = "It is "+hours+":"+minutes+" "+timeofday+ " on "+month+"/"+day+"/"+year+ ".";
		
		return datetime;
	}
 
	function magic8ball(str) {
	var newStr = trim(str);
    var retVal = "";    
	if (newStr.indexOf("?") == -1) {
		retVal = "That wasn't a question.";
    }
	else{
		var answerChoice = Math.floor((Math.random()*5)+1);
		if (answerChoice == 1) {retVal = "No.";}
		else if (answerChoice == 2) {retVal = "Yes!";}
		else if (answerChoice == 3) {retVal = "The answer is currently unavailable.";}
		else if (answerChoice == 4) {retVal = "Highly unlikely";}
		else if (answerChoice == 5) {retVal = "Definitely not.";}
		else {retVal = "I'm not sure how you got to this answer...";}
	}
    return retVal;
}

//since this helps the shell already, I'll put program loader helper here
	function newProcess()
	{
		var state = NEW;
		var pid = _PID++;
		var pc = 0;
		
		
		var base;
		var limit;
		var slot;
	
		var memLocation = _MemoryManager.getOpenMemLoc();
		console.log(memLocation);
	
		if(memLocation)
		{
			_MemoryManager.setAvail(memLocation.memloc);
			base = memLocation.base;
			console.log("base: " + base);
			limit = memLocation.limit;
			console.log("limit: " + limit);
			slot = memLocation.memloc;
			console.log("slot: " + slot);
			//pid = _PID++; //increments the global _PID for the next load
		}
		else
		{ 
			console.log("Hit the else");
			base = -1;
			limit = -1;
			slot = -1;
		
		} //saved to disk, todo
	
		return (new processControlBlock(state, pid, pc, base, limit, slot));
	
	}
	
	


