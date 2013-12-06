/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "OrangeS";  // Oranges & OS, together....get it? OS, separated but implied...no?...okay oranges as the background then.
var APP_VERSION = "0.505";  // SOS

var CPU_CLOCK_INTERVAL = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;  

//var _TotalMemory = 255; //256 bytes
var _TotalMemory = 768; //256 bytes
var _MemoryBlockSize = 255; //256 bytes

var NEW 		= 0; // new process
var LOADED   	= 1; // to memory
var READY		= 2; // to execute
var RUNNING 	= 3; // going now
var TERMINATED 	= 4; // done
var ONDISK 		= 5; //stored to disk
//
// Global Variables
//
var _CPU = null;

var _OSclock = 0;       // Page 23.

//var _Mode = 0;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas = null;               // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

var MAXLENGTH = 60;	//for creating file

var _Memory = null;
var _MemoryManager = null;
var _MemoryDisplayCells = null;
var _FileSystemDisplayCells = null;
var _PID = 0;
var _LoadedJobs = null;	//_LoadedJobs is the resident list, sorry, LoadedJobs is a way more obvious name
var _CurrentProcess = null;
var _ReadyQueue = null;
var _Scheduler = null;
var _Quantum = 6;
var _CurCycleCount = 0;
var _RoundRobin = 0;
var _FCFS = 1;
var _Priority = 2;
var _DefaultPriority = 9;

var MBR = "000";
var TSB = "999";
var DIREND = 77;
var FILESTART = 100;
var FILEEND = 300;


// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;
var krnfsDD = null;

// For testing...
var _GLaDOS = null;
