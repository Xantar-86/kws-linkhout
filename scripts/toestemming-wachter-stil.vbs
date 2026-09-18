' Start de mappenwachter zonder venster.
'
' De geplande taak kan de wachter niet als echte achtergrondtaak draaien: dat
' vraagt beheerdersrechten bij het registreren. Zonder die rechten draait de
' taak als aangemelde gebruiker, en dan flitst er elk kwartier een zwart
' venster op het scherm. Deze starter zet node aan het werk met vensterstand 0,
' dus onzichtbaar, en wacht niet op het einde.
'
' De taak roept dit bestand aan met:
'   wscript.exe //nologo scripts\toestemming-wachter-stil.vbs

Option Explicit

Dim shell, fso, hier, project, node, script

Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

hier = fso.GetParentFolderName(WScript.ScriptFullName)
project = fso.GetParentFolderName(hier)
node = shell.ExpandEnvironmentStrings("%ProgramFiles%") & "\nodejs\node.exe"
script = fso.BuildPath(hier, "toestemming-wachter.mjs")

If Not fso.FileExists(node) Then
  ' Staat node elders, dan laten we het pad los en vertrouwen we op PATH.
  node = "node.exe"
End If

shell.CurrentDirectory = project
' 0 = geen venster, False = niet wachten tot het klaar is.
shell.Run """" & node & """ """ & script & """", 0, False
