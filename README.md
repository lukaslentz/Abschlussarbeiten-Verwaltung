# Abschlussarbeiten-Tool

Lokales HTML-Werkzeug zur Verwaltung von Abschlussarbeiten, praktischen Studienphasen, IPs und sonstigen betreuten Arbeiten.

## Dateien

- `index.html`  
  Enthält die HTML-Struktur der Anwendung.
- `styles.css`  
  Enthält Layout, Farben, Tabellen-, Dialog- und Gantt-Darstellung.
- `app.js`  
  Enthält die gesamte Programmlogik. Der Code ist objektorientiert aufgebaut.
- `README.md`  
  Diese Datei.

## Start

Die Datei `index.html` im Browser öffnen.

Empfohlen: Firefox oder ein aktueller Chromium-basierter Browser.

## Datenhaltung

Die Daten werden lokal im Browser über `localStorage` gespeichert.

Wichtige Eigenschaften:

- Speicherung direkt im Browser
- automatisches Speichern nach Änderungen
- manuelles Speichern über den Button „lokal gespeichert / Änderungen speichern“
- JSON-Export und JSON-Import zur Datensicherung
- JSON-Import ergänzt vorhandene Einträge und löscht keine bestehenden Daten
- CSV-Export für Weiterverarbeitung

## Projektstruktur im JavaScript

Das JavaScript ist in Klassen gegliedert:

### `ThesisStore`

Zuständig für:

- Laden und Speichern der Daten
- Migration aus älteren lokalen Speicherständen
- automatische Nummerierung der Termine
- Synchronisation von „Nächster Termin“
- Verwaltung der sichtbaren Spalten

### `MarkdownService`

Zuständig für:

- einfache Markdown-Interpretation
- Umwandlung in HTML für Anzeige
- Umwandlung in Klartext für ICS-Export

Unterstützte Markdown-Elemente:

- Überschriften mit `#`, `##`, `###`
- Fettdruck mit `**Text**`
- Kursiv mit `*Text*`
- Listen mit `- Eintrag`
- Aufgaben mit `- [ ] Aufgabe`

### `IcsService`

Zuständig für:

- Export einzelner Termine als `.ics`
- Übernahme von Datum, Uhrzeit, Titel und Notiz

### `ThesisApp`

Zuständig für die Benutzeroberfläche:

- Tabellenübersicht
- Filter
- Spaltenauswahl
- Bearbeitungsdialog
- Termin-Reiter
- Gantt-Diagramm
- Tooltipps
- Import/Export
- Event-Handling

## Hinweise zum JSON-Import

Beim Import einer JSON-Datei werden vorhandene Einträge nicht gelöscht. Die importierten Einträge werden an die bestehende Liste angefügt. Falls eine importierte ID bereits vorhanden ist, wird automatisch eine neue ID vergeben, damit kein bestehender Eintrag überschrieben wird.

## Hinweise zum JSON-Export

In Browsern mit File System Access API öffnet sich ein Dateidialog. Falls der Browser dies nicht unterstützt, wird automatisch ein normaler Download ausgelöst.

## Hinweise zum Gantt-Diagramm

- Klick auf eine Arbeit öffnet den allgemeinen Bearbeitungsdialog.
- Klick auf einen Terminmarker öffnet den zugehörigen Termin.
- Klick auf ein leeres KW-Feld erzeugt einen neuen Termin.
- Termine werden automatisch nach Datum und Uhrzeit sortiert.
- Termine werden automatisch als „Termin 1“, „Termin 2“, ... nummeriert.

## Autor

Lukas Lentz  
E-Mail: [L.Lentz@umwelt-campus.de](mailto:L.Lentz@umwelt-campus.de?subject=Abschlussarbeiten-Tool)


## Version v26: Terminaufgaben

Jeder Termin enthält nun drei getrennte Bereiche:

- Notiz
- Aufgaben Betreuer*In
- Aufgaben Student*In

Alle drei Bereiche unterstützen dieselben Markdown-Funktionen. Für die beiden Aufgabenbereiche gibt es jeweils eine Checkbox „Aufgabe erledigt“.

Die Übersichtsspalten „Nächste Aktion Student*In“ und „Nächste Aktion Betreuer*In“ werden automatisch aus dem nächsten offenen Termin übernommen.

Automatische Risikologik:

- Wenn nicht beide Aufgaben erledigt sind und der Termin in weniger als 10 Tagen liegt, wird das Risiko auf „gelb“ gesetzt.
- Wenn nicht beide Aufgaben erledigt sind und der Termin in weniger als 3 Tagen liegt, wird das Risiko auf „rot“ gesetzt.

## Version v27

