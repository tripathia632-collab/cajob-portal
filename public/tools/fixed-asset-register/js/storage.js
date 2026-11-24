/**
 * cajob.in - Fixed Asset Register & Depreciation Engine
 * State Management & Local Storage
 * Architect: CA Ashish Tripathi
 * Brand: cajob.in
 */

const FA_STORAGE = (() => {
  "use strict";

  const STORAGE_KEY_PREFIX = "cajob_far_";
  const COMPANIES_KEY = STORAGE_KEY_PREFIX + "companies";
  const ACTIVE_COMPANY_KEY = STORAGE_KEY_PREFIX + "active_company_id";

  function getStatutory() {
    if (typeof STATUTORY_DATA !== "undefined") return STATUTORY_DATA;
    if (typeof require !== "undefined") {
      try { return require("./statutory_data.js"); } catch(e) {}
    }
    return { SAMPLE_ASSETS: [], SAMPLE_TRANSACTIONS: [], SECTORS: [] };
  }

  function getStorageItem(key, defaultVal) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
      console.warn("Storage read error:", e);
      return defaultVal;
    }
  }

  function setStorageItem(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error("Storage write error:", e);
    }
  }

  // --- Companies Management ---
  function getCompanies() {
    let list = getStorageItem(COMPANIES_KEY, null);
    if (!list || !list.length) {
      const defaultCompany = {
        id: "comp_1",
        name: "Acme Industrial Technologies Ltd",
        legal_name: "Acme Industrial Technologies Limited",
        cin: "L29244MH2018PLC301452",
        pan: "AABCA9845K",
        gstin: "27AABCA9845K1Z8",
        sector: "Manufacturing",
        fy_start_month: 4,
        created_at: new Date().toISOString()
      };
      list = [defaultCompany];
      setStorageItem(COMPANIES_KEY, list);
      setStorageItem(ACTIVE_COMPANY_KEY, defaultCompany.id);
      seedSampleData(defaultCompany.id);
    }
    return list;
  }

  function getActiveCompanyId() {
    return getStorageItem(ACTIVE_COMPANY_KEY, "comp_1");
  }

  function getActiveCompany() {
    const list = getCompanies();
    const activeId = getActiveCompanyId();
    return list.find(c => c.id === activeId) || list[0];
  }

  function setActiveCompany(id) {
    setStorageItem(ACTIVE_COMPANY_KEY, id);
  }

  function saveCompany(companyData) {
    const list = getCompanies();
    const id = companyData.id || "comp_" + Date.now();
    const updated = {
      ...companyData,
      id: id,
      updated_at: new Date().toISOString()
    };
    const index = list.findIndex(c => c.id === id);
    if (index >= 0) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    setStorageItem(COMPANIES_KEY, list);
    return updated;
  }

  function deleteCompany(id) {
    let list = getCompanies();
    if (list.length <= 1) {
      throw new Error("Cannot delete the only remaining company profile.");
    }
    list = list.filter(c => c.id !== id);
    setStorageItem(COMPANIES_KEY, list);
    // Remove company assets and transactions
    localStorage.removeItem(STORAGE_KEY_PREFIX + id + "_assets");
    localStorage.removeItem(STORAGE_KEY_PREFIX + id + "_txns");
    localStorage.removeItem(STORAGE_KEY_PREFIX + id + "_tax_openings");

    if (getActiveCompanyId() === id) {
      setActiveCompany(list[0].id);
    }
    return true;
  }

  // --- Assets Storage ---
  function getAssetsKey(companyId) {
    return STORAGE_KEY_PREFIX + (companyId || getActiveCompanyId()) + "_assets";
  }

  function getAssets(companyId) {
    const key = getAssetsKey(companyId);
    let assets = getStorageItem(key, null);
    if (assets === null) {
      // First time loading this company, seed with default CA sample assets
      const statutory = getStatutory();
      assets = JSON.parse(JSON.stringify(statutory.SAMPLE_ASSETS || []));
      setStorageItem(key, assets);
    }
    return assets;
  }

  function saveAssets(companyId, assetsList) {
    const key = getAssetsKey(companyId);
    setStorageItem(key, assetsList);
  }

  function getAsset(companyId, assetCode) {
    const list = getAssets(companyId);
    return list.find(a => String(a.asset_code).trim().toUpperCase() === String(assetCode).trim().toUpperCase()) || null;
  }

  function saveAsset(companyId, assetData) {
    const list = getAssets(companyId);
    const code = String(assetData.asset_code || "").trim();
    if (!code) {
      throw new Error("Asset ID is required.");
    }
    if (!assetData.asset_name) {
      throw new Error("Asset Name is required.");
    }
    if (!assetData.purchase_date) {
      throw new Error("Purchase Date is required.");
    }
    if (Number(assetData.acquisition_cost) < 0) {
      throw new Error("Acquisition Cost cannot be negative.");
    }

    const index = list.findIndex(a => a.asset_code.toUpperCase() === code.toUpperCase());
    const isNew = index === -1;

    const cleaned = {
      ...assetData,
      asset_code: code,
      acquisition_cost: Number(assetData.acquisition_cost) || 0,
      opening_accum_dep: Number(assetData.opening_accum_dep) || 0,
      useful_life_years: Number(assetData.useful_life_years) || null,
      residual_value_pct: Number(assetData.residual_value_pct ?? 5),
      tax_actual_cost: assetData.tax_actual_cost ? Number(assetData.tax_actual_cost) : Number(assetData.acquisition_cost) || 0,
      updated_at: new Date().toISOString()
    };

    if (isNew) {
      cleaned.created_at = new Date().toISOString();
      list.push(cleaned);
    } else {
      list[index] = { ...list[index], ...cleaned };
    }

    saveAssets(companyId, list);
    return cleaned;
  }

  function deleteAsset(companyId, assetCode) {
    let list = getAssets(companyId);
    const codeUpper = String(assetCode).trim().toUpperCase();
    list = list.filter(a => a.asset_code.toUpperCase() !== codeUpper);
    saveAssets(companyId, list);

    // Also remove associated transactions
    let txns = getTransactions(companyId);
    txns = txns.filter(t => String(t.asset_code).toUpperCase() !== codeUpper);
    saveTransactions(companyId, txns);
    return true;
  }

  // --- Transactions Storage ---
  function getTxnsKey(companyId) {
    return STORAGE_KEY_PREFIX + (companyId || getActiveCompanyId()) + "_txns";
  }

  function getTransactions(companyId) {
    const key = getTxnsKey(companyId);
    let txns = getStorageItem(key, null);
    if (txns === null) {
      const statutory = getStatutory();
      txns = JSON.parse(JSON.stringify(statutory.SAMPLE_TRANSACTIONS || []));
      setStorageItem(key, txns);
    }
    return txns;
  }

  function saveTransactions(companyId, txnsList) {
    const key = getTxnsKey(companyId);
    setStorageItem(key, txnsList);
  }

  function addTransaction(companyId, txnData) {
    const asset = getAsset(companyId, txnData.asset_code);
    if (!asset) {
      throw new Error(`Asset '${txnData.asset_code}' not found.`);
    }

    const txns = getTransactions(companyId);
    const txnId = txnData.id || "TXN-" + String(Date.now()).slice(-6);
    const newTxn = {
      ...txnData,
      id: txnId,
      created_at: new Date().toISOString(),
      voided_at: null
    };

    txns.push(newTxn);
    saveTransactions(companyId, txns);

    // Update asset master status or location if needed
    if (txnData.txn_type === "Transfer") {
      if (txnData.new_location) asset.location = txnData.new_location;
      if (txnData.new_department) asset.department = txnData.new_department;
      if (txnData.new_cost_centre) asset.cost_centre = txnData.new_cost_centre;
      if (txnData.new_custodian) asset.custodian = txnData.new_custodian;
      saveAsset(companyId, asset);
    } else if (txnData.txn_type === "Capitalise CWIP") {
      asset.status = "Active";
      asset.ready_to_use_date = txnData.txn_date;
      asset.put_to_use_date = txnData.txn_date;
      saveAsset(companyId, asset);
    } else if (["Disposal / Sale", "Scrap", "Write-Off"].includes(txnData.txn_type)) {
      asset.status = txnData.txn_type === "Disposal / Sale" ? "Disposed" : (txnData.txn_type === "Scrap" ? "Scrapped" : "Written Off");
      saveAsset(companyId, asset);
    }

    return newTxn;
  }

  function voidTransaction(companyId, txnId, reason) {
    const txns = getTransactions(companyId);
    const txn = txns.find(t => t.id === txnId);
    if (!txn) throw new Error("Transaction not found.");

    txn.voided_at = new Date().toISOString();
    txn.void_reason = reason || "Reversed by user";
    saveTransactions(companyId, txns);

    // Restore asset status if this was an exit or CWIP transaction
    const asset = getAsset(companyId, txn.asset_code);
    if (asset) {
      const activeExits = txns.filter(t => 
        !t.voided_at &&
        t.asset_code === asset.asset_code &&
        ["Disposal / Sale", "Scrap", "Write-Off"].includes(t.txn_type)
      );
      if (activeExits.length === 0) {
        asset.status = asset.put_to_use_date ? "Active" : "CWIP";
        saveAsset(companyId, asset);
      }
    }
    return txn;
  }

  // --- Tax Opening Balances ---
  function getTaxOpeningsKey(companyId, fyYear) {
    return STORAGE_KEY_PREFIX + (companyId || getActiveCompanyId()) + "_tax_openings_" + fyYear;
  }

  function getTaxOpenings(companyId, fyYear) {
    return getStorageItem(getTaxOpeningsKey(companyId, fyYear), {});
  }

  function saveTaxOpenings(companyId, fyYear, openingsMap) {
    setStorageItem(getTaxOpeningsKey(companyId, fyYear), openingsMap);
  }

  // --- Seed Data & Reset ---
  function seedSampleData(companyId) {
    const statutory = getStatutory();
    saveAssets(companyId, JSON.parse(JSON.stringify(statutory.SAMPLE_ASSETS || [])));
    saveTransactions(companyId, JSON.parse(JSON.stringify(statutory.SAMPLE_TRANSACTIONS || [])));
  }

  function resetCompanyToSample(companyId) {
    seedSampleData(companyId);
    localStorage.removeItem(STORAGE_KEY_PREFIX + companyId + "_tax_openings_2024");
    localStorage.removeItem(STORAGE_KEY_PREFIX + companyId + "_tax_openings_2025");
  }

  // --- Full Backup and Restore ---
  function exportAllDataJSON() {
    const state = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_KEY_PREFIX)) {
        state[k] = localStorage.getItem(k);
      }
    }
    return JSON.stringify({
      app: "cajob.in - Fixed Asset Register",
      exported_at: new Date().toISOString(),
      creator: "CA Ashish Tripathi",
      brand: "cajob.in",
      state: state
    }, null, 2);
  }

  function importAllDataJSON(jsonStr) {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.state) throw new Error("Invalid cajob.in Fixed Asset Register backup file.");
    Object.keys(parsed.state).forEach(k => {
      localStorage.setItem(k, parsed.state[k]);
    });
    return true;
  }

  return {
    getCompanies,
    getActiveCompany,
    setActiveCompany,
    saveCompany,
    deleteCompany,
    getAssets,
    getAsset,
    saveAsset,
    deleteAsset,
    saveAssets,
    getTransactions,
    addTransaction,
    voidTransaction,
    getTaxOpenings,
    saveTaxOpenings,
    resetCompanyToSample,
    exportAllDataJSON,
    importAllDataJSON
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = FA_STORAGE;
}
