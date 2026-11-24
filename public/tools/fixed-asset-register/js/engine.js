/**
 * cajob.in - Fixed Asset Register & Statutory Depreciation Engine
 * Companies Act, 2013 (Schedule II) & Income Tax Act, 1961 (Section 32, 43(6), 50)
 * Architect: CA Ashish Tripathi
 * Brand: cajob.in
 */

const FA_ENGINE = (() => {
  "use strict";

  function getStatutory() {
    if (typeof STATUTORY_DATA !== "undefined") return STATUTORY_DATA;
    if (typeof require !== "undefined") {
      try { return require("./statutory_data.js"); } catch(e) {}
    }
    return { TAX_BLOCKS: {}, SCHEDULE_II_CLASSES: {} };
  }

  // --- Date Utilities ---
  function parseDate(val) {
    if (!val) return null;
    if (val instanceof Date) {
      return isNaN(val.getTime()) ? null : val;
    }
    if (typeof val === "number") {
      // Excel serial date number
      // 25569 = days between 1900-01-01 and 1970-01-01 (Excel leap year bug included)
      const utc_days = Math.floor(val - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);
      return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
    }
    const str = String(val).trim();
    if (!str) return null;

    // ISO format: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const parts = str.split("T")[0].split("-");
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    // DD-MM-YYYY or DD/MM/YYYY
    if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/.test(str)) {
      const parts = str.split(/[-\/]/);
      return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function formatDateISO(d) {
    const dt = parseDate(d);
    if (!dt) return "";
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function formatDateDisplay(d) {
    const dt = parseDate(d);
    if (!dt) return "—";
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${day}-${m}-${y}`;
  }

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  function daysInFY(fyStartYear) {
    // In India FY starts April 1 of fyStartYear and ends March 31 of fyStartYear + 1
    // February falls in fyStartYear + 1
    return isLeapYear(fyStartYear + 1) ? 366 : 365;
  }

  function daysInclusive(startDate, endDate) {
    const s = parseDate(startDate);
    const e = parseDate(endDate);
    if (!s || !e || e < s) return 0;
    const diffTime = e.getTime() - s.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  function formatINR(val, decimals = 2) {
    const num = Number(val);
    if (isNaN(num)) return "₹ 0.00";
    const isNegative = num < 0;
    const absVal = Math.abs(num);
    const parts = absVal.toFixed(decimals).split(".");
    let intPart = parts[0];
    const decPart = parts.length > 1 ? "." + parts[1] : "";

    // Indian numbering formatting (last 3, then groups of 2)
    if (intPart.length > 3) {
      const last3 = intPart.substring(intPart.length - 3);
      const rest = intPart.substring(0, intPart.length - 3);
      intPart = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
    }
    return (isNegative ? "-₹ " : "₹ ") + intPart + decPart;
  }

  function formatNumber(val, decimals = 2) {
    const num = Number(val);
    if (isNaN(num)) return "0.00";
    return num.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  // --- Derived Statutory Rates & Multipliers ---
  function deriveWDVRate(usefulLifeYears, residualPct = 5) {
    const n = Number(usefulLifeYears);
    const r = Number(residualPct) / 100.0;
    if (n <= 0) return 0;
    if (r <= 0 || r >= 1) return 0;
    // Statutory formula: R = [1 - (s/c)^(1/n)] * 100
    return (1 - Math.pow(r, 1 / n)) * 100;
  }

  function getShiftMultiplier(shiftType) {
    const s = String(shiftType || "").toLowerCase();
    if (s.includes("triple") || s === "3") return 2.0; // 100% extra
    if (s.includes("double") || s === "2") return 1.5; // 50% extra
    return 1.0; // Single shift
  }

  // --- Companies Act (Schedule II) Depreciation Engine ---
  /**
   * Calculates asset-level Book Depreciation for a given period [periodStart, periodEnd]
   */
  function calculateAssetBookDepreciation(asset, transactions, periodStart, periodEnd) {
    const pStart = parseDate(periodStart);
    const pEnd = parseDate(periodEnd);
    const purchaseDate = parseDate(asset.purchase_date);
    
    // As per AS 10 / Ind AS 16: depreciation begins from "ready for use" date
    const readyDate = parseDate(asset.ready_to_use_date) || parseDate(asset.put_to_use_date) || purchaseDate;
    const putToUseDate = parseDate(asset.put_to_use_date);
    const openingBalDate = parseDate(asset.opening_balance_date);

    const cost = Number(asset.acquisition_cost) || 0;
    const openingAccum = Number(asset.opening_accum_dep) || 0;
    const residualPct = Number(asset.residual_value_pct ?? 5);
    const residualValue = cost * (residualPct / 100.0);
    const method = (asset.book_method || "SLM").toUpperCase();
    const lifeYears = Number(asset.useful_life_years) || 0;
    const shiftMultiplier = getShiftMultiplier(asset.shift_type);

    const fyStartYear = pStart.getMonth() >= 3 ? pStart.getFullYear() : pStart.getFullYear() - 1;
    const totalFYDays = daysInFY(fyStartYear);

    // Filter non-voided transactions
    const validTxns = (transactions || []).filter(t => !t.voided_at && String(t.asset_code) === String(asset.asset_code));

    // Check for exit transaction (Disposal, Scrap, Write-Off)
    const exitTxn = validTxns.find(t => 
      ["Disposal / Sale", "Scrap", "Write-Off"].includes(t.txn_type) &&
      parseDate(t.txn_date) <= pEnd
    );
    const exitDate = exitTxn ? parseDate(exitTxn.txn_date) : null;
    const proceeds = exitTxn ? (Number(exitTxn.proceeds) || 0) : 0;
    const transferExp = exitTxn ? (Number(exitTxn.transfer_expenses) || 0) : 0;

    // Check if asset purchased after selected period
    if (purchaseDate > pEnd) {
      return { skip: true, reason: "Purchased after period end" };
    }
    // Check if asset exited before selected period
    if (exitDate && exitDate < pStart) {
      return { skip: true, reason: "Exited before period start" };
    }

    // Capital Work-In-Progress check
    const isCWIP = asset.status === "CWIP" || (!readyDate && !putToUseDate) || (readyDate && readyDate > pEnd);

    // Subsequent Cost Additions up to pEnd
    const additionsList = validTxns.filter(t => 
      t.txn_type === "Cost Addition" && parseDate(t.txn_date) <= pEnd
    );

    // 1. Determine Opening Carrying Value (Opening WDV) as on pStart
    let openingGross = 0;
    let additionsInPeriod = 0;
    let openingWDV = 0;

    if (purchaseDate < pStart) {
      openingGross = cost;
      if (openingBalDate && purchaseDate <= openingBalDate) {
        openingWDV = Math.max(0, cost - openingAccum);
      } else if (openingAccum > 0) {
        openingWDV = Math.max(0, cost - openingAccum);
      } else {
        // Compute accrued depreciation prior to pStart
        if (!isCWIP && readyDate < pStart && lifeYears > 0) {
          const priorDays = daysInclusive(readyDate, new Date(pStart.getTime() - 86400000));
          if (method === "SLM") {
            const annualDepr = ((cost - residualValue) / lifeYears) * shiftMultiplier;
            const priorDepr = Math.min(cost - residualValue, (annualDepr / totalFYDays) * priorDays);
            openingWDV = Math.max(residualValue, cost - priorDepr);
          } else {
            const wdvRate = deriveWDVRate(lifeYears, residualPct) * shiftMultiplier;
            const yearsFraction = priorDays / totalFYDays;
            openingWDV = Math.max(residualValue, cost * Math.pow(1 - (wdvRate / 100), yearsFraction));
          }
        } else {
          openingWDV = isCWIP ? cost : cost;
        }
      }
    } else {
      // Purchased inside current period
      additionsInPeriod = cost;
      openingWDV = 0;
    }

    // Process Cost Additions
    additionsList.forEach(t => {
      const tDate = parseDate(t.txn_date);
      const amt = Number(t.amount) || 0;
      if (tDate < pStart) {
        openingGross += amt;
        openingWDV += amt; // Simplified: opening carrying brought forward
      } else {
        additionsInPeriod += amt;
      }
    });

    const openingAccumDep = Math.max(0, openingGross - openingWDV);

    // 2. Calculate Current Period Depreciation
    let currentDep = 0;
    const depEndDate = exitDate ? new Date(Math.min(exitDate.getTime(), pEnd.getTime())) : pEnd;

    if (!isCWIP && lifeYears > 0) {
      // Base asset depreciation in current period
      const depStartDate = purchaseDate < pStart ? pStart : (readyDate > pStart ? readyDate : pStart);
      if (depStartDate <= depEndDate) {
        const activeDays = daysInclusive(depStartDate, depEndDate);
        if (method === "SLM") {
          const annualDepr = ((cost - residualValue) / lifeYears) * shiftMultiplier;
          let dep = (annualDepr / totalFYDays) * activeDays;
          // Ensure carrying doesn't drop below residual value
          const maxAllowed = Math.max(0, (purchaseDate < pStart ? openingWDV : cost) - residualValue);
          currentDep += Math.min(dep, maxAllowed);
        } else {
          // WDV method
          const wdvRate = deriveWDVRate(lifeYears, residualPct) * shiftMultiplier;
          const baseForDep = purchaseDate < pStart ? openingWDV : cost;
          let dep = baseForDep * (wdvRate / 100) * (activeDays / totalFYDays);
          const maxAllowed = Math.max(0, baseForDep - residualValue);
          currentDep += Math.min(dep, maxAllowed);
        }
      }

      // Additions depreciation in current period
      additionsList.forEach(t => {
        const tDate = parseDate(t.txn_date);
        if (tDate >= pStart && tDate <= depEndDate) {
          const amt = Number(t.amount) || 0;
          const addDays = daysInclusive(tDate, depEndDate);
          if (method === "SLM") {
            const annualDepr = ((amt * (1 - residualPct / 100)) / lifeYears) * shiftMultiplier;
            currentDep += Math.min(amt * (1 - residualPct / 100), (annualDepr / totalFYDays) * addDays);
          } else {
            const wdvRate = deriveWDVRate(lifeYears, residualPct) * shiftMultiplier;
            currentDep += amt * (wdvRate / 100) * (addDays / totalFYDays);
          }
        }
      });
    }

    currentDep = Math.max(0, currentDep);

    // 3. Handle Disposals / Exits vs Closing Balances
    let closingGross = 0;
    let closingAccum = 0;
    let closingWDV = 0;
    let disposalGross = 0;
    let disposalWDV = 0;
    let gainLoss = 0;
    let wdvAtExit = 0;

    const exitedInPeriod = exitDate && exitDate >= pStart && exitDate <= pEnd;

    if (exitedInPeriod) {
      disposalGross = openingGross + additionsInPeriod;
      wdvAtExit = Math.max(0, openingWDV + additionsInPeriod - currentDep);
      disposalWDV = wdvAtExit;
      // Book Profit or Loss = Net Sale Proceeds - Net Book Value at exit
      const netProceeds = proceeds - transferExp;
      gainLoss = netProceeds - wdvAtExit;
      closingGross = 0;
      closingAccum = 0;
      closingWDV = 0;
    } else {
      closingGross = openingGross + additionsInPeriod;
      closingWDV = Math.max(0, openingWDV + additionsInPeriod - currentDep);
      closingAccum = Math.max(0, closingGross - closingWDV);
    }

    // Determine Status
    let displayStatus = asset.status;
    if (isCWIP) {
      displayStatus = "CWIP";
    } else if (exitedInPeriod) {
      displayStatus = exitTxn ? exitTxn.txn_type : "Disposed";
    } else if (exitDate && exitDate > pEnd) {
      displayStatus = "Active"; // Active during this historical period
    }

    // Review / Exception checks
    const exceptions = [];
    if (!asset.tax_block_code && !isCWIP) {
      exceptions.push("Income-tax block not assigned");
    }
    if (readyDate && readyDate < purchaseDate) {
      exceptions.push("Ready to use date is before purchase date");
    }
    if (putToUseDate && putToUseDate < purchaseDate) {
      exceptions.push("Put to use date is before purchase date");
    }
    if (!isCWIP && lifeYears <= 0) {
      exceptions.push("Useful life missing or zero");
    }
    if (openingAccum > cost) {
      exceptions.push("Opening accumulated depreciation exceeds asset cost");
    }

    return {
      skip: false,
      asset_code: asset.asset_code,
      asset_tag: asset.asset_tag || "—",
      asset_name: asset.asset_name,
      category: asset.category,
      sub_category: asset.sub_category || "—",
      schedule_class: asset.schedule_class || "—",
      location: asset.location || "—",
      department: asset.department || "—",
      cost_centre: asset.cost_centre || "—",
      custodian: asset.custodian || "—",
      purchase_date: formatDateDisplay(purchaseDate),
      ready_to_use_date: formatDateDisplay(readyDate),
      put_to_use_date: formatDateDisplay(putToUseDate),
      method: method,
      useful_life_years: lifeYears,
      residual_value_pct: residualPct,
      residual_value: residualValue,
      wdv_rate: method === "WDV" ? deriveWDVRate(lifeYears, residualPct) : null,
      shift_type: asset.shift_type || "Single",
      shift_multiplier: shiftMultiplier,
      opening_gross: openingGross,
      opening_accum_dep: openingAccumDep,
      opening_wdv: openingWDV,
      additions: additionsInPeriod,
      current_dep: currentDep,
      disposal_gross: disposalGross,
      disposal_wdv: disposalWDV,
      closing_gross: closingGross,
      closing_accum_dep: closingAccum,
      closing_wdv: closingWDV,
      exit_date: exitDate ? formatDateDisplay(exitDate) : null,
      proceeds: proceeds,
      transfer_expenses: transferExp,
      wdv_at_exit: wdvAtExit,
      gain_loss: gainLoss,
      status: displayStatus,
      is_cwip: isCWIP,
      exceptions: exceptions.join("; ")
    };
  }

  /**
   * Generates full Companies Act Schedule II Depreciation Report for a company & period
   */
  function generateBookSchedule(company, assets, transactions, periodStart, periodEnd) {
    const pStart = parseDate(periodStart);
    const pEnd = parseDate(periodEnd);

    const rows = [];
    const totals = {
      opening_gross: 0,
      opening_accum_dep: 0,
      opening_wdv: 0,
      additions: 0,
      disposal_gross: 0,
      disposal_wdv: 0,
      current_dep: 0,
      closing_gross: 0,
      closing_accum_dep: 0,
      closing_wdv: 0,
      cwip_value: 0,
      gain_loss: 0
    };

    (assets || []).forEach(asset => {
      const res = calculateAssetBookDepreciation(asset, transactions, pStart, pEnd);
      if (!res.skip) {
        rows.push(res);
        if (res.is_cwip) {
          totals.cwip_value += res.closing_gross || res.opening_gross;
        } else {
          totals.opening_gross += res.opening_gross;
          totals.opening_accum_dep += res.opening_accum_dep;
          totals.opening_wdv += res.opening_wdv;
          totals.additions += res.additions;
          totals.disposal_gross += res.disposal_gross;
          totals.disposal_wdv += res.disposal_wdv;
          totals.current_dep += res.current_dep;
          totals.closing_gross += res.closing_gross;
          totals.closing_accum_dep += res.closing_accum_dep;
          totals.closing_wdv += res.closing_wdv;
          totals.gain_loss += res.gain_loss;
        }
      }
    });

    return { rows, totals, periodStart: pStart, periodEnd: pEnd };
  }

  // --- Income Tax Act, 1961 (Section 32, 43(6), 50) Engine ---
  /**
   * Generates Income-tax Block Depreciation Schedule
   */
  function generateTaxSchedule(company, assets, transactions, periodStart, periodEnd, taxOpenings = {}, includeAdditional = true) {
    const pStart = parseDate(periodStart);
    const pEnd = parseDate(periodEnd);

    const isMfgOrPower = [
      "Manufacturing",
      "Power Generation / Transmission / Distribution",
      "Pharmaceuticals / Chemicals"
    ].includes(company.sector);

    // Group assets into tax blocks
    const blocksMap = {};
    const statutory = getStatutory();

    // Initialise blocks
    Object.keys(statutory.TAX_BLOCKS || {}).forEach(code => {
      const def = statutory.TAX_BLOCKS[code];
      const manualOpening = taxOpenings && taxOpenings[code] !== undefined && taxOpenings[code] !== "" ? Number(taxOpenings[code]) : null;
      blocksMap[code] = {
        code: code,
        label: def.label,
        rate: def.rate,
        opening_wdv: manualOpening !== null ? manualOpening : 0,
        manual_opening_set: manualOpening !== null,
        opening_source: manualOpening !== null ? "Manual Tax Opening" : "Auto Calculated from Assets",
        auto_opening_wdv: 0,
        additions_180_plus: 0,
        additions_less_180: 0,
        sale_proceeds: 0,
        transfer_expenses: 0,
        additional_dep: 0,
        assets_remaining: 0,
        total_assets: 0,
        active_assets: 0,
        notes: []
      };
    });

    // Bucket assets and transactions into blocks
    (assets || []).forEach(asset => {
      const code = asset.tax_block_code || "UNASSIGNED";
      if (!blocksMap[code]) {
        const manualOpening = taxOpenings && taxOpenings[code] !== undefined && taxOpenings[code] !== "" ? Number(taxOpenings[code]) : null;
        blocksMap[code] = {
          code: code,
          label: code === "UNASSIGNED" ? "⚠️ Unassigned Tax Category" : code,
          rate: Number(asset.tax_custom_rate) || 0,
          opening_wdv: manualOpening !== null ? manualOpening : 0,
          manual_opening_set: manualOpening !== null,
          opening_source: manualOpening !== null ? "Manual Tax Opening" : "Auto Calculated from Assets",
          auto_opening_wdv: 0,
          additions_180_plus: 0,
          additions_less_180: 0,
          sale_proceeds: 0,
          transfer_expenses: 0,
          additional_dep: 0,
          assets_remaining: 0,
          total_assets: 0,
          active_assets: 0,
          notes: []
        };
      }

      const b = blocksMap[code];
      b.total_assets++;

      const purchaseDate = parseDate(asset.purchase_date);
      const putToUseDate = parseDate(asset.put_to_use_date);
      const taxCost = Number(asset.tax_actual_cost) || Number(asset.acquisition_cost) || 0;
      const rate = Number(b.rate) || 0;

      // Filter transactions for this asset
      const assetTxns = (transactions || []).filter(t => !t.voided_at && String(t.asset_code) === String(asset.asset_code));
      const exitTxn = assetTxns.find(t => 
        ["Disposal / Sale", "Scrap", "Write-Off"].includes(t.txn_type) &&
        parseDate(t.txn_date) <= pEnd
      );
      const exitDate = exitTxn ? parseDate(exitTxn.txn_date) : null;

      const isCurrentActive = asset.status !== "CWIP" && (!exitDate || exitDate > pEnd);
      if (isCurrentActive) {
        b.assets_remaining++;
        b.active_assets++;
      }

      // Pre-year assets: Calculate brought-forward opening tax WDV if not manually overridden
      if (purchaseDate && purchaseDate < pStart && asset.status !== "CWIP") {
        let estimatedAssetOpeningWDV = 0;
        const openingAccum = Number(asset.opening_accum_dep) || 0;
        if (openingAccum > 0 && asset.opening_balance_date) {
          estimatedAssetOpeningWDV = Math.max(0, taxCost - openingAccum);
        } else if (putToUseDate && putToUseDate < pStart && rate > 0) {
          // Estimate elapsed years of tax depreciation
          const ptuYear = putToUseDate.getMonth() >= 3 ? putToUseDate.getFullYear() : putToUseDate.getFullYear() - 1;
          const fyStartYear = pStart.getMonth() >= 3 ? pStart.getFullYear() : pStart.getFullYear() - 1;
          const elapsedYears = Math.max(1, fyStartYear - ptuYear);
          estimatedAssetOpeningWDV = taxCost * Math.pow(1 - (rate / 100), elapsedYears);
        } else {
          estimatedAssetOpeningWDV = taxCost;
        }
        b.auto_opening_wdv += estimatedAssetOpeningWDV;
      }

      // Current Year Additions under Income Tax Section 32
      if (purchaseDate >= pStart && purchaseDate <= pEnd) {
        if (putToUseDate && putToUseDate <= pEnd) {
          // Put to use days in FY
          const usedDays = daysInclusive(Math.max(putToUseDate.getTime(), purchaseDate.getTime()), pEnd);
          if (usedDays >= 180) {
            b.additions_180_plus += taxCost;
          } else {
            b.additions_less_180 += taxCost;
          }

          // Additional Depreciation u/s 32(1)(iia)
          if (includeAdditional && asset.additional_dep_eligible) {
            if (!isMfgOrPower) {
              b.notes.push(`Asset ${asset.asset_code}: Review additional dep eligibility for sector "${company.sector}"`);
            } else {
              // 20% if >= 180 days, 10% if < 180 days
              const addRate = usedDays >= 180 ? 0.20 : 0.10;
              b.additional_dep += taxCost * addRate;
              if (usedDays < 180) {
                b.notes.push(`Asset ${asset.asset_code}: 10% additional dep allowed; balance 10% eligible in next FY under Section 32(1)(ii) second proviso`);
              }
            }
          }
        } else {
          b.notes.push(`Asset ${asset.asset_code}: Acquired in FY but not put to use by year end (No tax depreciation)`);
        }
      }

      // Subsequent Capital Additions in FY
      assetTxns.forEach(t => {
        const tDate = parseDate(t.txn_date);
        if (t.txn_type === "Cost Addition" && tDate >= pStart && tDate <= pEnd) {
          const addCost = Number(t.tax_amount ?? t.amount) || 0;
          const usedDays = daysInclusive(Math.max(tDate.getTime(), (putToUseDate || tDate).getTime()), pEnd);
          if (usedDays >= 180) {
            b.additions_180_plus += addCost;
          } else {
            b.additions_less_180 += addCost;
          }
        }

        // Disposal / Scrap proceeds in FY
        if (["Disposal / Sale", "Scrap", "Write-Off"].includes(t.txn_type) && tDate >= pStart && tDate <= pEnd) {
          b.sale_proceeds += Number(t.proceeds) || 0;
          b.transfer_expenses += Number(t.transfer_expenses) || 0;
        }
      });
    });

    // Compute final block depreciation, Section 50 Capital Gains, and Closing WDV
    const scheduleRows = [];
    const totals = {
      opening_wdv: 0,
      additions_180_plus: 0,
      additions_less_180: 0,
      sale_proceeds: 0,
      normal_dep: 0,
      additional_dep: 0,
      closing_wdv: 0,
      capital_gains: 0
    };

    Object.values(blocksMap).forEach(b => {
      // Auto-set opening from pre-year assets if no explicit manual opening was provided
      if (!b.manual_opening_set && b.auto_opening_wdv > 0) {
        b.opening_wdv = b.auto_opening_wdv;
      }

      // Include blocks that have opening, additions, sales, or assets
      if (b.opening_wdv === 0 && b.additions_180_plus === 0 && b.additions_less_180 === 0 && b.sale_proceeds === 0 && b.total_assets === 0) {
        return;
      }

      const rate = Number(b.rate) || 0;
      const opening = b.opening_wdv;
      const full = b.additions_180_plus;
      const half = b.additions_less_180;
      const sales = Math.max(0, b.sale_proceeds - b.transfer_expenses);
      const totalBasis = opening + full + half;
      const netBasisBeforeDep = Math.max(0, totalBasis - sales);

      let normalDep = 0;
      let additionalDep = b.additional_dep;
      let closingWDV = 0;
      let capitalGainLoss = 0;
      let stcgType = null; // 'STCG' or 'STCL'

      if (b.code === "UNASSIGNED") {
        normalDep = 0;
        additionalDep = 0;
        closingWDV = 0;
      } else if (b.assets_remaining === 0 && sales > 0) {
        // Section 50 Scenario 2: All assets in the block are transferred (Block ceases to exist)
        normalDep = 0;
        additionalDep = 0;
        closingWDV = 0;
        capitalGainLoss = sales - totalBasis;
        stcgType = capitalGainLoss >= 0 ? "STCG" : "STCL";
        b.notes.push(`Section 50: Block ceased to exist (${stcgType} = ${formatINR(Math.abs(capitalGainLoss))})`);
      } else if (sales > totalBasis) {
        // Section 50 Scenario 1: Sale consideration exceeds Opening WDV + Additions
        normalDep = 0;
        additionalDep = 0;
        closingWDV = 0;
        capitalGainLoss = sales - totalBasis;
        stcgType = "STCG";
        b.notes.push(`Section 50: Sale proceeds exceed block basis (STCG = ${formatINR(capitalGainLoss)})`);
      } else {
        // Normal depreciation: Section 43(6) moneys payable deducted
        const remainingBasis = totalBasis - sales;
        // Sales are first absorbed against (Opening + Additions >= 180)
        const fullPool = opening + full;
        const salesAgainstFull = Math.min(sales, fullPool);
        const fullPoolAfterSales = fullPool - salesAgainstFull;
        const residualSales = sales - salesAgainstFull;
        const halfPoolAfterSales = Math.max(0, half - residualSales);

        normalDep = (fullPoolAfterSales * (rate / 100)) + (halfPoolAfterSales * (rate / 200));
        // Additional depreciation cannot exceed remaining basis after normal depreciation
        additionalDep = Math.min(additionalDep, Math.max(0, remainingBasis - normalDep));
        closingWDV = Math.max(0, remainingBasis - normalDep - additionalDep);
      }

      const row = {
        code: b.code,
        label: b.label,
        rate: rate,
        opening_wdv: opening,
        opening_source: b.opening_source,
        additions_180_plus: full,
        additions_less_180: half,
        total_basis: totalBasis,
        sale_proceeds: sales,
        net_basis_before_dep: netBasisBeforeDep,
        normal_dep: normalDep,
        additional_dep: additionalDep,
        total_dep: normalDep + additionalDep,
        closing_wdv: closingWDV,
        capital_gains: capitalGainLoss,
        stcg_type: stcgType,
        assets_count: b.assets_remaining,
        notes: Array.from(new Set(b.notes)).join("; ")
      };

      scheduleRows.push(row);

      totals.opening_wdv += row.opening_wdv;
      totals.additions_180_plus += row.additions_180_plus;
      totals.additions_less_180 += row.additions_less_180;
      totals.sale_proceeds += row.sale_proceeds;
      totals.normal_dep += row.normal_dep;
      totals.additional_dep += row.additional_dep;
      totals.closing_wdv += row.closing_wdv;
      totals.capital_gains += row.capital_gains;
    });

    return { rows: scheduleRows, totals, periodStart: pStart, periodEnd: pEnd };
  }

  // --- Deferred Tax (Book vs Tax) Schedule Engine ---
  /**
   * Compares Companies Act depreciation with Income Tax depreciation
   * Calculates timing differences and Deferred Tax Asset (DTA) / Liability (DTL)
   */
  function generateDeferredTaxSchedule(bookReport, taxReport, taxRatePct = 25.17) {
    const bookDepTotal = bookReport.totals.current_dep;
    const taxDepTotal = taxReport.totals.normal_dep + taxReport.totals.additional_dep;
    const timingDiff = bookDepTotal - taxDepTotal; // Positive = Book Depr > Tax Depr -> DTA; Negative = DTL

    const taxRate = Number(taxRatePct) || 25.17;
    const taxEffect = Math.abs(timingDiff) * (taxRate / 100.0);

    const isDTA = timingDiff >= 0;
    const statutory = getStatutory();

    // Build Category-wise timing difference schedule
    const categoryRows = (taxReport.rows || []).map(tr => {
      const blockCode = tr.code;
      let matchedBookDep = 0;
      (bookReport.rows || []).forEach(br => {
        if (br.schedule_class && statutory.DEFAULT_TAX_MAP && statutory.DEFAULT_TAX_MAP[br.schedule_class] === blockCode) {
          matchedBookDep += br.current_dep || 0;
        }
      });
      const tDep = tr.total_dep || 0;
      const diff = matchedBookDep - tDep;
      const effect = Math.abs(diff) * (taxRate / 100.0);
      return {
        blockCode: tr.code,
        categoryLabel: tr.label,
        bookDep: matchedBookDep,
        taxDep: tDep,
        diff: diff,
        type: diff >= 0 ? "DTA (Asset)" : "DTL (Liability)",
        effect: effect
      };
    });

    return {
      bookDepreciation: bookDepTotal,
      taxDepreciation: taxDepTotal,
      timingDifference: timingDiff,
      taxRate: taxRate,
      taxEffect: taxEffect,
      deferredTaxType: isDTA ? "Deferred Tax Asset (DTA)" : "Deferred Tax Liability (DTL)",
      bookClosingWDV: bookReport.totals.closing_wdv,
      taxClosingWDV: taxReport.totals.closing_wdv,
      cumulativeDifference: bookReport.totals.closing_wdv - taxReport.totals.closing_wdv,
      categoryRows: categoryRows
    };
  }

  return {
    parseDate,
    formatDateISO,
    formatDateDisplay,
    daysInFY,
    daysInclusive,
    formatINR,
    formatNumber,
    deriveWDVRate,
    getShiftMultiplier,
    calculateAssetBookDepreciation,
    generateBookSchedule,
    generateTaxSchedule,
    generateDeferredTaxSchedule
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = FA_ENGINE;
}
