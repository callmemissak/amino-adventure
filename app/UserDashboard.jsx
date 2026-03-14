"use client";

import { useEffect, useMemo, useState } from "react";
import { injectionSites } from "@/lib/peptabase-data";
import { readSavedPeptideSlugs } from "@/lib/saved-peptides";
import { calculateInventoryMetrics, readInventory, writeInventory } from "@/lib/inventory-tracker";
import { readInjectionLogs, writeInjectionLogs } from "@/lib/injection-log";

const initialInventory = [
  {
    id: "inventory-1",
    peptide: "Semaglutide",
    vialStrengthMg: 5,
    vialCount: 2,
    doseAmount: 0.5,
    doseUnit: "mg",
    administrationsPerWeek: 1,
    notes: "2 ml BAC water reconstitution plan",
    added: "2026-03-13"
  }
];

const initialLogs = [
  {
    id: "log-1",
    peptide: "BPC-157",
    dose: "250 mcg",
    location: "abdomen",
    date: "2026-03-13",
    notes: "Sample injection log layout for Supabase-backed storage."
  }
];

const tabCopy = {
  library: "Saved peptides and research links will live here.",
  inventory: "Track vial count, planned dosage, remaining doses, and estimated cycle duration.",
  logs: "Log peptide injections with date, dose, and site, then review them in a timeline view.",
  notes: "Submit notes to developer for research feedback and corrections."
};

