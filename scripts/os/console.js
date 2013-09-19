/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
    // Properties
	
	
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    this.buffer = "";
	this.recalledBuffer = "";
    
    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
    };

    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };

    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize;
    };

    this.handleInput = function() {
       while (_KernelInputQueue.getSize() > 0)
       {
           // Get the next character from the kernel input queue.
           var chr = _KernelInputQueue.dequeue();
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
           if (chr == String.fromCharCode(13))  //     Enter key
           {
               // The enter key marks the end of a console command, so ...
               // ... tell the shell ...
               _OsShell.handleInput(this.buffer);
			   //save last buffer
			   this.recalledBuffer = this.buffer;
               // ... and reset our buffer.
               this.buffer = "";
           }
		   else if (chr == String.fromCharCode(8))  //     Backspace
           {
				if(this.buffer.length > 0)
				{
					this.removeLastChar(this.buffer.charAt(this.buffer.length - 1));
					this.buffer = this.buffer.slice(0, this.buffer.length - 1);
				}
           }
		   else if (chr == String.fromCharCode(38))
		   {
				if(this.recalledBuffer)
				{
					for(var i=0; i<=this.recalledBuffer.length; i++)
					{
						this.putText(this.recalledBuffer.charAt(i));
						this.buffer = this.recalledBuffer;
					}
				}
				this.recalledBuffer = "";
		   }
		   
           // TODO: Write a case for Ctrl-C.
           else
           {
               // This is a "normal" character, so ...
               // ... draw it on the screen...
               this.putText(chr);
               // ... and add it to our buffer.
               this.buffer += chr;
           }
       }
    };

    this.putText = function(text) {
       // My first inclination here was to write two functions: putChar() and putString().
       // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
       // between the two.  So rather than be like PHP and write two (or more) functions that
       // do the same thing, thereby encouraging confusion and decreasing readability, I
       // decided to write one function and use the term "text" to connote string or char.
       if (text !== "")
       {
           // Draw the text at the current X and Y coordinates.
		   //var nextChar = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
           //_DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
         // Move the current X position.
			var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
		 
		 if (this.CurrentXPosition+offset > _Canvas.width-20)//////////////////////////////////////////////////////////////////////////////////////////////
			{	
				_DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
				this.advanceLine();	
				this.CurrentXPosition = this.CurrentXPosition + offset;
			}
         else
		 {
			_DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
			this.CurrentXPosition = this.CurrentXPosition + offset;
		 }
       }
    };
	
	this.removeLastChar = function(chr) {
		var xBackOneChar = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, chr); //x position back by one character
		this.CurrentXPosition -= xBackOneChar;
		//_DrawingContext.clearRect(this.CurrentXPosition-1, this.CurrentYPosition - (_DefaultFontSize -1), xBackOneChar+1, _DefaultFontSize +_FontHeightMargin + 2); //erases it to be written over
		if (this.CurrentXPosition <= xBackOneChar)
		{
			_DrawingContext.clearRect(this.CurrentXPosition-1, this.CurrentYPosition - (_DefaultFontSize -1), xBackOneChar+1, _DefaultFontSize +_FontHeightMargin + 2); //erases it to be written over
			this.CurrentXPosition = _Canvas.width- (xBackOneChar+1);
			this.CurrentYPosition +=(_DefaultFontSize + _FontHeightMargin)
			this.scroll(-1);
		}
		else{
		_DrawingContext.clearRect(this.CurrentXPosition-1, this.CurrentYPosition - (_DefaultFontSize -1), xBackOneChar+1, _DefaultFontSize +_FontHeightMargin + 2); //erases it to be written over
		}
	};

    this.advanceLine = function() {
	   this.CurrentXPosition = 0;
       this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
       // TODO: Handle scrolling.
	   if (this.CurrentYPosition >= _Canvas.height)
	   {	this.scroll(1);}
    };
	
	this.scroll = function(lines) {
       
		if (lines == null) 
		{lines = 1;}
	   
		var lineOffset = lines * (_DefaultFontSize + _FontHeightMargin);
	   
		var imgData = _DrawingContext.getImageData(0, lineOffset, _Canvas.width, _Canvas.height - lineOffset);
		_DrawingContext.putImageData(imgData, 0, 0);
		_DrawingContext.clearRect(0, _Canvas.height - lineOffset, _Canvas.width, lineOffset);
	   
	   if (lines > 0){
		this.CurrentYPosition -= lineOffset;}
	   if (lines < 0){
	   this.CurrentYPosition += lineOffset;
	   }
    };
	
	this.bsod = function() 
	{
		//this.clearScreen();
	   _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height); 
		var c=document.getElementById("display");
		var ctx=c.getContext("2d");
		ctx.fillStyle="#FF8040";
		ctx.fillRect(0,0,_Canvas.width,_Canvas.height+4);
	   
		
    };
	
	
}
