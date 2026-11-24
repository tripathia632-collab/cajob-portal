/**
 * cajob.in - Fixed Asset Register & Depreciation Engine
 * Excel Import / Export & Template Generation using SheetJS (xlsx)
 * Architect: CA Ashish Tripathi
 * Brand: cajob.in
 */

const FA_EXCEL_IO = (() => {
  "use strict";

  function getXLSX() {
    if (typeof XLSX !== "undefined") return XLSX;
    if (typeof require !== "undefined") {
      try { return require("./vendor/xlsx.full.min.js"); } catch(e) {}
    }
    throw new Error("SheetJS (XLSX) library not loaded.");
  }

  function getStatutory() {
    if (typeof STATUTORY_DATA !== "undefined") return STATUTORY_DATA;
    if (typeof require !== "undefined") {
      try { return require("./statutory_data.js"); } catch(e) {}
    }
    return { TEMPLATE_COLUMNS: [], SCHEDULE_II_CLASSES: {}, TAX_BLOCKS: {} };
  }

  function getEngine() {
    if (typeof FA_ENGINE !== "undefined") return FA_ENGINE;
    if (typeof require !== "undefined") {
      try { return require("./engine.js"); } catch(e) {}
    }
    return { formatINR: v => v, formatDateDisplay: v => v };
  }

  // --- 1. Template Generation ---
  function buildTemplateWorkbook() {
    const XLSX = getXLSX();
    const statutory = getStatutory();
    const cols = statutory.TEMPLATE_COLUMNS;

    // Sheet 1: Data entry sheet
    const headerRow = cols.map(c => c.title);
    const sampleRow1 = [
      "FA-001", "LAP-HO-001", "Dell Latitude 5420 Laptop", "COMPUTER_END_USER", "Computers & IT",
      "Laptops", "", "Intel i7, 16GB RAM, 512GB SSD", "DLT-5420-001", "Dell Latitude 5420",
      "Pune Head Office", "Finance", "CC-FIN-01", "Rahul Verma", "TechWorld Solutions",
      "TW/2024/0415", "PO-24-012", "2024-04-15", "2024-04-18", "2024-04-20", 85000, 0, "",
      "SLM", 3, 5, "Single", "", "COMPUTERS_40", "", 85000, "No", "Active", "Opening sample dev laptop"
    ];

    const sampleRow2 = [
      "FA-002", "MCH-PLT-001", "5-Axis CNC Milling Center", "PLANT_GENERAL", "Plant & Machinery",
      "Machining", "", "Vertical CNC Machine", "HAAS-VF4-2024", "Haas VF-4SS",
      "Chakan Plant", "Production", "CC-MFG-01", "Suresh Pillai", "Haas Automation India",
      "HAAS/2024/0912", "PO-MFG-24089", "2024-09-10", "2024-09-22", "2024-09-25", 4200000, 0, "",
      "WDV", 15, 5, "Double", "Double shift plant operation", "PM_GENERAL_15", "", 4200000, "Yes", "Active", "Double shift manufacturing asset"
    ];

    const wsData = [headerRow, sampleRow1, sampleRow2];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws["!cols"] = cols.map(c => ({ wch: Math.max(c.title.length + 3, 14) }));

    // Sheet 2: Field Instructions & Codes Guide
    const instructionsHeader = ["Field Title", "Key Name", "Mandatory?", "Example Value", "Description & Permitted Values"];
    const instructionRows = cols.map(c => [
      c.title,
      c.key,
      c.required ? "YES (Mandatory)" : "Optional",
      c.example,
      c.hint
    ]);

    // Append Schedule II Codes Table
    instructionRows.push(["", "", "", "", ""]);
    instructionRows.push(["--- SCHEDULE II ASSET CLASSES (Companies Act, 2013) ---", "", "", "", ""]);
    instructionRows.push(["Class Key", "Schedule II Class Description", "Statutory Useful Life (Years)", "Standard Category", ""]);
    Object.keys(statutory.SCHEDULE_II_CLASSES || {}).forEach(k => {
      const item = statutory.SCHEDULE_II_CLASSES[k];
      instructionRows.push([k, item.label, item.life !== null ? item.life : "Custom", item.category, ""]);
    });

    // Append Income Tax Block Codes Table
    instructionRows.push(["", "", "", "", ""]);
    instructionRows.push(["--- INCOME TAX ACT DEPRECIATION BLOCKS (Section 32) ---", "", "", "", ""]);
    instructionRows.push(["Block Code", "Tax Block Description", "Statutory Depr. Rate %", "", ""]);
    Object.keys(statutory.TAX_BLOCKS || {}).forEach(k => {
      const item = statutory.TAX_BLOCKS[k];
      instructionRows.push([k, item.label, item.rate !== null ? item.rate + "%" : "Custom", "", ""]);
    });

    const wsInstructions = XLSX.utils.aoa_to_sheet([instructionsHeader, ...instructionRows]);
    wsInstructions["!cols"] = [
      { wch: 32 },
      { wch: 24 },
      { wch: 18 },
      { wch: 22 },
      { wch: 55 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asset_Register_Import");
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Field_Instructions_Guide");
    return wb;
  }

  function downloadImportTemplateXLSX() {
    const XLSX = getXLSX();
    const wb = buildTemplateWorkbook();
    XLSX.writeFile(wb, "cajob_fixed_asset_import_template.xlsx");
  }

  function downloadImportTemplateCSV() {
    const XLSX = getXLSX();
    const wb = buildTemplateWorkbook();
    const firstSheet = wb.Sheets["Asset_Register_Import"];
    const csvContent = XLSX.utils.sheet_to_csv(firstSheet);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "cajob_fixed_asset_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- 2. Excel & CSV Parse & Validation Engine ---
  /**
   * Parses uploaded Excel / CSV buffer and validates every row
   */
  async function parseAndValidateFile(file, existingAssets = []) {
    const XLSX = getXLSX();
    const statutory = getStatutory();
    const engine = getEngine();

    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: "array", cellDates: true });
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];

    // Read rows as array of objects
    const rawRows = XLSX.utils.sheet_to_json(ws, { defval: "" });
    if (!rawRows || !rawRows.length) {
      throw new Error("Uploaded file is empty. Please add asset records.");
    }

    // Mapping helper to find field by key or title
    const colLookup = {};
    statutory.TEMPLATE_COLUMNS.forEach(c => {
      colLookup[c.key.toLowerCase()] = c.key;
      colLookup[c.title.toLowerCase().replace(/[^a-z0-9]/g, "")] = c.key;
    });

    const existingCodes = new Set((existingAssets || []).map(a => String(a.asset_code).trim().toUpperCase()));
    const seenInFileCodes = new Set();

    const validRows = [];
    const errorRows = [];

    rawRows.forEach((row, idx) => {
      const rowNum = idx + 2; // Row number in Excel sheet (1-based + 1 for header)
      const asset = {};

      // Normalize row keys
      Object.keys(row).forEach(rawKey => {
        const cleanKey = rawKey.toLowerCase().replace(/[^a-z0-9]/g, "");
        const matchedKey = colLookup[cleanKey] || colLookup[rawKey.toLowerCase()];
        if (matchedKey) {
          asset[matchedKey] = row[rawKey];
        } else {
          // Direct fallback
          asset[rawKey] = row[rawKey];
        }
      });

      // Validation Checks
      const errors = [];
      const code = String(asset.asset_code || "").trim();

      if (!code) {
        errors.push("Asset ID is missing");
      } else {
        const codeUpper = code.toUpperCase();
        if (seenInFileCodes.has(codeUpper)) {
          errors.push(`Duplicate Asset ID '${code}' found in file`);
        }
        seenInFileCodes.add(codeUpper);
      }

      if (!String(asset.asset_name || "").trim()) {
        errors.push("Asset Name is missing");
      }
      if (!String(asset.category || "").trim()) {
        errors.push("Asset Category is missing");
      }

      // Cost validation
      const cost = Number(asset.acquisition_cost);
      if (isNaN(cost) || cost <= 0) {
        errors.push("Capitalised Cost must be greater than zero");
      }

      // Date parsing & validation
      const purchaseDate = engine.parseDate(asset.purchase_date);
      if (!purchaseDate) {
        errors.push("Invalid or missing Purchase Date");
      }

      const readyDate = engine.parseDate(asset.ready_to_use_date);
      if (readyDate && purchaseDate && readyDate < purchaseDate) {
        errors.push("Ready for Use Date cannot be before Purchase Date");
      }

      const putDate = engine.parseDate(asset.put_to_use_date);
      if (putDate && purchaseDate && putDate < purchaseDate) {
        errors.push("Put to Use Date cannot be before Purchase Date");
      }

      // Opening balances check
      const openingAccum = Number(asset.opening_accum_dep) || 0;
      if (openingAccum < 0) {
        errors.push("Opening accumulated depreciation cannot be negative");
      }
      if (cost && openingAccum > cost) {
        errors.push("Opening accumulated depreciation exceeds asset acquisition cost");
      }

      // Residual value % check
      const residualPct = Number(asset.residual_value_pct ?? 5);
      if (isNaN(residualPct) || residualPct < 0 || residualPct >= 100) {
        errors.push("Residual Value % must be between 0% and 99.99%");
      }

      // Schedule II class fallback
      if (!asset.schedule_class) {
        asset.schedule_class = "PLANT_GENERAL";
      }

      // Income tax block fallback
      if (!asset.tax_block_code) {
        asset.tax_block_code = statutory.DEFAULT_TAX_MAP[asset.schedule_class] || "PM_GENERAL_15";
      }

      // Cleaned asset record
      const cleaned = {
        asset_code: code,
        asset_tag: String(asset.asset_tag || "").trim(),
        asset_name: String(asset.asset_name || "").trim(),
        schedule_class: String(asset.schedule_class || "PLANT_GENERAL").trim(),
        category: String(asset.category || "General").trim(),
        sub_category: String(asset.sub_category || "").trim(),
        parent_asset_code: String(asset.parent_asset_code || "").trim(),
        description: String(asset.description || "").trim(),
        serial_number: String(asset.serial_number || "").trim(),
        make_model: String(asset.make_model || "").trim(),
        location: String(asset.location || "").trim(),
        department: String(asset.department || "").trim(),
        cost_centre: String(asset.cost_centre || "").trim(),
        custodian: String(asset.custodian || "").trim(),
        vendor: String(asset.vendor || "").trim(),
        invoice_number: String(asset.invoice_number || "").trim(),
        po_number: String(asset.po_number || "").trim(),
        purchase_date: engine.formatDateISO(purchaseDate),
        ready_to_use_date: readyDate ? engine.formatDateISO(readyDate) : (putDate ? engine.formatDateISO(putDate) : engine.formatDateISO(purchaseDate)),
        put_to_use_date: putDate ? engine.formatDateISO(putDate) : (String(asset.status).toUpperCase() === "CWIP" ? "" : engine.formatDateISO(purchaseDate)),
        acquisition_cost: cost,
        opening_accum_dep: openingAccum,
        opening_balance_date: asset.opening_balance_date ? engine.formatDateISO(engine.parseDate(asset.opening_balance_date)) : "",
        book_method: String(asset.book_method || "SLM").toUpperCase() === "WDV" ? "WDV" : "SLM",
        useful_life_years: Number(asset.useful_life_years) || (statutory.SCHEDULE_II_CLASSES[asset.schedule_class]?.life || 5),
        residual_value_pct: residualPct,
        shift_type: String(asset.shift_type || "Single"),
        book_override_reason: String(asset.book_override_reason || "").trim(),
        tax_block_code: String(asset.tax_block_code || "PM_GENERAL_15").trim(),
        tax_custom_rate: asset.tax_custom_rate ? Number(asset.tax_custom_rate) : null,
        tax_actual_cost: asset.tax_actual_cost ? Number(asset.tax_actual_cost) : cost,
        additional_dep_eligible: ["1", "true", "yes", "y", "eligible"].includes(String(asset.additional_dep_eligible || "").toLowerCase()) ? 1 : 0,
        status: String(asset.status || "Active").trim() || "Active",
        notes: String(asset.notes || "").trim()
      };

      if (errors.length > 0) {
        errorRows.push({
          rowNumber: rowNum,
          assetCode: code || "—",
          assetName: asset.asset_name || "—",
          errors: errors
        });
      } else {
        validRows.push(cleaned);
      }
    });

    return {
      totalRows: rawRows.length,
      validRows: validRows,
      errorRows: errorRows,
      hasErrors: errorRows.length > 0
    };
  }

  // --- 3. Schedules & Master Export ---
  function exportAssetMasterXLSX(assets, company) {
    const XLSX = getXLSX();
    const rows = (assets || []).map(a => ({
      "Asset ID": a.asset_code,
      "Asset Tag": a.asset_tag || "—",
      "Asset Name": a.asset_name,
      "Category": a.category,
      "Sub Category": a.sub_category || "—",
      "Company Class": a.schedule_class,
      "Location": a.location || "—",
      "Department": a.department || "—",
      "Cost Centre": a.cost_centre || "—",
      "Custodian": a.custodian || "—",
      "Vendor": a.vendor || "—",
      "Invoice No.": a.invoice_number || "—",
      "Purchase Date": a.purchase_date,
      "Ready for Use Date": a.ready_to_use_date || "—",
      "Put to Use Date": a.put_to_use_date || "—",
      "Capitalised Cost (₹)": a.acquisition_cost,
      "Book Method": a.book_method,
      "Useful Life (Yrs)": a.useful_life_years,
      "Residual Value %": a.residual_value_pct,
      "Shift": a.shift_type || "Single",
      "Income-tax Block": a.tax_block_code,
      "Tax Cost (₹)": a.tax_actual_cost,
      "Status": a.status,
      "Remarks": a.notes || "—"
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asset_Master");
    XLSX.writeFile(wb, `cajob_Asset_Master_${company.name.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`);
  }

  function exportCompaniesActScheduleXLSX(bookReport, company) {
    const XLSX = getXLSX();
    const rows = (bookReport.rows || []).map(r => ({
      "Asset ID": r.asset_code,
      "Asset Name": r.asset_name,
      "Category": r.category,
      "Method": r.method,
      "Useful Life (Yrs)": r.useful_life_years,
      "Opening Gross Block (₹)": r.opening_gross,
      "Additions in Period (₹)": r.additions,
      "Disposals Gross (₹)": r.disposal_gross,
      "Closing Gross Block (₹)": r.closing_gross,
      "Opening Accum. Dep. (₹)": r.opening_accum_dep,
      "Depreciation for Period (₹)": r.current_dep,
      "Disposals Accum. Dep. (₹)": Math.max(0, r.disposal_gross - r.disposal_wdv),
      "Closing Accum. Dep. (₹)": r.closing_accum_dep,
      "Opening Net Block (₹)": r.opening_wdv,
      "Closing Net Block (₹)": r.closing_wdv,
      "Net Sale Proceeds (₹)": r.proceeds - r.transfer_expenses,
      "Disposal Gain / (Loss) (₹)": r.gain_loss,
      "Status": r.status,
      "Review Notes": r.exceptions || "OK"
    }));

    // Append Totals Row
    const t = bookReport.totals;
    rows.push({
      "Asset ID": "TOTAL",
      "Asset Name": "Grand Totals",
      "Category": "",
      "Method": "",
      "Useful Life (Yrs)": "",
      "Opening Gross Block (₹)": t.opening_gross,
      "Additions in Period (₹)": t.additions,
      "Disposals Gross (₹)": t.disposal_gross,
      "Closing Gross Block (₹)": t.closing_gross,
      "Opening Accum. Dep. (₹)": t.opening_accum_dep,
      "Depreciation for Period (₹)": t.current_dep,
      "Disposals Accum. Dep. (₹)": Math.max(0, t.disposal_gross - t.disposal_wdv),
      "Closing Accum. Dep. (₹)": t.closing_accum_dep,
      "Opening Net Block (₹)": t.opening_wdv,
      "Closing Net Block (₹)": t.closing_wdv,
      "Net Sale Proceeds (₹)": "",
      "Disposal Gain / (Loss) (₹)": t.gain_loss,
      "Status": "",
      "Review Notes": ""
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedule_II_Depreciation");
    XLSX.writeFile(wb, `cajob_Companies_Act_Schedule_II_${company.name.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`);
  }

  function exportIncomeTaxScheduleXLSX(taxReport, company) {
    const XLSX = getXLSX();
    const rows = (taxReport.rows || []).map(r => ({
      "Tax Block Code": r.code,
      "Category Description": r.label,
      "Depreciation Rate %": r.rate + "%",
      "Opening WDV (₹)": r.opening_wdv,
      "Additions ≥180 Days (₹)": r.additions_180_plus,
      "Additions <180 Days (₹)": r.additions_less_180,
      "Total Basis (₹)": r.total_basis,
      "Sale Consideration / Deductions (₹)": r.sale_proceeds,
      "Net WDV before Dep. (₹)": r.net_basis_before_dep !== undefined ? r.net_basis_before_dep : Math.max(0, r.total_basis - r.sale_proceeds),
      "Normal Depreciation (₹)": r.normal_dep,
      "Additional Dep. u/s 32(1)(iia) (₹)": r.additional_dep,
      "Total Tax Depreciation (₹)": r.total_dep,
      "Closing WDV (₹)": r.closing_wdv,
      "Section 50 Capital Gain / (Loss) (₹)": r.capital_gains,
      "Statutory Notes": r.notes || "OK"
    }));

    // Append Totals Row
    const t = taxReport.totals;
    const totalBasis = t.opening_wdv + t.additions_180_plus + t.additions_less_180;
    rows.push({
      "Tax Block Code": "TOTAL",
      "Category Description": "Grand Totals",
      "Depreciation Rate %": "",
      "Opening WDV (₹)": t.opening_wdv,
      "Additions ≥180 Days (₹)": t.additions_180_plus,
      "Additions <180 Days (₹)": t.additions_less_180,
      "Total Basis (₹)": totalBasis,
      "Sale Consideration / Deductions (₹)": t.sale_proceeds,
      "Net WDV before Dep. (₹)": Math.max(0, totalBasis - t.sale_proceeds),
      "Normal Depreciation (₹)": t.normal_dep,
      "Additional Dep. u/s 32(1)(iia) (₹)": t.additional_dep,
      "Total Tax Depreciation (₹)": t.normal_dep + t.additional_dep,
      "Closing WDV (₹)": t.closing_wdv,
      "Section 50 Capital Gain / (Loss) (₹)": t.capital_gains,
      "Statutory Notes": ""
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Form_3CD_Tax_Depreciation");
    XLSX.writeFile(wb, `cajob_Income_Tax_Schedule_3CD_${company.name.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`);
  }

  function exportDeferredTaxComparisonXLSX(defTax, bookReport, taxReport, company) {
    const XLSX = getXLSX();
    const rows = [
      { "Parameter": "Book Depreciation (Companies Act 2013)", "Amount (₹)": defTax.bookDepreciation },
      { "Parameter": "Tax Depreciation (Income Tax Act 1961)", "Amount (₹)": defTax.taxDepreciation },
      { "Parameter": "Timing Difference (Book Depr - Tax Depr)", "Amount (₹)": defTax.timingDifference },
      { "Parameter": "Applicable Tax Rate (%)", "Amount (₹)": defTax.taxRate + "%" },
      { "Parameter": defTax.deferredTaxType + " for the year", "Amount (₹)": defTax.taxEffect },
      { "Parameter": "Closing Net Book Value (Books)", "Amount (₹)": defTax.bookClosingWDV },
      { "Parameter": "Closing WDV (Income Tax Block)", "Amount (₹)": defTax.taxClosingWDV },
      { "Parameter": "Cumulative Timing Difference (Carrying vs Tax Base)", "Amount (₹)": defTax.cumulativeDifference }
    ];

    const catRows = (defTax.categoryRows || []).map(cr => ({
      "Tax Block": cr.blockCode,
      "Asset Class / Category": cr.categoryLabel,
      "Book Depreciation (₹)": cr.bookDep,
      "Tax Depreciation (₹)": cr.taxDep,
      "Timing Difference (₹)": cr.diff,
      "Nature": cr.type,
      "Tax Impact (₹)": cr.effect
    }));

    const wsSummary = XLSX.utils.json_to_sheet(rows);
    const wsCategory = XLSX.utils.json_to_sheet(catRows);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsSummary, "Deferred_Tax_Summary");
    if (catRows.length > 0) {
      XLSX.utils.book_append_sheet(wb, wsCategory, "Category_Wise_Timing_Diffs");
    }
    XLSX.writeFile(wb, `cajob_Deferred_Tax_Comparison_${company.name.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`);
  }

  return {
    buildTemplateWorkbook,
    downloadImportTemplateXLSX,
    downloadImportTemplateCSV,
    parseAndValidateFile,
    exportAssetMasterXLSX,
    exportCompaniesActScheduleXLSX,
    exportIncomeTaxScheduleXLSX,
    exportDeferredTaxComparisonXLSX
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = FA_EXCEL_IO;
}
