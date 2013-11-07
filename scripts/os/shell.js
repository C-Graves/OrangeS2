/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS"; //but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;
	
	// date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays current date and time.";
    sc.function = shellDate;
    this.commandList[this.commandList.length] = sc;

	// whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Displays current location.";
    sc.function = shellWhereami;
    this.commandList[this.commandList.length] = sc;
	
	// load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "- Loads data from User Program Input.";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;
	
	// magic8ball <question>
    sc = new ShellCommand();
    sc.command = "magic8ball";
    sc.description = "<question> - Predicts an answer.";
    sc.function = shellMagic8Ball;
    this.commandList[this.commandList.length] = sc;
	
	// BSOD 
    sc = new ShellCommand();
    sc.command = "bsod";
    sc.description = "- Just try it.";
    sc.function = shellBSOD;
    this.commandList[this.commandList.length] = sc; 
	
	// status <string>
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "<string> - Updates status with given <string>.";
    sc.function = shellStatus;
    this.commandList[this.commandList.length] = sc; 

	// run <PID>
    sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<PID> - Runs program with given <PID>.";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc; 	
	
	// runall
    sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "- Runs all processes.";
    sc.function = shellRunAll;
    this.commandList[this.commandList.length] = sc; 	
	
	// quantum <int>
    sc = new ShellCommand();
    sc.command = "quantum";
    sc.description = "<int> - Set quantum for RR Scheduling.";
    sc.function = shellQuantum;
    this.commandList[this.commandList.length] = sc; 	
	
	// processes				// processes - list the running processes and their IDs
    sc = new ShellCommand();
    sc.command = "processes";
    sc.description = "- Display all active processes.";
    sc.function = shellProcesses;
    this.commandList[this.commandList.length] = sc; 		
	
    
	//kill<PID>					// kill <id> - kills the specified process id.
	sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "<PID> - Kills the specified PID.";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc; 
    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.putText("For what?");
   }
}

function shellVer(args)
{
    _StdIn.putText(APP_NAME + " version " + APP_VERSION);    
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            case "off": 
                _Trace = false;
                _StdIn.putText("Trace OFF");                
                break;                
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }        
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellDate(args)
	{
		_StdIn.putText(getDate());		
	}

	
function shellWhereami(args)
{
    _StdIn.putText("Hold on, let me look it up for you...");
	_StdIn.advanceLine();
	_StdIn.putText("...you didn't think I was that creepy, did you?");
}

function shellLoad(args)
{
	var upInput = document.getElementById("taProgramInput");
	var text = upInput.value;
	text = trim(text);
	var isValid = (/^[0-9a-f]{2}( [0-9a-f]{2})*$/i.test(text));
		//any 2 num or letter,( a space, any 2 num or letter)zero or more times, $=string end and case insensitive
	
	var arrayOpcodes = text.split(" ");
	var currentOp = "";
	
	
	console.log(arrayOpcodes.length + " is < " + _MemoryBlockSize);
	if (isValid && arrayOpcodes.length < _MemoryBlockSize)
	{
		_StdIn.putText("Input entered is valid.");
	
		var process = newProcess(); 		
		
		//clearCPU();	//?
		
		for( var i = process.base; i < arrayOpcodes.length + process.base; i++)
		{
			currentOp = arrayOpcodes[i - process.base];
			_Memory[i] = currentOp.toUpperCase();		
		}
		
		for(var i = arrayOpcodes.length + process.base; i< process.limit+1; i++) //this resets any cells after loaded program ("clearMemoryTable" equivalent)
		{
			_Memory[i] = "00";
		}
				
		
		var index = 0;
		for(var row=0; row<96; row++)
		{
			for(var coll=1; coll<9; coll++)
			{
				_MemoryDisplayCells[row][coll].innerHTML = _Memory[index];
				index++;
			}
		}
		
		process.state = LOADED;
		_LoadedJobs[process.pid] = process; 
		console.log(_LoadedJobs);
		//console.log(_LoadedJobs[process.pid]);
		
		_StdIn.advanceLine();
		_StdIn.putText("Process with PID " + process.pid + " added to memory");
		
	}
	else 
	{
		_StdIn.putText("Invalid. Please check your User Program Input.");
		text = "";
		arrayOpcodes = "";
		currentOp = "";
	}

	
}

