/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
	
	var j = _Console.recalledBuffer.length;
    // Check to see if we even want to deal with the key that was pressed.
 	if ( (keyCode == 192) )				  // ` 
	{
	    chr = String.fromCharCode(keyCode - 96);
		if(isShifted)								// ~
		{	chr = String.fromCharCode(keyCode - 66);	}
        _KernelInputQueue.enqueue(chr);	
	}
	else if ( ((keyCode >= 65) && (keyCode <= 90)) )//||   // alan wrote "A..Z", this is really a..z and only uppercase if shift = true
														//((keyCode >= 97) && (keyCode <= 123)) )   // a..z
    {
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift key and re-adjust if necessary.
        if (isShifted)
        {
            chr = String.fromCharCode(keyCode);
        }
		
        // TODO: Check for caps-lock and handle as shifted if so.
		
        _KernelInputQueue.enqueue(chr);        
    }    
    else if ( ((keyCode >= 48) && (keyCode <= 57)) )   // digits            
    {		
		if (isShifted) 								   //digits, shifted
        {
			if ( (keyCode >= 51) && (keyCode <= 53) || //shift3 #, shift4 $, shift5 %
				 (keyCode == 49)					)  //shift1 !
			{	chr = String.fromCharCode(keyCode - 16);	}
			else if ( (keyCode == 50) )				   //shift2 @
			{	chr = String.fromCharCode(keyCode + 14);	}
			else if ( (keyCode == 56) )				   //shift8 *
			{	chr = String.fromCharCode(keyCode - 14);	}
			else if ( (keyCode == 57) )				   //shift9 (
			{	chr = String.fromCharCode(keyCode - 17);	}
			else if (  (keyCode == 55) ) 			   //shift7 &
			{	chr = String.fromCharCode(keyCode-17);		}
			else if ( (keyCode == 54) )				   //shift6 ^
			{	chr = String.fromCharCode(keyCode + 40);	}
			else if ( (keyCode == 48) )				   //shift0 )
			{	chr = String.fromCharCode(keyCode - 7);		}		
        }
		 
		else{ chr = String.fromCharCode(keyCode); }
		_KernelInputQueue.enqueue(chr); 
    }
	
	else if (  (keyCode == 32)                     ||   // space
			   (keyCode == 13)					   ||	// enter
               (keyCode == 8)					   )	// backspace	   
	{
			chr = String.fromCharCode(keyCode);
			_KernelInputQueue.enqueue(chr); 
	}		   

	else if ( (keyCode >= 96) && (keyCode <= 105) ) //numpad digits (assumed numlock on TODO: fix so it knows if numlock on or not
	{
        chr = String.fromCharCode(keyCode - 48); //TODO: shifted numpad?
        _KernelInputQueue.enqueue(chr); 	
	}
	else if ( (keyCode >= 188)	&& (keyCode <= 191) ) // , - . / (respectively)
	{
	    chr = String.fromCharCode(keyCode - 144);
		if(isShifted)
		{
			if ( (keyCode == 188) ||  (keyCode == 190) ||  //< and >
				 (keyCode == 191)						)  //?
			{	chr = String.fromCharCode(keyCode - 128);	}
			else if ( (keyCode == 189) ) 					//_ 
			{	chr = String.fromCharCode(keyCode - 94);	}
		}
        _KernelInputQueue.enqueue(chr);	
	}
	else if ( (keyCode >= 219)	&& (keyCode <= 221) ) // [ \ ] (respectively)
	{
	    chr = String.fromCharCode(keyCode - 128);
		if(isShifted)								//{ | }
		{	chr = String.fromCharCode(keyCode - 96);	}
        _KernelInputQueue.enqueue(chr);	
	}
	else if ( (keyCode == 186) )					  // ; 
	{
	    chr = String.fromCharCode(keyCode - 127);
		if(isShifted)
		{	chr = String.fromCharCode(keyCode - 128);	}
        _KernelInputQueue.enqueue(chr);	
	}
	else if ( (keyCode == 187) )				  // = 
	{
	    chr = String.fromCharCode(keyCode - 126);
		if(isShifted)
		{	chr = String.fromCharCode(keyCode - 144);	}
        _KernelInputQueue.enqueue(chr);	
	}
	else if ( (keyCode == 222) )				  // ' 
	{
	    chr = String.fromCharCode(keyCode - 183);
		if(isShifted)
		{	chr = String.fromCharCode(keyCode - 188);	}
		
        _KernelInputQueue.enqueue(chr);	
	}	
	
	else if (keyCode == 38) 
	{
		chr = String.fromCharCode(keyCode - 21);
		_KernelInputQueue.enqueue(chr);	
	}
	else if (keyCode == 40)
	{
		chr = String.fromCharCode(keyCode - 22);
		_KernelInputQueue.enqueue(chr);	
	}
	
	else 
	{ 
		if (keyCode != 16)
		{
		krnTrace("Invalid Key Press: Please try again.");
		//krnTrapError("That was not an accepted key press. Goodbye."); //I didn't do it, but thought about doing it
		}																//I'm glad I didn't, since it was on iProject1's list of things Alan hates
	}
}
