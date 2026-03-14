"use client";

import { useMemo, useState } from "react";
import { injectionSites } from "@/lib/peptabase-data";

const initialInventory = [
  {
    id: "inventory-1",
    peptide: "Semaglutide",
    strength: "5 mg",
    quantity: "2 vials",
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
  inventory: "Track vial strength, quantity, and reconstitution notes.",
  logs: "Log peptide, dose, unit, injection site, date, and notes.",
  notes: "Submit notes to developer for research feedback and corrections."
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedSite, setSelectedSite] = useState("abdomen");
  const [inventory, setInventory] = useState(initialInventory);
  const [logs, setLogs] = useState(initialLogs);
  const [savedPeptides, setSavedPeptides] = useState(["Semaglutide", "Tirzepatide", "BPC-157"]);
  const [developerNotes, setDeveloperNotes] = useState([]);
  const [inventoryForm, setInventoryForm] = useState({
    peptide: "",
    strength: "",
    quantity: "",
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

  const addInventory = (event) => {
    event.preventDefault();
    setInventory((current) => [
      {
        id: `inventory-${Date.now()}`,
        ...inventoryForm
      },
      ...current
    ]);
    setInventoryForm({ peptide: "", strength: "", quantity: "", notes: "", added: "" });
  };

  const addLog = (event) => {
    event.preventDefault();
    setLogs((current) => [
      {
        id: `log-${Date.now()}`,
        peptide: logForm.peptide,
        dose: `${logForm.dose} ${logForm.unit}`,
        location: selectedSite,
        date: logForm.date,
        notes: logForm.notes
      },
      ...current
    ]);
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
          {savedPeptides.map((item) => (
            <div key={item} className="pb-library-item">{item}</div>
          ))}
          <button className="pb-button-secondary" type="button" onClick={() => setSavedPeptides((current) => [...current, "Retatrutide"])}>
            Save sample peptide
          </button>
        </div>
      ) : null}

      {activeTab === "inventory" ? (
        <div className="pb-link-list">
          <form onSubmit={addInventory} className="pb-link-list">
            <input className="pb-field" placeholder="Peptide" value={inventoryForm.peptide} onChange={(e) => setInventoryForm((current) => ({ ...current, peptide: e.target.value }))} required />
            <input className="pb-field" placeholder="Vial strength" value={inventoryForm.strength} onChange={(e) => setInventoryForm((current) => ({ ...current, strength: e.target.value }))} required />
            <input className="pb-field" placeholder="Quantity" value={inventoryForm.quantity} onChange={(e) => setInventoryForm((current) => ({ ...current, quantity: e.target.value }))} required />
            <textarea className="pb-textarea" placeholder="Reconstitution notes" value={inventoryForm.notes} onChange={(e) => setInventoryForm((current) => ({ ...current, notes: e.target.value }))} />
            <input className="pb-field" type="date" value={inventoryForm.added} onChange={(e) => setInventoryForm((current) => ({ ...current, added: e.target.value }))} required />
            <button className="pb-button" type="submit">Add inventory item</button>
          </form>
          {inventory.map((item) => (
            <div key={item.id} className="pb-fact-row">
              <strong>{item.peptide}</strong><br />
              {item.strength} · {item.quantity} · {item.added}<br />
              <span className="pb-subtle">{item.notes}</span>
            </div>
          ))}
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
          {logs.map((entry) => (
            <div key={entry.id} className="pb-log-row">
              <strong>{entry.peptide}</strong><br />
              {entry.dose} · {entry.location} · {entry.date}<br />
              <span className="pb-subtle">{entry.notes}</span>
            </div>
          ))}
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