Im Termin-Reiter wurden die Funktionen „Termin duplizieren“ und „Termin löschen“ entfernt. Termine können dort nur noch bearbeitet und als ICS exportiert werden.

## Version v28

Die automatische Risikologik überschreibt manuelle Einstufungen nicht mehr nach unten. Sie eskaliert nur noch:

- grün → gelb
- gelb → rot
- grün → rot

Eine manuell gesetzte höhere Stufe bleibt bestehen, solange keine noch höhere automatische Stufe erreicht wird.

## Version v29

Wenn in einem Termin sowohl die Aufgabe Betreuer*In als auch die Aufgabe Student*In als erledigt markiert werden, fragt das Tool nach, ob das Risiko auf „grün“ gesetzt werden soll.

Die Buttons zum Duplizieren und Löschen eines Eintrags werden nur noch im Reiter „Allgemeines“ angezeigt. In Terminreitern sind sie ausgeblendet.

## Version v30

Die Nachfrage „Soll das Risiko auf grün gesetzt werden?“ verwendet nun einen eigenen Dialog mit genau zwei Optionen:

- Ja
- Nein

Es gibt keine Option „Abbrechen“ mehr.

## Version v31

- Das Fenster „Risiko auf grün setzen?“ ist kompakter.
- Der Button „Auswahl Einträge“ steht wieder in der Tab-Zeile auf Höhe von „Übersicht“ und „Gantt“, rechts ausgerichtet.

## Version v32

- Aufgaben aus „Aufgaben Student*In“ und „Aufgaben Betreuer*In“ werden zuverlässiger in die Übersichtsspalten übernommen.
- In der Übersicht werden die Aktionsspalten nur einzeilig angezeigt.
- Nach 1 Sekunde Mouseover über einer Aktionszelle wird der vollständige Text als temporäres Fenster angezeigt.

## Version v33

- Im Termin-Reiter gibt es wieder die Funktion „Termin löschen“.
- Im Gantt können mehrere Termine in derselben Kalenderwoche angezeigt werden.
- Jeder Terminmarker ist einzeln anklickbar und öffnet den passenden Termin.
- Das Erstellen neuer Termine durch Klick in eine Kalenderwoche bleibt erhalten.

## Version v34

- Das HTML-Handbuch ist als `manual.html` direkt im Projekt enthalten.
- Im Tool gibt es einen Button `Help`, der das Handbuch öffnet.
- Das Layout des Tools wurde optisch an das Handbuch angepasst.
- Im Handbuch wurde der Abschnitt „Git und Projektpflege“ auf den öffentlichen Repository-Link reduziert:
  https://github.com/lukaslentz/Abschlussarbeiten-Verwaltung.git

## Version v35

Das Layout wurde dezenter gestaltet:

- ruhigere Hintergrundfläche
- reduzierte Schatten
- weniger starke Gradienten
- zurückhaltendere Karten und Dialoge
- moderne, aber schlichtere Button- und Tab-Darstellung

## Version v36

Die Datumsberechnung beim Erzeugen neuer Termine aus dem Gantt wurde korrigiert. Der Wochenstart wird nun als lokales Datum erzeugt und nicht mehr über `toISOString()`. Dadurch werden Verschiebungen durch Zeitzonen vermieden.

## Version v37

Die Datenfunktionen wurden aus der Kopfzeile entfernt und in einen eigenen Reiter „Daten“ verschoben:

- JSON Export
- CSV Export
- JSON Import

Der frühere Import-Button heißt nun „JSON Import“. Beim JSON Import werden vorhandene Einträge weiterhin nicht gelöscht.

## Version v38

Der Hinweis im Reiter „Daten“ wurde angepasst:

„Der Datenbestand wird immer lokal im Browser gespeichert und steht damit bei der Benutzung des selben Browsers immer wieder zur Verfügung. Sollen Datenbestände umgezogen werden, kann ein Export als *.json erfolgen.“

## Version v39

- Hinweis im Reiter „Daten“ sprachlich korrigiert: „Der Datenbestand ...“
- Die initialen Beispieldaten umfassen nun vier Einträge.
- Einer der Beispieldatensätze ist abgeschlossen.

## Version v40

Der Button „Help“ wurde in „Hilfe“ umbenannt.

## Version v41

- Der nächste Termin wird jetzt immer als nächster zukünftiger Termin aus der Terminliste abgeleitet.
- Neue Termine werden sofort in die Übersicht übernommen.
- In der Übersicht ist der Datumseintrag in der Spalte „Nächster Termin“ anklickbar.
- Ein Klick auf dieses Datum öffnet direkt den zugehörigen Termin-Reiter.


## Rollout 1

Das integrierte Handbuch wurde aktualisiert und verwendet nun die Bezeichnung „Rollout 1“ statt einer technischen Versionsnummer.
