"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UserDashboard({ session }) {
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventory, setInventory] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [injectionLog, setInjectionLog] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    peptide_name: "",
    vial_size: "",
    unit: "mg",
    quantity: "",
    coa_number: "",
    purchase_date: "",
    dose: "",
    frequency: "",
    start_date: "",
    end_date: "",
    injection_location: "",
    timestamp: new Date().toISOString().split("T")[0],
    location: "",
    notes: "",
  });

  if (!session) {
    return <p style={{ color: "#e2ddd5" }}>Please log in to access your dashboard.</p>;
  }

  const userId = session.user.id;

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, protRes, logRes] = await Promise.all([
        supabase
          .from("inventory")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("protocols")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("injection_log")
          .select("*")
          .eq("user_id", userId)
          .order("timestamp", { ascending: false }),
      ]);

      if (invRes.error) throw invRes.error;
      if (protRes.error) throw protRes.error;
      if (logRes.error) throw logRes.error;

      setInventory(invRes.data || []);
      setProtocols(protRes.data || []);
      setInjectionLog(logRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("inventory").insert([
        {
          user_id: userId,
          peptide_name: formData.peptide_name,
          vial_size: parseFloat(formData.vial_size),
          unit: formData.unit,
          quantity: parseInt(formData.quantity),
          coa_number: formData.coa_number,
          purchase_date: formData.purchase_date,
        },
      ]);

      if (error) throw error;

      setFormData({
        ...formData,
        peptide_name: "",
        vial_size: "",
        quantity: "",
        coa_number: "",
        purchase_date: "",
      });

      fetchData();
    } catch (error) {
      console.error("Error adding inventory:", error);
    }
  };

  const handleAddProtocol = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("protocols").insert([
        {
          user_id: userId,
          peptide_name: formData.peptide_name,
          dose: parseFloat(formData.dose),
          unit: formData.unit,
          frequency: formData.frequency,
          start_date: formData.start_date,
          end_date: formData.end_date,
          injection_location: formData.injection_location,
        },
      ]);

      if (error) throw error;

      setFormData({
        ...formData,
        peptide_name: "",
        dose: "",
        frequency: "",
        start_date: "",
        end_date: "",
        injection_location: "",
      });

      fetchData();
    } catch (error) {
      console.error("Error adding protocol:", error);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("injection_log").insert([
        {
          user_id: userId,
          peptide_name: formData.peptide_name,
          dose: parseFloat(formData.dose),
          unit: formData.unit,
          timestamp: `${formData.timestamp}T00:00:00Z`,
          location: formData.location,
          notes: formData.notes,
        },
      ]);

      if (error) throw error;

      setFormData({
        ...formData,
        peptide_name: "",
        dose: "",
        timestamp: new Date().toISOString().split("T")[0],
        location: "",
        notes: "",
      });

      fetchData();
    } catch (error) {
      console.error("Error adding log entry:", error);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "12px",
    background: "#0a0a10",
    border: "1px solid #34d399",
    color: "#e2ddd5",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "14px",
  };

  const buttonStyle = {
    padding: "10px 16px",
    background: "#34d399",
    color: "#08080f",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const tabButtonStyle = (isActive) => ({
    padding: "10px 16px",
    background: isActive ? "#34d399" : "#1a1a2e",
    color: isActive ? "#08080f" : "#e2ddd5",
    border: "1px solid #34d399",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: isActive ? "bold" : "normal",
    marginRight: "8px",
  });

  return (
    <div style={{ padding: "16px", color: "#e2ddd5" }}>
      <h2 style={{ marginBottom: "20px" }}>My Peptide Tracker</h2>

      {/* Tabs */}
      <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveTab("inventory")}
          style={tabButtonStyle(activeTab === "inventory")}
        >
          📦 Inventory
        </button>
        <button
          onClick={() => setActiveTab("protocols")}
          style={tabButtonStyle(activeTab === "protocols")}
        >
          📋 Protocols
        </button>
        <button
          onClick={() => setActiveTab("log")}
          style={tabButtonStyle(activeTab === "log")}
        >
          📝 Injection Log
        </button>
      </div>

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <div>
          <h3>Track Your Vials</h3>
          <form onSubmit={handleAddInventory} style={{ marginBottom: "20px" }}>
            <input
              type="text"
              name="peptide_name"
              placeholder="Peptide Name (e.g., BPC-157)"
              value={formData.peptide_name}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="number"
                name="vial_size"
                placeholder="Vial Size"
                value={formData.vial_size}
                onChange={handleInputChange}
                required
                style={{ ...inputStyle, flex: 1 }}
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                style={{ ...inputStyle, flex: 0.5 }}
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
              </select>
            </div>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="coa_number"
              placeholder="COA Number (optional)"
              value={formData.coa_number}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Add to Inventory
            </button>
          </form>

          {/* Inventory List */}
          <div style={{ marginTop: "20px" }}>
            {inventory.length === 0 ? (
              <p>No inventory items yet.</p>
            ) : (
              inventory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "12px",
                    background: "#1a1a2e",
                    border: "1px solid #34d399",
                    borderRadius: "4px",
                    marginBottom: "12px",
                  }}
                >
                  <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                    {item.peptide_name}
                  </p>
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px" }}>
                    Vial: {item.vial_size} {item.unit} | Qty: {item.quantity}
                  </p>
                  <p style={{ margin: "0", fontSize: "12px", color: "#aaa" }}>
                    COA: {item.coa_number || "N/A"} | Purchased: {item.purchase_date}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Protocols Tab */}
      {activeTab === "protocols" && (
        <div>
          <h3>Save Your Protocols</h3>
          <form onSubmit={handleAddProtocol} style={{ marginBottom: "20px" }}>
            <input
              type="text"
              name="peptide_name"
              placeholder="Peptide Name"
              value={formData.peptide_name}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="number"
                name="dose"
                placeholder="Dose"
                value={formData.dose}
                onChange={handleInputChange}
                required
                style={{ ...inputStyle, flex: 1 }}
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                style={{ ...inputStyle, flex: 0.5 }}
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
              </select>
            </div>
            <input
              type="text"
              name="frequency"
              placeholder="Frequency (e.g., 2x daily)"
              value={formData.frequency}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="injection_location"
              placeholder="Injection Location (e.g., abdomen)"
              value={formData.injection_location}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Save Protocol
            </button>
          </form>

          {/* Protocols List */}
          <div style={{ marginTop: "20px" }}>
            {protocols.length === 0 ? (
              <p>No protocols saved yet.</p>
            ) : (
              protocols.map((protocol) => (
                <div
                  key={protocol.id}
                  style={{
                    padding: "12px",
                    background: "#1a1a2e",
                    border: "1px solid #34d399",
                    borderRadius: "4px",
                    marginBottom: "12px",
                  }}
                >
                  <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                    {protocol.peptide_name}
                  </p>
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px" }}>
                    {protocol.dose} {protocol.unit} • {protocol.frequency}
                  </p>
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px" }}>
                    {protocol.start_date} → {protocol.end_date}
                  </p>
                  <p style={{ margin: "0", fontSize: "12px", color: "#aaa" }}>
                    Location: {protocol.injection_location || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Injection Log Tab */}
      {activeTab === "log" && (
        <div>
          <h3>Log Injections + Notes</h3>
          <form onSubmit={handleAddLog} style={{ marginBottom: "20px" }}>
            <input
              type="text"
              name="peptide_name"
              placeholder="Peptide Name"
              value={formData.peptide_name}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="number"
                name="dose"
                placeholder="Dose"
                value={formData.dose}
                onChange={handleInputChange}
                required
                style={{ ...inputStyle, flex: 1 }}
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                style={{ ...inputStyle, flex: 0.5 }}
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
              </select>
            </div>
            <input
              type="date"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="location"
              placeholder="Injection Location (e.g., abdomen)"
              value={formData.location}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <textarea
              name="notes"
              placeholder="Summary Notes (e.g., effects, side effects)"
              value={formData.notes}
              onChange={handleInputChange}
              style={{
                ...inputStyle,
                minHeight: "80px",
                resize: "vertical",
              }}
            />
            <button type="submit" style={buttonStyle}>
              Log Injection
            </button>
          </form>

          {/* Log Entries */}
          <div style={{ marginTop: "20px" }}>
            {injectionLog.length === 0 ? (
              <p>No injections logged yet.</p>
            ) : (
              injectionLog.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    padding: "12px",
                    background: "#1a1a2e",
                    border: "1px solid #34d399",
                    borderRadius: "4px",
                    marginBottom: "12px",
                  }}
                >
                  <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                    {entry.peptide_name}
                  </p>
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px" }}>
                    {entry.dose} {entry.unit} • {entry.timestamp.split("T")[0]} •{" "}
                    {entry.location}
                  </p>
                  {entry.notes && (
                    <p style={{ margin: "0", fontSize: "12px", color: "#bbb" }}>
                      Notes: {entry.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
