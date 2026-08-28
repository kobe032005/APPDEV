@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -Command "$root='%~dp0'; $shell=New-Object -ComObject WScript.Shell; $desktop=[Environment]::GetFolderPath('Desktop'); $start=[Environment]::GetFolderPath('StartMenu'); foreach($dir in @($desktop,(Join-Path $start 'Programs'))) { $link=$shell.CreateShortcut((Join-Path $dir 'Student Directory.lnk')); $link.TargetPath=Join-Path $root 'start.cmd'; $link.WorkingDirectory=$root; $link.Description='Launch Student Directory'; $link.Save() }"
echo Desktop and Start Menu shortcuts created.
pause
