"use client";

import { useMemo, useState } from "react";

function round(value) {
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
}

export function ReconstitutionCalculator({ defaultDose = 250 }) {
  const [vialAmountMg, setVialAmountMg] = useState(5);
  const [bacWaterMl, setBacWaterMl] = useState(2);
  const [desiredDose, setDesiredDose] = useState(defaultDose);
  const [doseUnit, setDoseUnit] = useState("mcg");

  const result = useMemo(() => {
    const totalMcg = vialAmountMg * 1000;
    const desiredMcg = doseUnit === "mg" ? desiredDose * 1000 : desiredDose;
    const concentration = bacWaterMl > 0 ? totalMcg / bacWaterMl : 0;
    const mlPerDose = concentration > 0 ? desiredMcg / concentration : 0;
    const insulinUnits = mlPerDose * 100;

    return {
      desiredAmount: doseUnit === "mg" ? `${round(desiredDose)} mg` : `${round(desiredDose)} mcg`,
      concentrationMcgPerMl: round(concentration),
      mlPerDose: round(mlPerDose),
      insulinUnits: round(insulinUnits)
    };
  }, [bacWaterMl, desiredDose, doseUnit, vialAmountMg]);

  return (
    <div className="pb-tool">
      <div className="pb-eyebrow">Calculator toolkit</div>
      <h3 className="pb-card-title">Peptide Reconstitution Calculator</h3>
      <p className="pb-form-help">
        Enter vial strength, BAC water volume, and a target dose to estimate concentration and insulin syringe units.
      </p>
      <div className="pb-inline-grid">
        <label>
          <div className="pb-subtle">Vial amount (mg)</div>
          <input className="pb-field" min="0" step="0.1" type="number" value={vialAmountMg} onChange={(e) => setVialAmountMg(Number(e.target.value))} />
        </label>
        <label>
          <div className="pb-subtle">BAC water added (ml)</div>
          <input className="pb-field" min="0" step="0.1" type="number" value={bacWaterMl} onChange={(e) => setBacWaterMl(Number(e.target.value))} />
        </label>
        <label>
          <div className="pb-subtle">Desired dose</div>
          <input className="pb-field" min="0" step="0.1" type="number" value={desiredDose} onChange={(e) => setDesiredDose(Number(e.target.value))} />
        </label>
        <label>
          <div className="pb-subtle">Unit</div>
          <select className="pb-select" value={doseUnit} onChange={(e) => setDoseUnit(e.target.value)}>
            <option value="mcg">mcg</option>
            <option value="mg">mg</option>
          </select>
        </label>
      </div>
      <div className="pb-link-list" style={{ marginTop: 16 }}>
        <div className="pb-fact-row"><strong>Dose:</strong> {result.desiredAmount}</div>
        <div className="pb-fact-row"><strong>Concentration:</strong> {result.concentrationMcgPerMl} mcg/ml</div>
        <div className="pb-fact-row"><strong>Volume per dose:</strong> {result.mlPerDose} ml</div>
        <div className="pb-fact-row"><strong>Insulin syringe units:</strong> {result.insulinUnits} units</div>
      </div>
    </div>
  );
}