function shellMagic8Ball(args)
{
	var i=0;
	var str = "";
    if (args.length > 0)
    {
		for (var i=0; i <=args.length; i++)
		{
			str+=args[i];
		}		
        _StdIn.putText(magic8ball(str));     // Requires Utils.js for magic8ball() function.
    }
    else
    {
        _StdIn.putText("Usage: magic8ball <string>  Please supply a question string.");
    }
}

function shellStatus(args)
{
	var i=0;
	var str = "";
    if (args.length > 0)
    {
		for (var i=0; i <=args.length-1; i++)
		{
			str+=args[i] + " ";
		}
		var statusStr = document.getElementById("statusText");
		statusStr.innerHTML = ("Status: "+str); //not fancy but a good start
        _StdIn.putText("Updated status to: "+ str);
    }
    else
    {
        _StdIn.putText("Usage: status <string>  Please supply a string.");
    }
}

function shellBSOD(args)
{
	krnTrapError("You have triggered the BSOD. Goodbye.");
	//BSOD...sort of.
}

function shellRun(args)
{
	if(args.length === 0 || parseInt(args) != args)
	{
		_StdIn.putText("Please enter a valid PID.");
	}
	//else if (parseInt(args) !== _LoadedJobs.length-1)  //only runs the currently loaded program in memory
	//{
	//	_StdIn.putText("Invalid PID. Currently loaded program is at PID: " +(_LoadedJobs.length-1));
	//}
	else
	{
		_StdIn.putText("Running...");
		//console.log(args);
		//console.log(_LoadedJobs[args]);
		_CurrentProcess = _LoadedJobs[args];
		//console.log(_CurrentProcess);
		_CurrentProcess.state = RUNNING;
		_ReadyQueue.enqueue(_CurrentProcess);
		_ReadyQueue.dequeue();
	
		clearCPU();
		//run the code
		_CPU.isExecuting = true;
	}
}

function shellRunAll()
{
	_StdIn.putText("Running All...");
	
	var process = null;
	
	for ( i in _LoadedJobs )
	{
		process = _LoadedJobs[i];
		_ReadyQueue.enqueue(process); //missing priority
		console.log(_ReadyQueue);
	}
	_Scheduler.algorithm = _RoundRobin; //will change this, but should make it automagically use RR
	_CurrentProcess = _ReadyQueue.dequeue();
	clearCPU();
	_CPU.isExecuting = true;

}

function shellQuantum(args)
{
	var quantum = parseInt(args[0]);
	
	if(args.length === 0 || parseInt(args) != args || quantum < 0)
	{
		_StdIn.putText("Please enter a valid, positive integer.");
	}
	else
	{
		_Quantum = quantum;
		_StdIn.putText("Quantum is now "+ quantum + ".");
	}


}


function shellProcesses()
{
	var actives = 0;
	
	for ( i in _LoadedJobs )
	{
		actives++;
	}
	
	if(actives != 0 )
	{
		_StdIn.putText("All Active PIDs: ");
		
		for ( i in _LoadedJobs )
		{
			_StdIn.putText(_LoadedJobs[i].pid.toString());
			_StdIn.putText(" ");
		}
		
	}
	else
	{
		_StdIn.putText("There are no active processes at this time.");
	}


}

function shellKill(args)
{
	if(args.length === 0 || parseInt(args) != args)
	{
		_StdIn.putText("Please enter a valid PID.");
	}
	
	else{
		var toDie = parseInt(args[0]);
		var process;
		for ( i in _LoadedJobs )
		{
			if(toDie === _LoadedJobs[i].pid)
			{
				process = _LoadedJobs[i];
				break;
			}
		}
		
		if(process)
		{
			if(process.status === RUNNING)
			{
				process.status = TERMINATED;
			}
			else
			{
				_ReadyQueue.remove(i-1);
				delete _LoadedJobs[i];
			}
			_StdIn.putText("PID has been killed.");
		}
		else
		{
			_StdIn.putText("There is no process with that PID.");
		}
	
	}


}
