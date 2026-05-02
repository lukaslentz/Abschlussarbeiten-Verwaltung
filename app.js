/*
 * Abschlussarbeiten-Tool v40
 * Objektorientierter Aufbau:
 * - ThesisStore: Datenhaltung, Import/Export, Autosave
 * - MarkdownService: einfache Markdown-Interpretation
 * - IcsService: Export einzelner Termine als ICS
 * - ThesisApp: UI, Filter, Dialoge, Gantt und Ereignisbindung
 */

class ThesisStore {
  constructor(storageKey, oldKeys, columnStorageKey) {
    this.storageKey = storageKey;
    this.oldKeys = oldKeys;
    this.columnStorageKey = columnStorageKey;
    this.autosaveTimer = null;
    this.lastSavedSnapshot = "";
    this.theses = this.loadData();
    this.visibleColumns = this.loadVisibleColumns();
  }

  static makeId() {
    return (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }

  demoData() {
    return [
      {
        id: ThesisStore.makeId(),
        name: "Max Mustermann",
        type: "Bachelorarbeit",
        program: "Maschinenbau",
        topic: "System zur Erfassung von Betriebsdaten",
        company: "intern",
        supervisor1: "Lentz",
        supervisor2: "",
        startDate: "2026-04-15",
        dueDate: "2026-08-15",
        status: "Bearbeitung läuft",
        risk: "gelb",
        nextMeeting: "",
        lastContact: "2026-04-24",
        studentAction: "",
        supervisorAction: "",
        expose: "ja",
        outline: "in Arbeit",
        intermediate: "nein",
        colloquiumMode: "date",
        colloquiumDate: "2026-08-28",
        evaluation: "offen",
        grade: "",
        noteLink: "obsidian://open?vault=Abschlussarbeiten&file=2026_BA_Mustermann",
        folderLink: "",
        tags: "Messdaten, Versuch",
        remarks: "Beispieldatensatz.",
        appointments: [{
          id: ThesisStore.makeId(),
          title: "Termin 1",
          date: "2026-05-08",
          time: "09:00",
          notes: "## Besprechung\nMesskonzept und Datenstruktur diskutieren.",
          markdownInterpreted: false,
          supervisorTask: "- Feedback zum Messkonzept vorbereiten",
          studentTask: "- Gliederung überarbeiten\n- Datenformat skizzieren",
          supervisorTaskMarkdownInterpreted: false,
          studentTaskMarkdownInterpreted: false,
          supervisorDone: false,
          studentDone: false
        }]
      },
      {
        id: ThesisStore.makeId(),
        name: "Anna Beispiel",
        type: "Masterarbeit",
        program: "Umweltorientierte Energietechnik",
        topic: "CFD-gestützte Untersuchung eines Kühlkanals",
        company: "Fritsch GmbH",
        supervisor1: "Lentz",
        supervisor2: "Dinges",
        startDate: "2026-03-01",
        dueDate: "2026-09-01",
        status: "Angemeldet",
        risk: "grün",
        nextMeeting: "",
        lastContact: "2026-04-20",
        studentAction: "",
        supervisorAction: "",
        expose: "ja",
        outline: "ja",
        intermediate: "in Arbeit",
        colloquiumMode: "none",
        colloquiumDate: "",
        evaluation: "offen",
        grade: "",
        noteLink: "",
        folderLink: "",
        tags: "CFD, Kühlung, Industrie",
        remarks: "Industriekooperation mit Fokus auf Simulation.",
        appointments: [{
          id: ThesisStore.makeId(),
          title: "Termin 1",
          date: "2026-05-15",
          time: "10:30",
          notes: "Randbedingungen und Vernetzung prüfen.",
          markdownInterpreted: false,
          supervisorTask: "- Beispielrechnung prüfen",
          studentTask: "- Netzunabhängigkeitsstudie vorbereiten",
          supervisorTaskMarkdownInterpreted: false,
          studentTaskMarkdownInterpreted: false,
          supervisorDone: false,
          studentDone: false
        }]
      },
      {
        id: ThesisStore.makeId(),
        name: "Jonas Demo",
        type: "Praktische Studienphase",
        program: "Maschinenbau",
        topic: "Aufbau eines Versuchsstands zur Strömungsmessung",
        company: "Labor",
        supervisor1: "Lentz",
        supervisor2: "",
        startDate: "2026-04-01",
        dueDate: "2026-07-01",
        status: "Kritische Phase",
        risk: "rot",
        nextMeeting: "",
        lastContact: "2026-04-25",
        studentAction: "",
        supervisorAction: "",
        expose: "in Arbeit",
        outline: "nein",
        intermediate: "nein",
        colloquiumMode: "none",
        colloquiumDate: "",
        evaluation: "offen",
        grade: "",
        noteLink: "",
        folderLink: "",
        tags: "Versuch, Strömung, Messung",
        remarks: "Zeitkritisch wegen fehlender Sensorauswahl.",
        appointments: [{
          id: ThesisStore.makeId(),
          title: "Termin 1",
          date: "2026-05-04",
          time: "09:00",
          notes: "Sensorentscheidung treffen.",
          markdownInterpreted: false,
          supervisorTask: "- Datenblatt prüfen",
          studentTask: "- Vergleichsliste Sensoren erstellen",
          supervisorTaskMarkdownInterpreted: false,
          studentTaskMarkdownInterpreted: false,
          supervisorDone: false,
          studentDone: false
        }]
      },
      {
        id: ThesisStore.makeId(),
        name: "Lisa Abgeschlossen",
        type: "Bachelorarbeit",
        program: "Maschinenbau",
        topic: "Literaturstudie zur Betriebsfestigkeit additiv gefertigter Bauteile",
        company: "intern",
        supervisor1: "Lentz",
        supervisor2: "",
        startDate: "2025-10-01",
        dueDate: "2026-02-01",
        status: "Abgeschlossen",
        risk: "grün",
        nextMeeting: "",
        lastContact: "2026-02-10",
        studentAction: "",
        supervisorAction: "",
        expose: "ja",
        outline: "ja",
        intermediate: "ja",
        colloquiumMode: "date",
        colloquiumDate: "2026-02-12",
        evaluation: "ja",
        grade: "1,7",
        noteLink: "",
        folderLink: "",
        tags: "Betriebsfestigkeit, Literatur",
        remarks: "Abgeschlossen und bewertet.",
        appointments: [{
          id: ThesisStore.makeId(),
          title: "Termin 1",
          date: "2026-02-12",
          time: "14:00",
          notes: "Kolloquium durchgeführt.",
          markdownInterpreted: false,
          supervisorTask: "Bewertung abgeschlossen",
          studentTask: "Abschlussdokumente eingereicht",
          supervisorTaskMarkdownInterpreted: false,
          studentTaskMarkdownInterpreted: false,
          supervisorDone: true,
          studentDone: true
        }]
      }
    ].map(t => this.normalizeEntry(t));
  }


  loadData() {
    let raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      for (const key of this.oldKeys) {
        raw = localStorage.getItem(key);
        if (raw) break;
      }
    }
    if (!raw) return this.demoData();
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data.map(t => this.normalizeEntry(t)) : this.demoData();
    } catch {
      return this.demoData();
    }
  }

  loadVisibleColumns() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.columnStorageKey) || "null");
      if (Array.isArray(saved) && saved.length) {
        return saved.filter(k => COLUMN_DEFS.some(c => c.key === k));
      }
    } catch {}
    return COLUMN_DEFS.map(c => c.key);
  }

  saveVisibleColumns() {
    localStorage.setItem(this.columnStorageKey, JSON.stringify(this.visibleColumns));
  }

  normalizeEntry(t) {
    if (!t.id) t.id = ThesisStore.makeId();
    if (typeof t.colloquiumDate === "undefined") t.colloquiumDate = "";
    if (typeof t.colloquiumMode === "undefined") t.colloquiumMode = t.colloquiumDate ? "date" : "none";
    if (typeof t.supervisor1 === "undefined") t.supervisor1 = t.firstSupervisor || "";
    if (typeof t.supervisor2 === "undefined") t.supervisor2 = t.secondSupervisor || "";
    if (!Array.isArray(t.appointments)) t.appointments = [];
    if (t.runState === "beendet" && t.status !== "Abgeschlossen") t.status = "Abgeschlossen";
    this.sortAndNumberAppointments(t);
    return t;
  }

  sortAndNumberAppointments(thesis) {
    if (!thesis) return;
    if (!Array.isArray(thesis.appointments)) thesis.appointments = [];
    thesis.appointments.forEach(a => {
      if (!a.id) a.id = ThesisStore.makeId();
      if (!a.time) a.time = "09:00";
      if (!a.notes) a.notes = "bislang keine Notiz";
      if (typeof a.markdownInterpreted === "undefined") a.markdownInterpreted = false;
      if (!a.supervisorTask) a.supervisorTask = "bislang keine Aufgabe";
      if (!a.studentTask) a.studentTask = "bislang keine Aufgabe";
      if (typeof a.supervisorTaskMarkdownInterpreted === "undefined") a.supervisorTaskMarkdownInterpreted = false;
      if (typeof a.studentTaskMarkdownInterpreted === "undefined") a.studentTaskMarkdownInterpreted = false;
      if (typeof a.supervisorDone === "undefined") a.supervisorDone = false;
      if (typeof a.studentDone === "undefined") a.studentDone = false;
    });
    thesis.appointments.sort((a, b) => {
      const ad = (a.date || "9999-12-31") + " " + (a.time || "99:99");
      const bd = (b.date || "9999-12-31") + " " + (b.time || "99:99");
      return ad === bd ? String(a.id).localeCompare(String(b.id)) : ad.localeCompare(bd);
    });
    thesis.appointments.forEach((a, i) => { a.title = "Termin " + (i + 1); });
    this.syncNextMeeting(thesis);
  }

  syncNextMeeting(thesis) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dated = (thesis.appointments || [])
      .filter(a => a.date)
      .sort((a, b) => ((a.date || "") + " " + (a.time || "")).localeCompare((b.date || "") + " " + (b.time || "")));
    const next = dated.find(a => new Date(a.date + "T00:00:00") >= today) || dated[0];
    thesis.nextMeeting = next ? next.date : "";
  }

  updateRiskAndActions(thesis) {
    if (!thesis) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = (thesis.appointments || []).slice().sort((a, b) => {
      const ad = (a.date || "9999-12-31") + " " + (a.time || "99:99");
      const bd = (b.date || "9999-12-31") + " " + (b.time || "99:99");
      return ad.localeCompare(bd);
    });

    const future = appointments.filter(a => !a.date || new Date(a.date + "T00:00:00") >= today);
    const relevant = future.find(a => !(a.studentDone && a.supervisorDone)) || appointments.find(a => !(a.studentDone && a.supervisorDone)) || future[0];

    if (relevant) {
      thesis.studentAction = relevant.studentDone ? "" : (relevant.studentTask || "bislang keine Aufgabe");
      thesis.supervisorAction = relevant.supervisorDone ? "" : (relevant.supervisorTask || "bislang keine Aufgabe");

      if (relevant.date && !(relevant.studentDone && relevant.supervisorDone)) {
        const days = Math.floor((new Date(relevant.date + "T00:00:00") - today) / 86400000);
        const riskRank = { "grün": 0, "gelb": 1, "rot": 2 };
        const currentRank = riskRank[thesis.risk] ?? 0;
        const targetRisk = days < 3 ? "rot" : (days < 10 ? "gelb" : null);
        if (targetRisk && riskRank[targetRisk] > currentRank) {
          thesis.risk = targetRisk;
        }
      }
    } else {
      thesis.studentAction = "";
      thesis.supervisorAction = "";
    }
  }


  saveNow() {
    this.lastSavedSnapshot = JSON.stringify(this.theses);
    localStorage.setItem(this.storageKey, this.lastSavedSnapshot);
  }

  scheduleAutosave(onSaved) {
    clearTimeout(this.autosaveTimer);
    this.autosaveTimer = setTimeout(() => {
      const current = JSON.stringify(this.theses);
      if (current !== this.lastSavedSnapshot) {
        this.saveNow();
        if (onSaved) onSaved();
      }
    }, 30000);
  }

  saveIfChanged(onSaved) {
    const current = JSON.stringify(this.theses);
    if (current !== this.lastSavedSnapshot) {
      this.saveNow();
      if (onSaved) onSaved();
    }
  }
}