function formatSavedName(value) {
  return String(value || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedSite, setSelectedSite] = useState("abdomen");
  const [inventory, setInventory] = useState(initialInventory);
  const [logs, setLogs] = useState(initialLogs);
  const [savedPeptides, setSavedPeptides] = useState([]);
  const [developerNotes, setDeveloperNotes] = useState([]);
  const [inventoryForm, setInventoryForm] = useState({
    peptide: "",
    vialStrengthMg: "",
    vialCount: "",
    doseAmount: "",
    doseUnit: "mg",
    administrationsPerWeek: "1",
    notes: "",
    added: ""
  });
  const [logForm, setLogForm] = useState({
    peptide: "",
    dose: "",
    unit: "mcg",
    date: "",
    notes: ""
  });
  const [noteForm, setNoteForm] = useState({
    peptide: "",
    insight: ""
  });

  const tabs = useMemo(
    () => [
      ["library", "Saved peptides"],
      ["inventory", "Inventory"],
      ["logs", "Injection logs"],
      ["notes", "Developer notes"]
    ],
    []
  );

  useEffect(() => {
    function syncInventory() {
      const stored = readInventory();
      setInventory(stored.length > 0 ? stored : initialInventory);
    }

    syncInventory();
    window.addEventListener("storage", syncInventory);
    window.addEventListener("peptabase:inventory-updated", syncInventory);

    return () => {
      window.removeEventListener("storage", syncInventory);
      window.removeEventListener("peptabase:inventory-updated", syncInventory);
    };
  }, []);

  useEffect(() => {
    function syncLogs() {
      const stored = readInjectionLogs();
      setLogs(stored.length > 0 ? stored : initialLogs);
    }

    syncLogs();
    window.addEventListener("storage", syncLogs);
    window.addEventListener("peptabase:injection-logs-updated", syncLogs);

    return () => {
      window.removeEventListener("storage", syncLogs);
      window.removeEventListener("peptabase:injection-logs-updated", syncLogs);
    };
  }, []);

  useEffect(() => {
    function syncSavedPeptides() {
      setSavedPeptides(readSavedPeptideSlugs());
    }

    syncSavedPeptides();
    window.addEventListener("storage", syncSavedPeptides);
    window.addEventListener("peptabase:saved-peptides-updated", syncSavedPeptides);

    return () => {
      window.removeEventListener("storage", syncSavedPeptides);
      window.removeEventListener("peptabase:saved-peptides-updated", syncSavedPeptides);
    };
  }, []);

  const addInventory = (event) => {
    event.preventDefault();

    const nextItems = [
      {
        id: `inventory-${Date.now()}`,
        peptide: inventoryForm.peptide,
        vialStrengthMg: Number(inventoryForm.vialStrengthMg),
        vialCount: Number(inventoryForm.vialCount),
        doseAmount: Number(inventoryForm.doseAmount),
        doseUnit: inventoryForm.doseUnit,
        administrationsPerWeek: Number(inventoryForm.administrationsPerWeek),
        notes: inventoryForm.notes,
        added: inventoryForm.added
      },
      ...inventory
    ];

    setInventory(nextItems);
    writeInventory(nextItems);
    setInventoryForm({
      peptide: "",
      vialStrengthMg: "",
      vialCount: "",
      doseAmount: "",
      doseUnit: "mg",
      administrationsPerWeek: "1",
      notes: "",
      added: ""
    });
  };

  const addLog = (event) => {
    event.preventDefault();

    const nextLogs = [
      {
        id: `log-${Date.now()}`,
        peptide: logForm.peptide,
        dose: `${logForm.dose} ${logForm.unit}`,
        location: selectedSite,
        date: logForm.date,
        notes: logForm.notes
      },
      ...logs
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setLogs(nextLogs);
    writeInjectionLogs(nextLogs);
    setLogForm({ peptide: "", dose: "", unit: "mcg", date: "", notes: "" });
  };

  const addDeveloperNote = (event) => {
    event.preventDefault();
    setDeveloperNotes((current) => [
      {
        id: `note-${Date.now()}`,
        peptide: noteForm.peptide,
        insight: noteForm.insight
      },
      ...current
    ]);
    setNoteForm({ peptide: "", insight: "" });
  };

  return (
    <div className="pb-form-card">
      <div className="pb-eyebrow">Dashboard tools</div>
      <h2 className="pb-card-title">Personal peptide inventory manager</h2>
      <p className="pb-form-help">{tabCopy[activeTab]}</p>

      <div className="pb-tab-row">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            className={`pb-tab-button ${activeTab === value ? "active" : ""}`}
            onClick={() => setActiveTab(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "library" ? (
        <div className="pb-link-list">
          {savedPeptides.length === 0 ? <div className="pb-empty">No saved peptides yet. Use the bookmark button on any peptide entry.</div> : null}
          {savedPeptides.map((item) => (
            <div key={item} className="pb-library-item">{formatSavedName(item)}</div>
          ))}
        </div>
      ) : null}

      {activeTab === "inventory" ? (
        <div className="pb-link-list">
          <form onSubmit={addInventory} className="pb-link-list">
            <input className="pb-field" placeholder="Peptide" value={inventoryForm.peptide} onChange={(e) => setInventoryForm((current) => ({ ...current, peptide: e.target.value }))} required />
            <div className="pb-inline-grid">
              <input className="pb-field" min="0" step="0.1" type="number" placeholder="Vial strength (mg)" value={inventoryForm.vialStrengthMg} onChange={(e) => setInventoryForm((current) => ({ ...current, vialStrengthMg: e.target.value }))} required />
              <input className="pb-field" min="1" step="1" type="number" placeholder="Vial count" value={inventoryForm.vialCount} onChange={(e) => setInventoryForm((current) => ({ ...current, vialCount: e.target.value }))} required />
            </div>
            <div className="pb-inline-grid">
              <input className="pb-field" min="0" step="0.1" type="number" placeholder="Dose per administration" value={inventoryForm.doseAmount} onChange={(e) => setInventoryForm((current) => ({ ...current, doseAmount: e.target.value }))} required />
              <select className="pb-select" value={inventoryForm.doseUnit} onChange={(e) => setInventoryForm((current) => ({ ...current, doseUnit: e.target.value }))}>
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
              </select>
            </div>
            <input className="pb-field" min="1" step="1" type="number" placeholder="Administrations per week" value={inventoryForm.administrationsPerWeek} onChange={(e) => setInventoryForm((current) => ({ ...current, administrationsPerWeek: e.target.value }))} required />
            <textarea className="pb-textarea" placeholder="Reconstitution notes" value={inventoryForm.notes} onChange={(e) => setInventoryForm((current) => ({ ...current, notes: e.target.value }))} />
            <input className="pb-field" type="date" value={inventoryForm.added} onChange={(e) => setInventoryForm((current) => ({ ...current, added: e.target.value }))} required />
            <button className="pb-button" type="submit">Add inventory item</button>
          </form>

          {inventory.map((item) => {
            const metrics = calculateInventoryMetrics(item);

            return (
              <div key={item.id} className="pb-inventory-card">
                <div className="pb-inventory-card-head">
                  <div>
                    <strong>{item.peptide}</strong>
                    <div className="pb-subtle">{item.vialStrengthMg} mg per vial | {item.vialCount} vial(s) | added {item.added}</div>
                  </div>
                  <div className="pb-pill">{item.doseAmount} {item.doseUnit} per administration</div>
                </div>
                <div className="pb-inventory-metrics">
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Total inventory</div>
                    <strong>{metrics.totalInventoryMg.toFixed(2)} mg</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Remaining doses</div>
                    <strong>{metrics.remainingDoses.toFixed(1)}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Cycle duration</div>
                    <strong>{metrics.cycleDays.toFixed(0)} days</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Cycle duration</div>
                    <strong>{metrics.cycleWeeks.toFixed(1)} weeks</strong>
                  </div>
                </div>
                <div className="pb-subtle">
                  {item.administrationsPerWeek} administration(s) per week
                  {item.notes ? ` | ${item.notes}` : ""}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {activeTab === "logs" ? (
        <div className="pb-link-list">
          <form onSubmit={addLog} className="pb-link-list">
            <input className="pb-field" placeholder="Peptide" value={logForm.peptide} onChange={(e) => setLogForm((current) => ({ ...current, peptide: e.target.value }))} required />
            <div className="pb-inline-grid">
              <input className="pb-field" placeholder="Dose" value={logForm.dose} onChange={(e) => setLogForm((current) => ({ ...current, dose: e.target.value }))} required />
              <select className="pb-select" value={logForm.unit} onChange={(e) => setLogForm((current) => ({ ...current, unit: e.target.value }))}>
                <option value="mcg">mcg</option>
                <option value="mg">mg</option>
              </select>
            </div>
            <input className="pb-field" type="date" value={logForm.date} onChange={(e) => setLogForm((current) => ({ ...current, date: e.target.value }))} required />
            <div>
              <div className="pb-subtle" style={{ marginBottom: 10 }}>Injection site map</div>
              <div className="pb-injection-map">
                {injectionSites.map((site) => (
                  <button
                    key={site}
                    type="button"
                    className={`pb-site-button ${selectedSite === site ? "active" : ""}`}
                    onClick={() => setSelectedSite(site)}
                  >
                    {site}
                  </button>
                ))}
              </div>
            </div>
            <textarea className="pb-textarea" placeholder="Notes" value={logForm.notes} onChange={(e) => setLogForm((current) => ({ ...current, notes: e.target.value }))} />
            <button className="pb-button" type="submit">Log injection</button>
          </form>

          {logs.length === 0 ? <div className="pb-empty">No injections logged yet. Add a peptide injection to start your timeline.</div> : null}
          <div className="pb-timeline">
            {logs.map((entry) => (
              <div key={entry.id} className="pb-timeline-item">
                <div className="pb-timeline-marker" aria-hidden="true" />
                <div className="pb-timeline-content">
                  <div className="pb-timeline-date">{entry.date}</div>
                  <div className="pb-log-row">
                    <strong>{entry.peptide}</strong><br />
                    {entry.dose} | {entry.location}<br />
                    <span className="pb-subtle">{entry.notes || "No notes added."}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "notes" ? (
        <div className="pb-link-list">
          <form onSubmit={addDeveloperNote} className="pb-link-list">
            <input className="pb-field" placeholder="Peptide or page" value={noteForm.peptide} onChange={(e) => setNoteForm((current) => ({ ...current, peptide: e.target.value }))} required />
            <textarea className="pb-textarea" placeholder="Research insight, feedback, correction, or observation" value={noteForm.insight} onChange={(e) => setNoteForm((current) => ({ ...current, insight: e.target.value }))} required />
            <button className="pb-button" type="submit">Queue developer note</button>
          </form>
          {developerNotes.length === 0 ? <div className="pb-empty">No submissions yet. The UI is ready for Supabase-backed persistence.</div> : null}
          {developerNotes.map((entry) => (
            <div key={entry.id} className="pb-fact-row">
              <strong>{entry.peptide}</strong><br />
              <span className="pb-subtle">{entry.insight}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
