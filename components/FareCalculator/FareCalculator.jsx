import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator } from "lucide-react";

/**
 * Reusable Outstation Fare Calculator
 *
 * Props:
 * - initialDistance, initialRate, initialNights, initialTolls, initialParking, initialDriverNight
 * - onEstimate: (estimate) => void // called with { base, dn, total, eff }
 * - showHeader: boolean // show small heading with icon
 * - className: string // outer wrapper
 * - cardClassName: string // classes applied to Card container
 * - contentClassName: string // classes applied to CardContent wrappers
 * - inputClassName: string // classes appended to each input
 * - labelClassName: string // classes applied to each label (overrides default color)
 * - headerTitleClassName: string // classes applied to the small header title
 * - leftSummaryClassName: string // classes for the left summary block
 * - totalLabelClassName: string // classes for the small labels in right summary
 * - totalValueClassName: string // classes for the large total value
 * - totalEffClassName: string // classes for the effective per km text
 */
export default function FareCalculator({
  initialDistance = 240,
  initialRate = 12,
  initialNights = 0,
  initialTolls = 400,
  initialParking = 0,
  initialDriverNight = 300,
  onEstimate,
  showHeader = false,
  className = "",
  cardClassName,
  contentClassName,
  inputClassName = "",
  labelClassName,
  headerTitleClassName,
  leftSummaryClassName,
  totalLabelClassName,
  totalValueClassName,
  totalEffClassName,
}) {
  const [distance, setDistance] = useState(Number(initialDistance));
  const [rate, setRate] = useState(Number(initialRate));
  const [nights, setNights] = useState(Number(initialNights));
  const [tolls, setTolls] = useState(Number(initialTolls));
  const [parking, setParking] = useState(Number(initialParking));
  const [driverNight, setDriverNight] = useState(Number(initialDriverNight));

  const estimate = useMemo(() => {
    const base = Number(distance || 0) * Number(rate || 0);
    const dn = Number(nights || 0) * Number(driverNight || 0);
    const total = base + dn + Number(tolls || 0) + Number(parking || 0);
    const eff = distance ? total / distance : 0;
    return { base, dn, total, eff };
  }, [distance, rate, nights, tolls, parking, driverNight]);

  useEffect(() => {
    if (typeof onEstimate === "function") onEstimate(estimate);
  }, [estimate, onEstimate]);

  const baseInput = "mt-1 w-full min-w-0 rounded-md border px-3 py-2 text-sm";
  const baseLabel = "text-xs font-medium text-slate-600";
  const baseLeftSummary = "text-sm text-slate-700";
  const baseTotalLabel = "text-xs text-slate-500";
  const baseTotalValue = "text-2xl font-semibold text-amber-800";
  const baseTotalEff = "text-xs text-slate-500";
  const baseHeaderTitle = "text-lg font-semibold tracking-tight";

  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-amber-700" />
          <h3 className={headerTitleClassName ?? baseHeaderTitle}>Outstation taxi fare calculator</h3>
        </div>
      )}
      <Card className={cardClassName ?? "border-2"}>
        <CardContent className={`grid grid-cols-2 gap-3 p-4 md:grid-cols-3 ${contentClassName ?? ""}`}>
          <div className="col-span-2 md:col-span-1">
            <label className={labelClassName ?? baseLabel}>Distance (km)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className={`${baseInput} ${inputClassName}`}
            />
          </div>
          <div>
            <label className={labelClassName ?? baseLabel}>Per‑km rate (₹)</label>
            <input
              type="number"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className={`${baseInput} ${inputClassName}`}
            />
          </div>
          <div>
            <label className={labelClassName ?? baseLabel}>Driver night charge (₹/night)</label>
            <input
              type="number"
              value={driverNight}
              onChange={(e) => setDriverNight(Number(e.target.value))}
              className={`${baseInput} ${inputClassName}`}
            />
          </div>
          <div>
            <label className={labelClassName ?? baseLabel}>Total Nights</label>
            <input
              type="number"
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
              className={`${baseInput} ${inputClassName}`}
            />
          </div>
          <div>
            <label className={labelClassName ?? baseLabel}>Tolls & state taxes (₹)</label>
            <input
              type="number"
              value={tolls}
              onChange={(e) => setTolls(Number(e.target.value))}
              className={`${baseInput} ${inputClassName}`}
            />
          </div>
          <div>
            <label className={labelClassName ?? baseLabel}>Parking (₹)</label>
            <input
              type="number"
              value={parking}
              onChange={(e) => setParking(Number(e.target.value))}
              className={`${baseInput} ${inputClassName}`}
            />
          </div>
        </CardContent>
        <Separator />
        <CardContent className={`flex flex-wrap items-center justify-between gap-3 p-4 ${contentClassName ?? ""}`}>
          <div className={leftSummaryClassName ?? baseLeftSummary}>
            <div>
              Base fare: <span className="font-semibold">₹{Math.round(estimate.base).toLocaleString("en-IN")}</span>
            </div>
            <div>
              Driver night: <span className="font-semibold">₹{Math.round(estimate.dn).toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={totalLabelClassName ?? baseTotalLabel}>Estimated total</div>
            <div className={totalValueClassName ?? baseTotalValue}>₹{Math.round(estimate.total).toLocaleString("en-IN")}</div>
            <div className={totalEffClassName ?? baseTotalEff}>≈ ₹{estimate.eff.toFixed(1)}/km effective</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