class MarkdownService {
  static escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[c]));
  }

  static renderHtml(md) {
    let text = MarkdownService.escapeHtml(md || "");
    text = text.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    text = text.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    text = text.replace(/^# (.*)$/gm, "<h1>$1</h1>");
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/(^|[^*])\*(.*?)\*/g, "$1<em>$2</em>");
    text = text.replace(/^- \[ \] (.*)$/gm, "<div>☐ $1</div>");
    text = text.replace(/^- \[x\] (.*)$/gim, "<div>☑ $1</div>");
    text = text.replace(/(?:^|\n)(- .*(?:\n- .*)*)/g, (_, block) => {
      const items = block.trim().split("\n").map(line => "<li>" + line.replace(/^- /, "") + "</li>").join("");
      return "<ul>" + items + "</ul>";
    });
    text = text.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
    return "<p>" + text + "</p>";
  }

  static renderPlain(md) {
    let text = String(md || "");
    text = text.replace(/^### (.*)$/gm, "$1");
    text = text.replace(/^## (.*)$/gm, "$1");
    text = text.replace(/^# (.*)$/gm, "$1");
    text = text.replace(/\*\*(.*?)\*\*/g, "$1");
    text = text.replace(/(^|[^*])\*(.*?)\*/g, "$1$2");
    text = text.replace(/^- \[ \] (.*)$/gm, "☐ $1");
    text = text.replace(/^- \[x\] (.*)$/gim, "☑ $1");
    text = text.replace(/^- (.*)$/gm, "• $1");
    return text;
  }
}

class IcsService {
  static escape(text) {
    return String(text || "")
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");
  }

  static exportAppointment(thesis, appt) {
    if (!appt.date) {
      alert("Bitte zuerst ein Datum für den Termin eintragen.");
      return;
    }
    const title = (appt.title || "Termin") + " – " + (thesis.name || "Abschlussarbeit");
    const noteMain = appt.markdownInterpreted ? MarkdownService.renderPlain(appt.notes) : (appt.notes || "bislang keine Notiz");
    const supervisorTask = appt.supervisorTaskMarkdownInterpreted ? MarkdownService.renderPlain(appt.supervisorTask) : (appt.supervisorTask || "bislang keine Aufgabe");
    const studentTask = appt.studentTaskMarkdownInterpreted ? MarkdownService.renderPlain(appt.studentTask) : (appt.studentTask || "bislang keine Aufgabe");
    const note = "Notiz:\n" + noteMain + "\n\nAufgaben Betreuer*In:\n" + supervisorTask + "\n\nAufgaben Student*In:\n" + studentTask;
    let dtStartLine = "";
    let dtEndLine = "";

    if (appt.time) {
      const start = new Date(appt.date + "T" + appt.time + ":00");
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const fmt = d => d.getFullYear().toString().padStart(4, "0") +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0") + "T" +
        String(d.getHours()).padStart(2, "0") +
        String(d.getMinutes()).padStart(2, "0") +
        String(d.getSeconds()).padStart(2, "0");
      dtStartLine = "DTSTART:" + fmt(start);
      dtEndLine = "DTEND:" + fmt(end);
    } else {
      dtStartLine = "DTSTART;VALUE=DATE:" + appt.date.replaceAll("-", "");
    }

    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Abschlussarbeiten Tool//DE",
      "BEGIN:VEVENT", "UID:" + appt.id + "@abschlussarbeiten-tool",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      dtStartLine, dtEndLine,
      "SUMMARY:" + IcsService.escape(title),
      "DESCRIPTION:" + IcsService.escape(note),
      "END:VEVENT", "END:VCALENDAR"
    ].filter(Boolean).join("\r\n");

    ThesisApp.downloadFile(ThesisApp.safeFileName((thesis.name || "Abschlussarbeit") + " - " + (thesis.type || "Art") + " - " + (appt.title || "Termin")) + ".ics", ics, "text/calendar;charset=utf-8");
  }
}

const OPTIONS = {
  status: ["Anfrage", "Thema in Klärung", "Exposé", "Angemeldet", "Bearbeitung läuft", "Kritische Phase", "Abgegeben", "Bewertung läuft", "Abgeschlossen"],
  risk: ["grün", "gelb", "rot"],
  type: ["Praktische Studienphase", "IP", "Bachelorarbeit", "Masterarbeit", "Sonstige"],
  checklist: ["nein", "in Arbeit", "ja", "offen"]
};

const COLUMN_DEFS = [
  { key:"name", label:"Name", cls:"col-name" },
  { key:"type", label:"Art", cls:"col-type" },
  { key:"program", label:"Studiengang", cls:"col-program" },
  { key:"topic", label:"Thema", cls:"col-topic" },
  { key:"supervisor1", label:"Betreuer 1", cls:"col-supervisor" },
  { key:"supervisor2", label:"Betreuer 2", cls:"col-supervisor" },
  { key:"startDate", label:"Start", cls:"col-date" },
  { key:"dueDate", label:"Abgabe", cls:"col-date" },
  { key:"status", label:"Status", cls:"col-status" },
  { key:"risk", label:"Risiko", cls:"col-risk" },
  { key:"nextMeeting", label:"Nächster Termin", cls:"col-date" },
  { key:"colloquiumDate", label:"Kolloquium", cls:"col-date" },
  { key:"lastContact", label:"Letzter Kontakt", cls:"col-date" },
  { key:"studentAction", label:"Nächste Aktion Student*In", cls:"col-action" },
  { key:"supervisorAction", label:"Nächste Aktion Betreuer*In", cls:"col-action" },
  { key:"links", label:"Links", cls:"col-links" }
];

class ThesisApp {
  constructor() {
    this.$ = id => document.getElementById(id);
    this.store = new ThesisStore(
      "abschlussarbeiten_tool_v40",
      ["abschlussarbeiten_tool_v39","abschlussarbeiten_tool_v38","abschlussarbeiten_tool_v37","abschlussarbeiten_tool_v36","abschlussarbeiten_tool_v35","abschlussarbeiten_tool_v34","abschlussarbeiten_tool_v33","abschlussarbeiten_tool_v32","abschlussarbeiten_tool_v31","abschlussarbeiten_tool_v30","abschlussarbeiten_tool_v29","abschlussarbeiten_tool_v28","abschlussarbeiten_tool_v27","abschlussarbeiten_tool_v26","abschlussarbeiten_tool_v25","abschlussarbeiten_tool_v24","abschlussarbeiten_tool_v23","abschlussarbeiten_tool_v22","abschlussarbeiten_tool_v21","abschlussarbeiten_tool_v20","abschlussarbeiten_tool_v19","abschlussarbeiten_tool_v18","abschlussarbeiten_tool_v17","abschlussarbeiten_tool_v16","abschlussarbeiten_tool_v15","abschlussarbeiten_tool_v14","abschlussarbeiten_tool_v13","abschlussarbeiten_tool_v12","abschlussarbeiten_tool_v11","abschlussarbeiten_tool_v10","abschlussarbeiten_tool_v9","abschlussarbeiten_tool_v8","abschlussarbeiten_tool_v7","abschlussarbeiten_tool_v6","abschlussarbeiten_tool_v5","abschlussarbeiten_tool_v4","abschlussarbeiten_tool_v3","abschlussarbeiten_tool_v2","abschlussarbeiten_tool_v1"],
      "abschlussarbeiten_visible_columns_v1"
    );
    this.currentAppointmentId = null;
    this.dialogMode = "normal";
    this.ganttTooltipTimer = null;
    this.actionTooltipTimer = null;
  }

  init() {
    this.initSelects();
    this.bindEvents();
    this.store.saveNow();
    this.updateStorageStatus();
    this.setDefaultGanttRangeIfEmpty();
    this.renderTable();
  }

  isClosed(t) { return t.status === "Abgeschlossen"; }
  formatDate(dateStr) { return dateStr ? new Date(dateStr + "T00:00:00").toLocaleDateString("de-DE") : ""; }
  dateValue(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  daysUntil(dateStr) {
    if (!dateStr) return "";
    const today = new Date(); today.setHours(0,0,0,0);
    const d = new Date(dateStr + "T00:00:00");
    return Math.round((d - today) / 86400000);
  }

  updateStorageStatus() {
    const now = new Date();
    this.$("storageStatus").textContent = "lokal gespeichert: " + now.toLocaleTimeString("de-DE", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
  }

  markUnsaved() { this.$("storageStatus").textContent = "Änderungen speichern"; }
  scheduleAutosave() { this.store.scheduleAutosave(() => this.updateStorageStatus()); this.markUnsaved(); }

  fillSelect(select, values, withEmpty=false) {
    select.innerHTML = withEmpty ? '<option value="">alle</option>' : "";
    values.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v; opt.textContent = v;
      select.appendChild(opt);
    });
  }

  initSelects() {
    this.fillSelect(this.$("statusFilter"), OPTIONS.status, true);
    const activeOpt = document.createElement("option");
    activeOpt.value = "__active__"; activeOpt.textContent = "alle aktiven";
    this.$("statusFilter").insertBefore(activeOpt, this.$("statusFilter").children[1]);
    this.fillSelect(this.$("riskFilter"), OPTIONS.risk, true);
    this.fillSelect(this.$("typeFilter"), OPTIONS.type, true);
    this.fillSelect(this.$("status"), OPTIONS.status);
    this.fillSelect(this.$("risk"), OPTIONS.risk);
    this.fillSelect(this.$("type"), OPTIONS.type);
    ["expose","outline","intermediate","evaluation"].forEach(id => this.fillSelect(this.$(id), OPTIONS.checklist));
  }

  filteredData() {
    const q = this.$("searchInput").value.trim().toLowerCase();
    const display = this.$("displayFilter").value;
    const st = this.$("statusFilter").value;
    const risk = this.$("riskFilter").value;
    const type = this.$("typeFilter").value;

    let rows = this.store.theses.filter(t => {
      const text = Object.values(t).join(" ").toLowerCase();
      const d = this.daysUntil(t.dueDate);
      const displayOk =
        display === "all" ||
        (display === "active" && !this.isClosed(t)) ||
        (display === "closed" && this.isClosed(t)) ||
        (display === "critical" && !this.isClosed(t) && t.risk === "rot") ||
        (display === "due30" && !this.isClosed(t) && d !== "" && d >= 0 && d <= 30);
      return displayOk &&
        (!q || text.includes(q)) &&
        (!st || (st === "__active__" ? t.status !== "Abgeschlossen" : t.status === st)) &&
        (!risk || t.risk === risk) &&
        (!type || t.type === type);
    });

    const sort = this.$("sortSelect").value;
    const riskRank = { rot:0, gelb:1, grün:2 };
    rows.sort((a,b) => {
      if (sort === "due") return String(a.dueDate || "9999").localeCompare(String(b.dueDate || "9999"));
      if (sort === "next") return String(a.nextMeeting || "9999").localeCompare(String(b.nextMeeting || "9999"));
      if (sort === "risk") return (riskRank[a.risk] ?? 99) - (riskRank[b.risk] ?? 99);
      if (sort === "name") return String(a.name || "").localeCompare(String(b.name || ""));
      if (sort === "status") return String(a.status || "").localeCompare(String(b.status || ""));
      return 0;
    });
    return rows;
  }

  renderDashboard() {
    const active = this.store.theses.filter(t => !this.isClosed(t)).length;
    const ended = this.store.theses.filter(t => this.isClosed(t)).length;
    const red = this.store.theses.filter(t => !this.isClosed(t) && t.risk === "rot").length;
    const due30 = this.store.theses.filter(t => {
      const d = this.daysUntil(t.dueDate);
      return !this.isClosed(t) && d !== "" && d >= 0 && d <= 30;
    }).length;
    const metrics = [["Laufende Arbeiten", active], ["Abgeschlossen", ended], ["Risiko rot", red], ["Abgabe ≤ 30 Tage", due30]];
    this.$("dashboard").innerHTML = metrics.map(m => `<div class="card"><div class="metric-label">${m[0]}</div><div class="metric-value">${m[1]}</div></div>`).join("");
  }

  renderTableHeader() {
    const row = this.$("overviewHeaderRow");
    row.innerHTML = "";
    COLUMN_DEFS.forEach(col => {
      if (!this.store.visibleColumns.includes(col.key)) return;
      const th = document.createElement("th");
      th.textContent = col.label;
      th.className = col.cls || "";
      row.appendChild(th);
    });
  }

  appendCell(row, text, cls="") {
    const td = document.createElement("td");
    if (cls) td.className = cls;
    td.textContent = text || "";
    row.appendChild(td);
    return td;
  }

  renderTable() {
    this.store.theses.forEach(t => this.store.updateRiskAndActions(t));
    const rows = this.filteredData();
    this.renderDashboard();
    this.renderTableHeader();
    const tbody = this.$("tableBody");
    tbody.innerHTML = "";

    if (!rows.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = Math.max(1, this.store.visibleColumns.length);
      td.className = "empty";
      td.textContent = "Keine passenden Einträge.";
      tr.appendChild(td); tbody.appendChild(tr);
      this.renderGantt(rows);
      return;
    }

    rows.forEach(t => {
      const tr = document.createElement("tr");
      tr.className = "clickable-row" + (this.isClosed(t) ? " closed-row" : "");
      tr.dataset.id = t.id;
      const v = key => this.store.visibleColumns.includes(key);

      if (v("name")) this.appendCell(tr, t.name);
      if (v("type")) this.appendCell(tr, t.type);
      if (v("program")) this.appendCell(tr, t.program);
      if (v("topic")) {
        const cell = this.appendCell(tr, "", "topic-cell");
        cell.innerHTML = MarkdownService.escapeHtml(t.topic) + '<br><span class="muted">' + MarkdownService.escapeHtml(t.company) + "</span>";
      }
      if (v("supervisor1")) this.appendCell(tr, t.supervisor1);
      if (v("supervisor2")) this.appendCell(tr, t.supervisor2);
      if (v("startDate")) this.appendCell(tr, this.formatDate(t.startDate));
      if (v("dueDate")) this.appendCell(tr, this.formatDate(t.dueDate));
      if (v("status")) {
        const cell = this.appendCell(tr, "");
        cell.innerHTML = `<span class="status ${this.isClosed(t) ? "status-closed" : ""}">${MarkdownService.escapeHtml(t.status)}</span>`;
      }
      if (v("risk")) {
        const riskClass = t.risk === "rot" ? "risk-red" : (t.risk === "gelb" ? "risk-yellow" : "risk-green");
        const cell = this.appendCell(tr, "");
        cell.innerHTML = `<span class="risk ${riskClass}">${MarkdownService.escapeHtml(t.risk)}</span>`;
      }
      if (v("nextMeeting")) this.appendCell(tr, this.formatDate(t.nextMeeting));
      if (v("colloquiumDate")) this.appendCell(tr, t.colloquiumMode === "date" ? this.formatDate(t.colloquiumDate) : "kein");
      if (v("lastContact")) this.appendCell(tr, this.formatDate(t.lastContact));
      if (v("studentAction")) {
        const cell = this.appendCell(tr, t.studentAction, "action-text action-preview");
        cell.dataset.fullText = t.studentAction || "";
      }
      if (v("supervisorAction")) {
        const cell = this.appendCell(tr, t.supervisorAction, "action-text action-preview");
        cell.dataset.fullText = t.supervisorAction || "";
      }
      if (v("links")) {
        const cell = this.appendCell(tr, "");
        const links = [];
        if (t.noteLink) links.push(`<a href="${MarkdownService.escapeHtml(t.noteLink)}">Notiz</a>`);
        if (t.folderLink) links.push(`<a href="${MarkdownService.escapeHtml(t.folderLink)}">Ordner</a>`);
        cell.innerHTML = links.join(" · ");
      }
      tbody.appendChild(tr);
    });

    this.setDefaultGanttRangeIfEmpty();
    this.renderGantt(rows);
  }

  startOfWeek(date) {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    return d;
  }

  addDays(date, days) { const d = new Date(date); d.setDate(d.getDate()+days); return d; }

  getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  setDefaultGanttRangeIfEmpty() {
    if (this.$("ganttStart").value && this.$("ganttEnd").value) return;
    const active = this.store.theses.filter(t => !this.isClosed(t) && t.startDate && t.dueDate);
    let s, e;
    if (active.length) {
      s = new Date(Math.min(...active.map(t => new Date(t.startDate + "T00:00:00"))));
      e = new Date(Math.max(...active.map(t => new Date(t.dueDate + "T00:00:00"))));
    } else {
      s = new Date(); e = this.addDays(s, 365);
    }
    this.$("ganttStart").value = this.dateValue(this.startOfWeek(this.addDays(s, -7)));
    this.$("ganttEnd").value = this.dateValue(this.startOfWeek(this.addDays(e, 21)));
  }

  ganttCell(text, cls) {
    const div = document.createElement("div");
    div.className = cls;
    div.textContent = text;
    return div;
  }

  renderGantt(rows) {
    const gantt = this.$("gantt");
    gantt.innerHTML = "";
    let start = this.$("ganttStart").value ? this.startOfWeek(new Date(this.$("ganttStart").value + "T00:00:00")) : this.startOfWeek(new Date());
    let end = this.$("ganttEnd").value ? this.startOfWeek(new Date(this.$("ganttEnd").value + "T00:00:00")) : this.addDays(start, 365);
    if (end < start) [start, end] = [end, start];

    const weeks = Math.max(1, Math.ceil((end - start) / 604800000) + 1);
    const today = new Date(); today.setHours(0,0,0,0);
    gantt.style.gridTemplateColumns = "260px repeat(" + weeks + ", 34px)";
    gantt.appendChild(this.ganttCell("Arbeit", "gantt-head"));

    for (let i=0; i<weeks; i++) {
      const d = this.addDays(start, i*7);
      gantt.appendChild(this.ganttCell("KW " + this.getISOWeek(d), "gantt-head"));
    }

    rows.forEach(t => {
      const name = (t.name || "ohne Name") + " – " + (t.type || "");
      const nameCell = this.ganttCell(name, "gantt-name" + (this.isClosed(t) ? " closed-gantt" : ""));
      nameCell.dataset.id = t.id;
      nameCell.title = "Bearbeiten: " + name;
      gantt.appendChild(nameCell);

      const s = t.startDate ? new Date(t.startDate + "T00:00:00") : null;
      const e = t.dueDate ? new Date(t.dueDate + "T00:00:00") : null;
      const cDate = (t.colloquiumMode === "date" && t.colloquiumDate) ? new Date(t.colloquiumDate + "T00:00:00") : null;

      for (let i=0; i<weeks; i++) {
        const wStart = this.addDays(start, i*7);
        const wEnd = this.addDays(wStart, 6);
        let cls = "week-cell";
        if (this.isClosed(t)) cls += " closed-gantt-cell";
        if (today >= wStart && today <= wEnd) cls += " today-week";
        if (s && e && wStart <= e && wEnd >= s) cls += " active-bar";
        if (s && wStart <= s && wEnd >= s) cls += " start";
        if (e && wStart <= e && wEnd >= e) cls += " end";
        if (cDate && wStart <= cDate && wEnd >= cDate) cls += " colloquium-marker";

        const weekAppointments = (t.appointments || []).filter(a => {
          if (!a.date) return false;
          const d = new Date(a.date + "T00:00:00");
          return d >= wStart && d <= wEnd;
        });
        if (weekAppointments.length) cls += " appointment-extra";

        const cell = this.ganttCell("", cls);
        cell.dataset.thesisId = t.id;
        cell.dataset.weekStart = this.dateValue(wStart);
        cell.title = weekAppointments.length ? "" : name + "\n" + this.formatDate(t.startDate) + " – " + this.formatDate(t.dueDate);

        weekAppointments.forEach((appt, idx) => {
          const marker = document.createElement("span");
          marker.className = "appt-marker";
          marker.dataset.thesisId = t.id;
          marker.dataset.appointmentId = appt.id;
          marker.style.left = (6 + idx * 9) + "px";
          marker.title = "";
          cell.appendChild(marker);
        });

        gantt.appendChild(cell);
      }
    });
  }

  updateDialogTitle() {
    const name = this.$("name").value || "Neue Abschlussarbeit";
    const type = this.$("type").value || "";
    this.$("dialogTitle").textContent = type ? name + " – " + type : name;
  }

  getCurrentThesis() {
    const id = this.$("editId").value;
    return this.store.theses.find(x => x.id === id);
  }

  switchEditTab(tabId) {
    const isGeneral = tabId === "general";
    document.querySelectorAll(".edit-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tabId));
    this.$("generalPane").classList.toggle("active", isGeneral);
    this.$("appointmentPane").classList.toggle("active", !isGeneral);
    document.body.classList.toggle("appointment-active", !isGeneral);

    const hasExistingEntry = Boolean(this.$("editId").value);
    this.$("deleteBtn").style.display = (isGeneral && hasExistingEntry && this.dialogMode !== "newAppointment") ? "inline-flex" : "none";
    this.$("duplicateBtn").style.display = (isGeneral && hasExistingEntry && this.dialogMode !== "newAppointment") ? "inline-flex" : "none";
  }

  renderEditTabs(thesis, activeId="general") {
    this.store.sortAndNumberAppointments(thesis);
    const tabs = this.$("editTabs");
    tabs.innerHTML = "";
    const general = document.createElement("button");
    general.type = "button";
    general.className = "edit-tab";
    general.dataset.tab = "general";
    general.textContent = "Allgemeines";
    general.addEventListener("click", () => this.switchEditTab("general"));
    tabs.appendChild(general);

    (thesis.appointments || []).forEach(a => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "edit-tab";
      btn.dataset.tab = a.id;
      btn.textContent = a.title;
      btn.addEventListener("click", () => this.openAppointmentTab(a.id));
      tabs.appendChild(btn);
    });

    if (activeId === "general") this.switchEditTab("general");
    else this.openAppointmentTab(activeId);
  }

  setMarkdownMode(appt, active) {
    const ta = this.$("apptNotes");
    const rendered = this.$("renderedNotes");
    const btn = this.$("markdownToggleBtn");
    if (!ta || !rendered || !btn) return;
    if (active) {
      appt.notes = ta.value || appt.notes || "bislang keine Notiz";
      rendered.innerHTML = MarkdownService.renderHtml(appt.notes);
      rendered.style.display = "block";
      ta.style.display = "none";
      btn.classList.add("active");
      btn.dataset.active = "1";
      appt.markdownInterpreted = true;
    } else {
      ta.value = appt.notes || "bislang keine Notiz";
      rendered.style.display = "none";
      ta.style.display = "block";
      btn.classList.remove("active");
      btn.dataset.active = "0";
      appt.markdownInterpreted = false;
    }
  }

  applyMarkdownFormat(kind) {
    const mdBtn = this.$("markdownToggleBtn");
    if (mdBtn && mdBtn.dataset.active === "1") mdBtn.click();
    const ta = this.$("apptNotes");
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const value = ta.value;
    const selected = value.slice(start, end);
    let insert = selected;
    if (kind === "heading") insert = "## " + (selected || "Überschrift");
    if (kind === "bold") insert = "**" + (selected || "Text") + "**";
    if (kind === "italic") insert = "*" + (selected || "Text") + "*";
    if (kind === "list") insert = (selected || "Eintrag").split("\n").map(line => "- " + line).join("\n");
    if (kind === "todo") insert = (selected || "Aufgabe").split("\n").map(line => "- [ ] " + line).join("\n");
    ta.value = value.slice(0, start) + insert + value.slice(end);
    ta.focus();
    ta.selectionStart = start;
    ta.selectionEnd = start + insert.length;
    ta.dispatchEvent(new Event("input"));
  }


  setMarkdownModeForField(appt, field, active) {
    const ta = this.$(field + "Text");
    const rendered = this.$(field + "Rendered");
    const btn = this.$(field + "MarkdownBtn");
    if (!ta || !rendered || !btn) return;
    const flag = field + "MarkdownInterpreted";
    if (active) {
      appt[field] = ta.value || appt[field] || "";
      rendered.innerHTML = MarkdownService.renderHtml(appt[field]);
      rendered.style.display = "block";
      ta.style.display = "none";
      btn.classList.add("active");
      btn.dataset.active = "1";
      appt[flag] = true;
    } else {
      ta.value = appt[field] || "";
      rendered.style.display = "none";
      ta.style.display = "block";
      btn.classList.remove("active");
      btn.dataset.active = "0";
      appt[flag] = false;
    }
  }

  applyMarkdownFormatForField(field, kind) {
    const mdBtn = this.$(field + "MarkdownBtn");
    if (mdBtn && mdBtn.dataset.active === "1") mdBtn.click();
    const ta = this.$(field + "Text");
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const value = ta.value;
    const selected = value.slice(start, end);
    let insert = selected;
    if (kind === "heading") insert = "## " + (selected || "Überschrift");
    if (kind === "bold") insert = "**" + (selected || "Text") + "**";
    if (kind === "italic") insert = "*" + (selected || "Text") + "*";
    if (kind === "list") insert = (selected || "Eintrag").split("\\n").map(line => "- " + line).join("\\n");
    if (kind === "todo") insert = (selected || "Aufgabe").split("\\n").map(line => "- [ ] " + line).join("\\n");
    ta.value = value.slice(0, start) + insert + value.slice(end);
    ta.focus();
    ta.selectionStart = start;
    ta.selectionEnd = start + insert.length;
    ta.dispatchEvent(new Event("input"));
  }

  appointmentSectionHtml(field, title, value, doneId=null, doneValue=false) {
    return `
      <section class="appointment-section">
        <h3>${title}</h3>
        <div class="appt-toolbar">
          <button type="button" data-field="${field}" data-md="heading">Überschrift</button>
          <button type="button" data-field="${field}" data-md="bold">Fett</button>
          <button type="button" data-field="${field}" data-md="italic">Kursiv</button>
          <button type="button" data-field="${field}" data-md="list">Liste</button>
          <button type="button" data-field="${field}" data-md="todo">Aufgabe</button>
          <button type="button" id="${field}MarkdownBtn" class="markdown-toggle">Markdown</button>
        </div>
        <textarea id="${field}Text" class="appt-notes">${MarkdownService.escapeHtml(value || "")}</textarea>
        <div id="${field}Rendered" class="rendered-notes" style="display:none"></div>
        ${doneId ? `<label class="done-row"><input id="${doneId}" type="checkbox" ${doneValue ? "checked" : ""}> Aufgabe erledigt</label>` : ""}
      </section>`;
  }

  askResetRiskIfAllTasksDone(thesis, appt) {
    if (!thesis || !appt) return;
    if (appt.studentDone && appt.supervisorDone && thesis.risk !== "grün") {
      this.showTwoOptionDialog(
        "Risiko auf grün setzen?",
        "Beide Aufgaben dieses Termins sind erledigt. Soll das Risiko auf grün gesetzt werden?",
        () => {
          thesis.risk = "grün";
          this.scheduleAutosave();
          this.renderTable();
        }
      );
    }
  }

  showTwoOptionDialog(title, message, onYes) {
    const dialog = document.createElement("dialog");
    dialog.className = "compact-dialog";
    dialog.innerHTML = `
      <form method="dialog">
        <div class="dialog-head">
          <h2>${MarkdownService.escapeHtml(title)}</h2>
        </div>
        <div class="dialog-body">
          <p>${MarkdownService.escapeHtml(message)}</p>
        </div>
        <div class="dialog-foot">
          <button type="button" id="twoOptionNo">Nein</button>
          <button type="button" id="twoOptionYes" class="green">Ja</button>
        </div>
      </form>`;
    document.body.appendChild(dialog);

    dialog.querySelector("#twoOptionYes").addEventListener("click", () => {
      if (onYes) onYes();
      dialog.close();
      dialog.remove();
    });

    dialog.querySelector("#twoOptionNo").addEventListener("click", () => {
      dialog.close();
      dialog.remove();
    });

    dialog.showModal();
  }

  openAppointmentTab(apptId) {
    const thesis = this.getCurrentThesis();
    if (!thesis) return;
    const appt = (thesis.appointments || []).find(a => a.id === apptId);
    if (!appt) return;
    this.currentAppointmentId = apptId;
    document.body.classList.add("appointment-active");

    if (!appt.time) appt.time = "09:00";
    if (!appt.notes) appt.notes = "bislang keine Notiz";
    if (!appt.supervisorTask) appt.supervisorTask = "bislang keine Aufgabe";
    if (!appt.studentTask) appt.studentTask = "bislang keine Aufgabe";

    const pane = this.$("appointmentPane");
    pane.innerHTML = `
      <div class="appt-grid">
        <div><label>Titel</label><input id="apptTitle" readonly value="${MarkdownService.escapeHtml(appt.title || "Termin")}"></div>
        <div><label>Datum</label><input id="apptDate" type="date" value="${MarkdownService.escapeHtml(appt.date || "")}"></div>
        <div><label>Uhrzeit</label><input id="apptTime" type="time" value="${MarkdownService.escapeHtml(appt.time || "09:00")}"></div>
      </div>
      ${this.appointmentSectionHtml("notes", "Notiz", appt.notes)}
      ${this.appointmentSectionHtml("supervisorTask", "Aufgaben Betreuer*In", appt.supervisorTask, "supervisorDone", appt.supervisorDone)}
      ${this.appointmentSectionHtml("studentTask", "Aufgaben Student*In", appt.studentTask, "studentDone", appt.studentDone)}
      <div class="button-row" style="margin-top:12px">
        <button type="button" id="apptIcsBtn">ICS exportieren</button>
        <button type="button" id="deleteApptBtn" class="danger">Termin löschen</button>
      </div>`;

    ["notes", "supervisorTask", "studentTask"].forEach(field => {
      const ta = this.$(field + "Text");
      const btn = this.$(field + "MarkdownBtn");
      ta.value = appt[field] || "";
      document.querySelectorAll(`.appt-toolbar button[data-field="${field}"][data-md]`).forEach(b => {
        b.addEventListener("click", () => this.applyMarkdownFormatForField(field, b.dataset.md));
      });
      btn.addEventListener("click", () => {
        const active = btn.dataset.active === "1";
        this.setMarkdownModeForField(appt, field, !active);
        this.scheduleAutosave();
      });
      ta.addEventListener("input", () => {
        appt[field] = ta.value || "";
        this.scheduleAutosave();
      });
      const flag = field + "MarkdownInterpreted";
      this.setMarkdownModeForField(appt, field, !!appt[flag]);
    });

    this.$("supervisorDone").addEventListener("change", () => {
      appt.supervisorDone = this.$("supervisorDone").checked;
      this.store.updateRiskAndActions(thesis);
      this.askResetRiskIfAllTasksDone(thesis, appt);
      this.scheduleAutosave();
      this.renderTable();
    });
    this.$("studentDone").addEventListener("change", () => {
      appt.studentDone = this.$("studentDone").checked;
      this.store.updateRiskAndActions(thesis);
      this.askResetRiskIfAllTasksDone(thesis, appt);
      this.scheduleAutosave();
      this.renderTable();
    });

    this.$("apptDate").addEventListener("change", () => {
      appt.date = this.$("apptDate").value;
      this.store.sortAndNumberAppointments(thesis);
      this.store.updateRiskAndActions(thesis);
      this.scheduleAutosave();
      this.renderTable();
      this.renderEditTabs(thesis, appt.id);
    });

    this.$("apptTime").addEventListener("change", () => {
      appt.time = this.$("apptTime").value || "09:00";
      this.store.sortAndNumberAppointments(thesis);
      this.store.updateRiskAndActions(thesis);
      this.scheduleAutosave();
    });

    this.$("apptIcsBtn").addEventListener("click", () => {
      this.persistCurrentAppointmentNotes();
      IcsService.exportAppointment(thesis, appt);
    });

    this.$("deleteApptBtn").addEventListener("click", () => {
      if (confirm("Termin wirklich löschen?")) {
        thesis.appointments = thesis.appointments.filter(a => a.id !== appt.id);
        this.store.sortAndNumberAppointments(thesis);
        this.store.updateRiskAndActions(thesis);
        this.scheduleAutosave();
        this.renderTable();
        this.renderEditTabs(thesis, "general");
      }
    });

    this.switchEditTab(apptId);
  }

  addAppointment(thesisId, date) {
    const thesis = this.store.theses.find(t => t.id === thesisId);
    if (!thesis) return;
    const today = this.dateValue(new Date());
    const appt = { id: ThesisStore.makeId(), title: "Termin", date: date || today, time:"09:00", notes:"bislang keine Notiz", markdownInterpreted:false, supervisorTask:"bislang keine Aufgabe", studentTask:"bislang keine Aufgabe", supervisorTaskMarkdownInterpreted:false, studentTaskMarkdownInterpreted:false, supervisorDone:false, studentDone:false };
    thesis.appointments.push(appt);
    this.store.sortAndNumberAppointments(thesis);
    this.scheduleAutosave();
    this.renderTable();
    this.renderEditTabs(thesis, appt.id);
  }

  openDialog(data, activeAppointmentId, mode="normal") {
    const isEdit = !!data;
    this.dialogMode = mode;
    const t = data || {
      id:"", name:"", type:"Bachelorarbeit", program:"Maschinenbau", topic:"", company:"intern",
      supervisor1:"Lentz", supervisor2:"", startDate:"", dueDate:"", status:"Anfrage", risk:"grün",
      nextMeeting:"", lastContact:"", studentAction:"", supervisorAction:"", expose:"nein", outline:"nein",
      intermediate:"nein", colloquiumMode:"none", colloquiumDate:"", evaluation:"offen", grade:"",
      noteLink:"", folderLink:"", tags:"", remarks:"", appointments:[]
    };
    if (!Array.isArray(t.appointments)) t.appointments = [];
    this.store.sortAndNumberAppointments(t);

    const fields = ["name","type","program","topic","company","supervisor1","supervisor2","startDate","dueDate","status","risk","lastContact","studentAction","supervisorAction","expose","outline","intermediate","colloquiumMode","colloquiumDate","evaluation","grade","noteLink","folderLink","tags","remarks"];
    this.$("editId").value = t.id || "";
    fields.forEach(k => { this.$(k).value = t[k] || ""; });
    if (this.$("colloquiumMode").value === "") this.$("colloquiumMode").value = t.colloquiumDate ? "date" : "none";
    this.$("deleteBtn").style.display = (isEdit && this.dialogMode !== "newAppointment") ? "inline-flex" : "none";
    this.$("duplicateBtn").style.display = (isEdit && this.dialogMode !== "newAppointment") ? "inline-flex" : "none";
    this.updateDialogTitle();
    this.renderEditTabs(t, activeAppointmentId || "general");
    this.$("editDialog").showModal();
  }

  editThesis(id, apptId, mode="normal") {
    const t = this.store.theses.find(x => x.id === id);
    if (t) this.openDialog(t, apptId, mode);
  }

  persistCurrentAppointmentNotes() {
    const thesis = this.getCurrentThesis();
    if (!thesis || !this.currentAppointmentId) return;
    const appt = (thesis.appointments || []).find(a => a.id === this.currentAppointmentId);
    if (!appt) return;
    ["notes", "supervisorTask", "studentTask"].forEach(field => {
      const ta = this.$(field + "Text");
      const btn = this.$(field + "MarkdownBtn");
      if (!ta) return;
      if (btn && btn.dataset.active === "1") {
        appt[field + "MarkdownInterpreted"] = true;
      } else {
        appt[field] = ta.value || "";
        appt[field + "MarkdownInterpreted"] = false;
      }
    });
    const sd = this.$("studentDone");
    const bd = this.$("supervisorDone");
    if (sd) appt.studentDone = sd.checked;
    if (bd) appt.supervisorDone = bd.checked;
    this.store.updateRiskAndActions(thesis);
  }

  saveFromDialog() {
    this.persistCurrentAppointmentNotes();
    const id = this.$("editId").value || ThesisStore.makeId();
    this.$("editId").value = id;
    const fields = ["name","type","program","topic","company","supervisor1","supervisor2","startDate","dueDate","status","risk","lastContact","studentAction","supervisorAction","expose","outline","intermediate","colloquiumMode","colloquiumDate","evaluation","grade","noteLink","folderLink","tags","remarks"];
    const existing = this.store.theses.find(t => t.id === id) || {};
    const obj = { id, appointments: existing.appointments || [] };
    fields.forEach(f => obj[f] = this.$(f).value);
    this.store.sortAndNumberAppointments(obj);
    this.store.updateRiskAndActions(obj);
    const idx = this.store.theses.findIndex(t => t.id === id);
    if (idx >= 0) this.store.theses[idx] = obj; else this.store.theses.push(obj);
    this.scheduleAutosave();
    this.renderTable();
  }

  deleteCurrent() {
    const id = this.$("editId").value;
    const t = this.store.theses.find(x => x.id === id);
    if (!t) return;
    const entered = prompt("Zum Löschen bitte den Namen exakt eingeben:\n\n" + (t.name || ""));
    if (entered === null) return;
    if (entered !== (t.name || "")) {
      alert("Der eingegebene Name stimmt nicht überein. Der Eintrag wurde nicht gelöscht.");
      return;
    }
    this.store.theses = this.store.theses.filter(x => x.id !== id);
    this.store.saveNow();
    this.updateStorageStatus();
    this.$("editDialog").close();
    this.renderTable();
  }

  duplicateCurrent() {
    const id = this.$("editId").value;
    const t = this.store.theses.find(x => x.id === id);
    if (!t) return;
    const copy = JSON.parse(JSON.stringify(t));
    copy.id = ThesisStore.makeId();
    copy.name = (copy.name || "") + " Kopie";
    this.store.theses.push(copy);
    this.store.saveNow();
    this.updateStorageStatus();
    this.$("editDialog").close();
    this.renderTable();
  }

  renderColumnsDialog() {
    const list = this.$("columnsList");
    list.innerHTML = "";
    COLUMN_DEFS.forEach(col => {
      const label = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.value = col.key;
      cb.checked = this.store.visibleColumns.includes(col.key);
      label.appendChild(cb);
      label.appendChild(document.createTextNode(col.label));
      list.appendChild(label);
    });
  }

  findAppointmentByIds(thesisId, appointmentId) {
    const thesis = this.store.theses.find(t => t.id === thesisId);
    if (!thesis) return null;
    const appt = (thesis.appointments || []).find(a => a.id === appointmentId);
    return appt ? { thesis, appt } : null;
  }

  showGanttAppointmentTooltip(marker) {
    const data = this.findAppointmentByIds(marker.dataset.thesisId, marker.dataset.appointmentId);
    if (!data) return;
    const { appt } = data;
    const tooltip = this.$("ganttTooltip");
    tooltip.innerHTML =
      `<div class="tt-title">Titel: ${MarkdownService.escapeHtml(appt.title || "Termin")}</div>
       <div class="tt-meta">Datum: ${MarkdownService.escapeHtml(this.formatDate(appt.date))}<br>Uhrzeit: ${MarkdownService.escapeHtml(appt.time || "09:00")}</div>
       <div class="tt-notes">${MarkdownService.renderHtml(appt.notes || "bislang keine Notiz")}</div>`;
    const rect = marker.getBoundingClientRect();
    tooltip.style.left = Math.min(window.innerWidth - 380, Math.max(12, rect.left + 20)) + "px";
    tooltip.style.top = Math.min(window.innerHeight - 220, Math.max(12, rect.top + 28)) + "px";
    tooltip.classList.add("visible");
  }

  hideGanttAppointmentTooltip() {
    clearTimeout(this.ganttTooltipTimer);
    this.$("ganttTooltip").classList.remove("visible");
  }


  showActionTooltip(cell) {
    const text = cell.dataset.fullText || "";
    if (!text) return;
    const tooltip = this.$("actionTooltip");
    tooltip.innerHTML = MarkdownService.renderHtml(text);
    const rect = cell.getBoundingClientRect();
    tooltip.style.left = Math.min(window.innerWidth - 540, Math.max(12, rect.left + 8)) + "px";
    tooltip.style.top = Math.min(window.innerHeight - 220, Math.max(12, rect.bottom + 8)) + "px";
    tooltip.classList.add("visible");
  }

  hideActionTooltip() {
    clearTimeout(this.actionTooltipTimer);
    const tooltip = this.$("actionTooltip");
    if (tooltip) tooltip.classList.remove("visible");
  }

  async exportJson() {
    const content = JSON.stringify(this.store.theses, null, 2);
    const suggested = "abschlussarbeiten_" + this.dateValue(new Date()) + ".json";
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: suggested,
          types: [{ description:"JSON-Datei", accept:{ "application/json":[".json"] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }
    ThesisApp.downloadFile(suggested, content, "application/json;charset=utf-8");
  }

  exportCsv() {
    const headers = ["name","type","program","topic","company","supervisor1","supervisor2","startDate","dueDate","status","risk","lastContact","studentAction","supervisorAction","expose","outline","intermediate","colloquiumMode","colloquiumDate","evaluation","grade","noteLink","folderLink","tags","remarks"];
    const csv = [headers.join(";")]
      .concat(this.store.theses.map(t => headers.map(h => '"' + String(t[h] || "").replace(/"/g, '""') + '"').join(";")))
      .join("\n");
    ThesisApp.downloadFile("abschlussarbeiten_" + this.dateValue(new Date()) + ".csv", csv, "text/csv;charset=utf-8");
  }

  importFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        const imported = file.name.toLowerCase().endsWith(".json") ? JSON.parse(text) : this.parseCsv(text);
        if (!Array.isArray(imported)) throw new Error("Ungültiges Format");
        if (confirm(imported.length + " Einträge importieren und zu den aktuellen Daten hinzufügen?")) {
          const existingIds = new Set(this.store.theses.map(t => t.id));
          const normalized = imported.map(t => {
            const entry = this.store.normalizeEntry(t);
            if (existingIds.has(entry.id)) {
              entry.id = ThesisStore.makeId();
            }
            existingIds.add(entry.id);
            return entry;
          });
          this.store.theses = this.store.theses.concat(normalized);
          this.store.saveNow();
          this.$("ganttStart").value = "";
          this.$("ganttEnd").value = "";
          this.updateStorageStatus();
          this.renderTable();
        }
      } catch (e) {
        alert("Import fehlgeschlagen: " + e.message);
      }
    };
    reader.readAsText(file, "utf-8");
  }

  parseCsv(text) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const split = line => {
      const out = []; let cur = ""; let inQ = false;
      for (let i=0; i<line.length; i++) {
        const ch = line[i];
        if (ch === '"' && line[i+1] === '"') { cur += '"'; i++; }
        else if (ch === '"') inQ = !inQ;
        else if (ch === ";" && !inQ) { out.push(cur); cur = ""; }
        else cur += ch;
      }
      out.push(cur);
      return out;
    };
    const headers = split(lines[0]);
    return lines.slice(1).map(line => {
      const vals = split(line);
      const obj = { id: ThesisStore.makeId() };
      headers.forEach((h,i) => obj[h] = vals[i] || "");
      return obj;
    });
  }

  bindEvents() {
    let titleHoverTimer = null;
    this.$("mainTitle").addEventListener("mouseenter", () => {
      titleHoverTimer = setTimeout(() => this.$("titleInfo").classList.add("visible"), 1500);
    });
    this.$("mainTitle").addEventListener("mouseleave", () => {
      clearTimeout(titleHoverTimer);
      this.$("titleInfo").classList.remove("visible");
    });

    this.$("addBtn").addEventListener("click", () => this.openDialog(null));
    this.$("columnsBtn").addEventListener("click", () => { this.renderColumnsDialog(); this.$("columnsDialog").showModal(); });
    this.$("closeColumnsBtn").addEventListener("click", () => this.$("columnsDialog").close());
    this.$("showAllColumnsBtn").addEventListener("click", () => {
      this.store.visibleColumns = COLUMN_DEFS.map(c => c.key);
      this.store.saveVisibleColumns();
      this.renderColumnsDialog();
      this.renderTable();
    });
    this.$("columnsForm").addEventListener("submit", e => {
      e.preventDefault();
      this.store.visibleColumns = Array.from(document.querySelectorAll("#columnsList input:checked")).map(cb => cb.value);
      if (!this.store.visibleColumns.length) this.store.visibleColumns = ["name"];
      this.store.saveVisibleColumns();
      this.$("columnsDialog").close();
      this.renderTable();
    });

    this.$("storageStatus").addEventListener("click", () => { this.store.saveNow(); this.updateStorageStatus(); });
    setInterval(() => this.store.saveIfChanged(() => this.updateStorageStatus()), 120000);

    this.$("closeDialogBtn").addEventListener("click", () => {
      this.persistCurrentAppointmentNotes();
      const thesis = this.getCurrentThesis();
      if (thesis) this.store.updateRiskAndActions(thesis);
      this.scheduleAutosave();
      this.renderTable();
      this.dialogMode = "normal";
      this.$("editDialog").close();
    });
    this.$("editForm").addEventListener("submit", e => {
      e.preventDefault();
      this.saveFromDialog();
      this.dialogMode = "normal";
      this.$("editDialog").close();
    });
    this.$("deleteBtn").addEventListener("click", () => this.deleteCurrent());
    this.$("duplicateBtn").addEventListener("click", () => this.duplicateCurrent());

    this.$("exportJsonBtn").addEventListener("click", () => this.exportJson());
    this.$("exportCsvBtn").addEventListener("click", () => this.exportCsv());
    this.$("helpBtn").addEventListener("click", () => window.open("manual.html", "_blank"));
    this.$("importFile").addEventListener("change", e => {
      if (e.target.files?.[0]) this.importFile(e.target.files[0]);
      e.target.value = "";
    });

    ["searchInput","displayFilter","statusFilter","riskFilter","typeFilter","sortSelect"].forEach(id => {
      this.$(id).addEventListener("input", () => this.renderTable());
      this.$(id).addEventListener("change", () => this.renderTable());
    });

    this.$("applyGanttRangeBtn").addEventListener("click", () => this.renderGantt(this.filteredData()));
    this.$("ganttStart").addEventListener("change", () => this.renderGantt(this.filteredData()));
    this.$("ganttEnd").addEventListener("change", () => this.renderGantt(this.filteredData()));

    this.$("tableBody").addEventListener("click", e => {
      const link = e.target.closest("a");
      if (link) return;
      const row = e.target.closest("tr[data-id]");
      if (row) this.editThesis(row.dataset.id);
    });
    this.$("tableBody").addEventListener("mouseover", e => {
      const cell = e.target.closest(".action-preview");
      if (!cell) return;
      clearTimeout(this.actionTooltipTimer);
      this.actionTooltipTimer = setTimeout(() => this.showActionTooltip(cell), 1000);
    });
    this.$("tableBody").addEventListener("mouseout", e => {
      const cell = e.target.closest(".action-preview");
      if (cell) this.hideActionTooltip();
    });

    this.$("gantt").addEventListener("click", e => {
      const marker = e.target.closest(".appt-marker[data-appointment-id]");
      if (marker) {
        this.editThesis(marker.dataset.thesisId, marker.dataset.appointmentId);
        return;
      }

      const nameCell = e.target.closest(".gantt-name[data-id]");
      if (nameCell) { this.editThesis(nameCell.dataset.id); return; }

      const weekCell = e.target.closest(".week-cell[data-thesis-id]");
      if (weekCell) {
        this.editThesis(weekCell.dataset.thesisId, null, "newAppointment");
        setTimeout(() => this.addAppointment(weekCell.dataset.thesisId, weekCell.dataset.weekStart), 0);
      }
    });

    this.$("gantt").addEventListener("mouseover", e => {
      const marker = e.target.closest(".appt-marker[data-appointment-id]");
      if (!marker) return;
      clearTimeout(this.ganttTooltipTimer);
      this.ganttTooltipTimer = setTimeout(() => this.showGanttAppointmentTooltip(marker), 1000);
    });
    this.$("gantt").addEventListener("mouseout", e => {
      const marker = e.target.closest(".appt-marker[data-appointment-id]");
      if (marker) this.hideGanttAppointmentTooltip();
    });
    this.$("gantt").addEventListener("scroll", () => this.hideGanttAppointmentTooltip());

    this.$("addAppointmentBtn").addEventListener("click", () => this.addAppointment(this.$("editId").value));
    this.$("name").addEventListener("input", () => this.updateDialogTitle());
    this.$("type").addEventListener("change", () => this.updateDialogTitle());
    this.$("colloquiumMode").addEventListener("change", () => {
      if (this.$("colloquiumMode").value === "none") this.$("colloquiumDate").value = "";
    });

    document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
      btn.classList.add("active");
      this.$(btn.dataset.view).classList.add("active");
      this.setDefaultGanttRangeIfEmpty();
      this.renderTable();
    }));

    window.addEventListener("beforeunload", () => this.store.saveNow());
  }

  static safeFileName(s) {
    return String(s || "datei").replace(/[^a-z0-9äöüß -]+/gi, "_").replace(/\s+/g, " ").trim();
  }

  static downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    window.app = new ThesisApp();
    window.app.init();
  } catch (err) {
    alert("Fehler beim Start des Tools: " + err.message);
    console.error(err);
  }
});
