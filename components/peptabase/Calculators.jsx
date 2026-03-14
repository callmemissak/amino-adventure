"use client";

import { useMemo, useState } from "react";
import { glp1Options } from "@/lib/peptabase-data";

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

export function Glp1ConcentrationCalculator() {
  const [selected, setSelected] = useState(glp1Options[0].name);
  const defaults = glp1Options.find((option) => option.name === selected) || glp1Options[0];
  const [strengthMg, setStrengthMg] = useState(defaults.defaultStrengthMg);
  const [volumeMl, setVolumeMl] = useState(defaults.defaultVolumeMl);
  const [targetDoseMg, setTargetDoseMg] = useState(defaults.dosesMg[0]);

  const result = useMemo(() => {
    const concentration = volumeMl > 0 ? strengthMg / volumeMl : 0;
    const mlPerDose = concentration > 0 ? targetDoseMg / concentration : 0;
    return {
      concentrationMgPerMl: round(concentration),
      doseMl: round(mlPerDose),
      insulinUnits: round(mlPerDose * 100)
    };
  }, [strengthMg, targetDoseMg, volumeMl]);

  const handleSelection = (name) => {
    const option = glp1Options.find((entry) => entry.name === name) || glp1Options[0];
    setSelected(option.name);
    setStrengthMg(option.defaultStrengthMg);
    setVolumeMl(option.defaultVolumeMl);
    setTargetDoseMg(option.dosesMg[0]);
  };

  return (
    <div className="pb-tool">
      <div className="pb-eyebrow">GLP-1 tools</div>
      <h3 className="pb-card-title">GLP-1 Concentration Calculator</h3>
      <p className="pb-form-help">
        Supports Semaglutide, Tirzepatide, Retatrutide, and Cagrilintide style workflows.
      </p>
      <div className="pb-inline-grid">
        <label>
          <div className="pb-subtle">Compound</div>
          <select className="pb-select" value={selected} onChange={(e) => handleSelection(e.target.value)}>
            {glp1Options.map((option) => (
              <option key={option.name} value={option.name}>{option.name}</option>
            ))}
          </select>
        </label>
        <label>
          <div className="pb-subtle">Vial strength (mg)</div>
          <input className="pb-field" min="0" step="0.1" type="number" value={strengthMg} onChange={(e) => setStrengthMg(Number(e.target.value))} />
        </label>
        <label>
          <div className="pb-subtle">Dilution volume (ml)</div>
          <input className="pb-field" min="0" step="0.1" type="number" value={volumeMl} onChange={(e) => setVolumeMl(Number(e.target.value))} />
        </label>
        <label>
          <div className="pb-subtle">Desired dose (mg)</div>
          <input className="pb-field" min="0" step="0.1" type="number" value={targetDoseMg} onChange={(e) => setTargetDoseMg(Number(e.target.value))} />
        </label>
      </div>
      <div className="pb-link-list" style={{ marginTop: 16 }}>
        <div className="pb-fact-row"><strong>Concentration:</strong> {result.concentrationMgPerMl} mg/ml</div>
        <div className="pb-fact-row"><strong>Volume per dose:</strong> {result.doseMl} ml</div>
        <div className="pb-fact-row"><strong>Insulin syringe units:</strong> {result.insulinUnits} units</div>
      </div>
    </div>
  );
}
