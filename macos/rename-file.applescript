(*
	rename-file.applescript

	Renames a file using the SOP naming convention (datei-konventionen):
	typ-gegenstand-kontext-datum.ext

	Opens a file picker, prompts for document type (from SOP list or custom),
	subject (Gegenstand), and optional context (Kontext), then renames the
	file with today's ISO date appended. Applies kebab-case, umlaut
	transliteration, and special character stripping.
*)

-- Document types from SOP "Gaengige Dokumenttypen"
set typList to {"rechnung", "angebot", "vertrag", "bericht", "protokoll", "praesentation", "lieferschein", "mahnung", "personal-akte", "kundenakte", "gutschrift", "auftrags-bestaetigung", "geschaeftsbericht", "jahresabschluss", "arbeitszeugnis", "krankmeldung", "reisekosten", "Eigener Typ..."}

-- Handler: sanitize text to kebab-case with umlaut transliteration
on sanitize(inputText)
	set outputText to inputText

	-- Lowercase (via shell for reliability)
	set outputText to do shell script "printf %s " & quoted form of outputText & " | tr '[:upper:]' '[:lower:]'"

	-- Transliterate umlauts
	set outputText to do shell script "printf %s " & quoted form of outputText & " | sed 's/ä/ae/g; s/ö/oe/g; s/ü/ue/g; s/ß/ss/g'"

	-- Replace spaces with hyphens
	set outputText to do shell script "printf %s " & quoted form of outputText & " | tr ' ' '-'"

	-- Strip special characters (keep alphanumeric and hyphens)
	set outputText to do shell script "printf %s " & quoted form of outputText & " | sed 's/[^a-z0-9-]//g'"

	-- Collapse multiple hyphens
	set outputText to do shell script "printf %s " & quoted form of outputText & " | sed 's/-\\{2,\\}/-/g'"

	-- Trim leading/trailing hyphens
	set outputText to do shell script "printf %s " & quoted form of outputText & " | sed 's/^-//; s/-$//'"

	return outputText
end sanitize

-- File selection
set selectedFile to choose file with prompt "Datei zum Umbenennen auswählen:"
set filePath to POSIX path of selectedFile

-- Get parent folder and original extension
set parentFolder to do shell script "dirname " & quoted form of filePath
set fileExtension to do shell script "printf %s " & quoted form of filePath & " | sed 's/.*\\.//' | tr '[:upper:]' '[:lower:]'"

-- Typ selection
set chosenTyp to choose from list typList with prompt "Dokumenttyp auswählen:" with title "Datei umbenennen" default items {"rechnung"}
if chosenTyp is false then return
set chosenTyp to item 1 of chosenTyp

if chosenTyp is "Eigener Typ..." then
	set customTypResponse to display dialog "Eigenen Typ eingeben:" default answer "" with title "Datei umbenennen" buttons {"Abbrechen", "Weiter"} default button "Weiter"
	set chosenTyp to text returned of customTypResponse
	if chosenTyp is "" then
		display alert "Typ darf nicht leer sein." as critical
		return
	end if
end if

set chosenTyp to my sanitize(chosenTyp)

-- Gegenstand (required)
set gegenstandResponse to display dialog "Gegenstand (Pflichtfeld):" default answer "" with title "Datei umbenennen" buttons {"Abbrechen", "Weiter"} default button "Weiter"
set gegenstandText to text returned of gegenstandResponse

if gegenstandText is "" then
	display alert "Gegenstand darf nicht leer sein." as critical
	return
end if

set gegenstandText to my sanitize(gegenstandText)

-- Kontext (optional)
set kontextResponse to display dialog "Kontext (optional, leer lassen zum Überspringen):" default answer "" with title "Datei umbenennen" buttons {"Abbrechen", "Umbenennen"} default button "Umbenennen"
set kontextText to text returned of kontextResponse

-- Today's date as YYYY-MM-DD
set todayDate to do shell script "date '+%Y-%m-%d'"

-- Assemble filename
if kontextText is "" then
	set newFileName to chosenTyp & "-" & gegenstandText & "-" & todayDate & "." & fileExtension
else
	set kontextText to my sanitize(kontextText)
	set newFileName to chosenTyp & "-" & gegenstandText & "-" & todayDate & "-" & kontextText & "." & fileExtension
end if

-- Build new path and rename
set newFilePath to parentFolder & "/" & newFileName

do shell script "mv " & quoted form of filePath & " " & quoted form of newFilePath

display dialog "Datei umbenannt zu:" & return & return & newFileName with title "Datei umbenennen" buttons {"OK"} default button "OK"
