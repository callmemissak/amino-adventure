"use client";

import { useMemo, useState } from "react";
import { glp1Options } from "@/lib/peptabase-data";

function round(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
}

type ReconstitutionProps = {
  defaultDose?: number;
};

export function ReconstitutionCalculator({ defaultDose = 250 }: ReconstitutionProps) {
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
        Enter vial strength, BAC water volume, and a target dose to estimate reconstitution concentration, volume per dose, and insulin syringe units.
      </p>
      <div className="pb-inline-grid">
        <label>
          <div className="pb-subtle">Vial amount (mg)</div>
          <input className="pb-field" min="0" step="0.1" type="number" value={vialAmountMg} onChange={(event) => setVialAmountMg(Number(event.target.value))} />
        </label>
        <label>
          <div className="pb-subtle">BAC water added (ml)</div>
          <input className="pb-field" min="0" step="0.1" type="number" value={bacWaterMl} onChange={(event) => setBacWaterMl(Number(event.target.value))} />
        </label>
        <label>
          <div className="pb-subtle">Desired dose</div>
          <input className="pb-field" min="0" step="0.1" type="number" value={desiredDose} onChange={(event) => setDesiredDose(Number(event.target.value))} />
        </label>
        <label>
          <div className="pb-subtle">Unit</div>
          <select className="pb-select" value={doseUnit} onChange={(event) => setDoseUnit(event.target.value)}>
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

export function Glp1DoseCalculator() {
  const [selectedName, setSelectedName] = useState(glp1Options[0]?.name ?? "Semaglutide");
  const [weeklyDose, setWeeklyDose] = useState(glp1Options[0]?.dosesMg?.[0] ?? 0.25);
  const [weeks, setWeeks] = useState(8);

  const selected = useMemo(
    () => glp1Options.find((option) => option.name === selectedName) ?? glp1Options[0],
    [selectedName]
  );

  const totalDose = useMemo(() => round(weeklyDose * weeks), [weeklyDose, weeks]);
  const estimatedVials = useMemo(
    () => round(selected.defaultStrengthMg > 0 ? totalDose / selected.defaultStrengthMg : 0),
    [selected.defaultStrengthMg, totalDose]
  );

  return (
    <div className="pb-tool">
      <div className="pb-eyebrow">Calculator toolkit</div>
      <h3 className="pb-card-title">GLP-1 Dose Planner</h3>
      <p className="pb-form-help">
        Estimate total planned weekly research material over a cycle. This is a planning tool for research inventory and does not model blood levels, half-life, or medical use.
      </p>
      <div className="pb-inline-grid">
        <label>
          <div className="pb-subtle">Peptide</div>
          <select className="pb-select" value={selected.name} onChange={(event) => setSelectedName(event.target.value)}>
            {glp1Options.map((option) => (
              <option key={option.name} value={option.name}>{option.name}</option>
            ))}
          </select>
        </label>
        <label>
          <div className="pb-subtle">Weekly dose (mg)</div>
          <select className="pb-select" value={weeklyDose} onChange={(event) => setWeeklyDose(Number(event.target.value))}>
            {selected.dosesMg.map((dose) => (
              <option key={dose} value={dose}>{dose} mg</option>
            ))}
          </select>
        </label>
        <label>
          <div className="pb-subtle">Cycle length (weeks)</div>
          <input className="pb-field" min="1" max="52" step="1" type="number" value={weeks} onChange={(event) => setWeeks(Number(event.target.value))} />
        </label>
      </div>
      <div className="pb-link-list" style={{ marginTop: 16 }}>
        <div className="pb-fact-row"><strong>Total planned dose:</strong> {totalDose} mg</div>
        <div className="pb-fact-row"><strong>Reference vial strength:</strong> {selected.defaultStrengthMg} mg</div>
        <div className="pb-fact-row"><strong>Approximate vials needed:</strong> {estimatedVials}</div>
      </div>
    </div>
  );
}
