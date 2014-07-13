@echo off
REM this batch file will open a command window with the root as the current location
REM this can be placed in any directory
%~d1
cd "%~p1"
call cmd