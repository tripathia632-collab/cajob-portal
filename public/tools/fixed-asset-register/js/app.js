/**
 * cajob.in - Fixed Asset Register & Depreciation Engine
 * Main UI Controller & Visual Dashboard
 * Architect: CA Ashish Tripathi
 * Brand: cajob.in
 */

const APP = (() => {
  "use strict";

  let currentCompany = null;
  let currentFY = 2024;
  let activeTab = "dashboard";
  let pendingImportData = null;

  // Chart instances
  let donutChart = null;
  let comparisonChart = null;

  function init() {
    // 1. Initialise Company & FY
    const companies = FA_STORAGE.getCompanies();
    currentCompany = FA_STORAGE.getActiveCompany();
    currentFY = parseInt(document.getElementById("fySelector").value, 10) || 2024;

    populateCompanySelector();
    populateStaticDropdowns();
    updateEntityLabels();

    // 2. Setup drag and drop for import
    setupDragAndDrop();

    // 3. Render active tab
    renderActiveTab();
  }

  function getFYDates(fyStartYear) {
    const y = parseInt(fyStartYear, 10);
    return {
      start: `${y}-04-01`,
      end: `${y + 1}-03-31`,
      label: `FY ${y}-${String(y + 1).slice(-2)}`
    };
  }

  function populateCompanySelector() {
    const selector = document.getElementById("companySelector");
    if (!selector) return;
    const list = FA_STORAGE.getCompanies();
    selector.innerHTML = list.map(c => 
      `<option value="${c.id}" ${c.id === currentCompany.id ? "selected" : ""}>${c.name}</option>`
    ).join("") + `<option value="__NEW__">+ Add New Entity...</option>`;
  }

  function populateStaticDropdowns() {
    // Schedule II classes
    const schedSelect = document.getElementById("formScheduleClass");
    if (schedSelect) {
      schedSelect.innerHTML = `<option value="">-- Select Schedule II Class --</option>` + 
        Object.keys(STATUTORY_DATA.SCHEDULE_II_CLASSES).map(k => {
          const item = STATUTORY_DATA.SCHEDULE_II_CLASSES[k];
          return `<option value="${k}">${item.label} (${item.life !== null ? item.life + " yrs" : "Custom"})</option>`;
        }).join("");
    }

    // Income tax blocks
    const taxSelect = document.getElementById("formTaxBlockCode");
    if (taxSelect) {
      taxSelect.innerHTML = `<option value="">-- Select Income-tax Category --</option>` +
        Object.keys(STATUTORY_DATA.TAX_BLOCKS).map(k => {
          const item = STATUTORY_DATA.TAX_BLOCKS[k];
          return `<option value="${k}">${item.label} (${item.rate !== null ? item.rate + "%" : "Custom"})</option>`;
        }).join("");
    }

    // Sectors in Company Modal
    const compSectorSelect = document.getElementById("compSector");
    if (compSectorSelect) {
      compSectorSelect.innerHTML = STATUTORY_DATA.SECTORS.map(s => 
        `<option value="${s}">${s}</option>`
      ).join("");
    }
  }

  function updateEntityLabels() {
    const printName = document.getElementById("printCompanyName");
    if (printName && currentCompany) {
      printName.textContent = currentCompany.legal_name || currentCompany.name;
    }
    const fyDates = getFYDates(currentFY);
    const printSub = document.getElementById("printSubtitle");
    if (printSub) {
      printSub.textContent = `${fyDates.label} (${FA_ENGINE.formatDateDisplay(fyDates.start)} to ${FA_ENGINE.formatDateDisplay(fyDates.end)}) · cajob.in · By CA Ashish Tripathi`;
    }
  }

  // --- Tab Navigation ---
  function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.classList.toggle("active", tab.getAttribute("data-tab") === tabId);
    });

    document.querySelectorAll(".tab-content").forEach(content => {
      content.style.display = content.id === `view-${tabId}` ? "block" : "none";
    });

    renderActiveTab();
  }

  function renderActiveTab() {
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const txns = FA_STORAGE.getTransactions(currentCompany.id);
    document.getElementById("tabAssetCount").textContent = assets.length;
    const tabTxnBadge = document.getElementById("tabTxnCount");
    if (tabTxnBadge) {
      tabTxnBadge.textContent = txns.filter(t => !t.voided_at).length;
    }

    switch (activeTab) {
      case "dashboard":
        renderDashboard();
        break;
      case "operations":
      case "transactions":
        renderTransactionsTable();
        break;
      case "assets":
        renderAssetsTable();
        break;
      case "companies-act":
        renderBookSchedule();
        break;
      case "income-tax":
        renderTaxSchedule();
        break;
      case "deferred-tax":
        renderDeferredTax();
        break;
      case "reports":
        // Reports view is static links
        break;
    }
  }

  // --- 1. Dashboard View ---
  function renderDashboard() {
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const txns = FA_STORAGE.getTransactions(currentCompany.id);
    const fy = getFYDates(currentFY);
    const taxOpenings = FA_STORAGE.getTaxOpenings(currentCompany.id, currentFY);

    const bookReport = FA_ENGINE.generateBookSchedule(currentCompany, assets, txns, fy.start, fy.end);
    const taxReport = FA_ENGINE.generateTaxSchedule(currentCompany, assets, txns, fy.start, fy.end, taxOpenings, true);

    // Update KPI cards
    document.getElementById("kpiGrossBlock").textContent = FA_ENGINE.formatINR(bookReport.totals.closing_gross || bookReport.totals.opening_gross);
    document.getElementById("kpiTotalAssets").textContent = assets.length;
    document.getElementById("kpiNetBlock").textContent = FA_ENGINE.formatINR(bookReport.totals.closing_wdv);
    document.getElementById("kpiBookDepr").textContent = FA_ENGINE.formatINR(bookReport.totals.current_dep);
    document.getElementById("kpiTaxDepr").textContent = FA_ENGINE.formatINR(taxReport.totals.normal_dep + taxReport.totals.additional_dep);
    document.getElementById("kpiCWIPValue").textContent = FA_ENGINE.formatINR(bookReport.totals.cwip_value);
    
    const cwipCount = assets.filter(a => a.status === "CWIP").length;
    document.getElementById("kpiCWIPCount").textContent = cwipCount;

    document.getElementById("kpiDisposalsValue").textContent = FA_ENGINE.formatINR(bookReport.totals.disposal_gross);
    document.getElementById("kpiDisposalsPL").textContent = FA_ENGINE.formatINR(bookReport.totals.gain_loss);

    // Recent movements table
    const recentTxnsBody = document.getElementById("dashboardRecentTxnsBody");
    const sortedTxns = [...txns].filter(t => !t.voided_at).sort((a, b) => new Date(b.txn_date) - new Date(a.txn_date)).slice(0, 5);

    if (sortedTxns.length === 0) {
      recentTxnsBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No transactions recorded yet. Use '+ Add Asset' or 'Record Asset Change'.</td></tr>`;
    } else {
      recentTxnsBody.innerHTML = sortedTxns.map(t => {
        const asset = assets.find(a => a.asset_code === t.asset_code);
        const name = asset ? asset.asset_name : "—";
        return `
          <tr>
            <td>${FA_ENGINE.formatDateDisplay(t.txn_date)}</td>
            <td><div class="cell-title">${t.asset_code}</div><div class="cell-sub">${name}</div></td>
            <td><span class="badge ${t.txn_type.includes('Disposal') ? 'badge-disposed' : 'badge-blue'}">${t.txn_type}</span></td>
            <td>${t.reference || "—"}</td>
            <td class="num">${t.amount ? FA_ENGINE.formatINR(t.amount) : "—"}</td>
            <td class="num">${t.proceeds ? FA_ENGINE.formatINR(t.proceeds) : "—"}</td>
            <td><span class="badge badge-active">Recorded</span></td>
          </tr>
        `;
      }).join("");
    }

    // Render Charts
    renderCharts(bookReport, taxReport);
  }

  function renderCharts(bookReport, taxReport) {
    if (typeof Chart === "undefined") return;

    // 1. Donut Chart - Asset mix by category
    const catTotals = {};
    (bookReport.rows || []).forEach(r => {
      const cat = r.category || "Other";
      const val = r.closing_gross || r.opening_gross || 0;
      catTotals[cat] = (catTotals[cat] || 0) + val;
    });

    const catLabels = Object.keys(catTotals);
    const catData = Object.values(catTotals);
    const colors = ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0284c7", "#e11d48", "#10b981", "#64748b"];

    const ctxDonut = document.getElementById("categoryDonutChart");
    if (ctxDonut) {
      if (donutChart) donutChart.destroy();
      donutChart = new Chart(ctxDonut, {
        type: "doughnut",
        data: {
          labels: catLabels,
          datasets: [{
            data: catData,
            backgroundColor: colors.slice(0, catLabels.length),
            borderWidth: 2,
            borderColor: "#ffffff"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: ctx => ` ${ctx.label}: ${FA_ENGINE.formatINR(ctx.raw)}`
              }
            }
          }
        }
      });
    }

    // 2. Bar Chart - Companies Act vs Income Tax Depreciation Comparison
    const ctxBar = document.getElementById("deprComparisonChart");
    if (ctxBar) {
      if (comparisonChart) comparisonChart.destroy();
      const bookTotal = bookReport.totals.current_dep;
      const taxNormal = taxReport.totals.normal_dep;
      const taxAdditional = taxReport.totals.additional_dep;
      const taxTotal = taxNormal + taxAdditional;

      comparisonChart = new Chart(ctxBar, {
        type: "bar",
        data: {
          labels: ["Companies Act (Schedule II)", "Income Tax Act (Total)", "Tax Normal Depr", "Tax Additional Depr (32(1)(iia))"],
          datasets: [{
            label: "Depreciation Amount (₹)",
            data: [bookTotal, taxTotal, taxNormal, taxAdditional],
            backgroundColor: ["#1e40af", "#059669", "#3b82f6", "#d97706"],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` Amount: ${FA_ENGINE.formatINR(ctx.raw)}`
              }
            }
          },
          scales: {
            y: {
              ticks: {
                callback: val => "₹ " + (val >= 100000 ? (val / 100000).toFixed(1) + "L" : val)
              }
            }
          }
        }
      });
    }
  }

  // --- 2. Fixed Asset Register View ---
  function renderAssetsTable() {
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const searchVal = (document.getElementById("assetSearchInput").value || "").trim().toLowerCase();
    const filterCat = document.getElementById("filterCategory").value;
    const filterStat = document.getElementById("filterStatus").value;
    const filterLoc = document.getElementById("filterLocation").value;

    // Populate category and location filter options
    const categories = Array.from(new Set(assets.map(a => a.category).filter(Boolean))).sort();
    const locations = Array.from(new Set(assets.map(a => a.location).filter(Boolean))).sort();

    const catSelect = document.getElementById("filterCategory");
    const currentCat = catSelect.value;
    catSelect.innerHTML = `<option value="">All Categories (${categories.length})</option>` +
      categories.map(c => `<option value="${c}" ${c === currentCat ? "selected" : ""}>${c}</option>`).join("");

    const locSelect = document.getElementById("filterLocation");
    const currentLoc = locSelect.value;
    locSelect.innerHTML = `<option value="">All Locations (${locations.length})</option>` +
      locations.map(l => `<option value="${l}" ${l === currentLoc ? "selected" : ""}>${l}</option>`).join("");

    // Filter assets
    const filtered = assets.filter(a => {
      if (filterCat && a.category !== filterCat) return false;
      if (filterStat && a.status !== filterStat) return false;
      if (filterLoc && a.location !== filterLoc) return false;
      if (searchVal) {
        const text = `${a.asset_code} ${a.asset_name} ${a.asset_tag} ${a.serial_number} ${a.vendor} ${a.custodian}`.toLowerCase();
        if (!text.includes(searchVal)) return false;
      }
      return true;
    });

    const tbody = document.getElementById("assetsTableBody");
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 36px;">No fixed assets matched the selected filters. Click '+ Add Asset' or 'Bulk Upload'.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(a => {
      let statusBadge = `<span class="badge badge-active">Active</span>`;
      if (a.status === "CWIP") statusBadge = `<span class="badge badge-cwip">CWIP</span>`;
      else if (["Disposed", "Scrapped", "Written Off"].includes(a.status)) {
        statusBadge = `<span class="badge badge-disposed">${a.status}</span>`;
      }

      const ptuDisplay = a.put_to_use_date ? FA_ENGINE.formatDateDisplay(a.put_to_use_date) : "<span style='color:var(--text-light)'>Not Put to Use</span>";
      const readyDisplay = a.ready_to_use_date ? FA_ENGINE.formatDateDisplay(a.ready_to_use_date) : "<span style='color:var(--text-light)'>Same as Purchase</span>";

      return `
        <tr>
          <td>
            <div class="cell-title">${a.asset_code} · ${a.asset_name}</div>
            <div class="cell-sub">Tag: ${a.asset_tag || "—"} | S/N: ${a.serial_number || "—"}</div>
          </td>
          <td>
            <div class="cell-title">${a.category}</div>
            <div class="cell-sub">${a.sub_category || a.schedule_class}</div>
          </td>
          <td>
            <div>${a.location || "—"}</div>
            <div class="cell-sub">${a.department || "—"} · ${a.custodian || "—"}</div>
          </td>
          <td>
            <div class="cell-sub">Pur: <strong>${FA_ENGINE.formatDateDisplay(a.purchase_date)}</strong></div>
            <div class="cell-sub">Ready: ${readyDisplay}</div>
            <div class="cell-sub">PTU: ${ptuDisplay}</div>
          </td>
          <td class="num">
            <strong>${FA_ENGINE.formatINR(a.acquisition_cost)}</strong>
          </td>
          <td>
            <div>${a.book_method || "SLM"} · ${a.useful_life_years || 0} Yrs</div>
            <div class="cell-sub">RV: ${a.residual_value_pct || 5}% · ${a.shift_type || "Single"}</div>
          </td>
          <td>
            <div>${a.tax_block_code || "—"}</div>
            <div class="cell-sub">${a.additional_dep_eligible ? "⭐ Addl Dep (32(1)(iia))" : "Normal"}</div>
          </td>
          <td>${statusBadge}</td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 4px;">
              <button class="btn btn-sm btn-secondary" onclick="APP.openEditAssetModal('${a.asset_code}')" title="Edit Asset">✏️</button>
              ${a.status === "CWIP" ? 
                `<button class="btn btn-sm btn-emerald" onclick="APP.openCapitaliseModal('${a.asset_code}')" title="Capitalise CWIP">🏗️ Capitalise</button>` : 
                (a.status === "Active" ? 
                  `<button class="btn btn-sm btn-amber" onclick="APP.openDisposalModal('${a.asset_code}')" title="Dispose / Discard Asset">🏷️ Exit</button>` : 
                  "")
              }
              <button class="btn btn-sm btn-secondary" onclick="APP.openCostAdditionModal('${a.asset_code}')" title="Subsequent Capex Addition">➕ Capex</button>
              <button class="btn btn-sm btn-icon" style="color:var(--danger);" onclick="APP.confirmDeleteAsset('${a.asset_code}')" title="Delete Asset">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // --- 3. Companies Act (Schedule II) View ---
  function renderBookSchedule() {
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const txns = FA_STORAGE.getTransactions(currentCompany.id);
    const fy = getFYDates(currentFY);
    const viewMode = document.getElementById("scheduleViewMode")?.value || "detail";

    const report = FA_ENGINE.generateBookSchedule(currentCompany, assets, txns, fy.start, fy.end);
    const tbody = document.getElementById("bookScheduleTableBody");
    const tfoot = document.getElementById("bookScheduleTableFoot");
    const thName = document.getElementById("thScheduleName");
    const thMethod = document.getElementById("thScheduleMethod");

    if (!report.rows.length) {
      tbody.innerHTML = `<tr><td colspan="15" style="text-align: center; color: var(--text-muted); padding: 36px;">No assets available for the selected period.</td></tr>`;
      tfoot.innerHTML = "";
      return;
    }

    if (viewMode === "category") {
      if (thName) thName.textContent = "Balance Sheet Category";
      if (thMethod) thMethod.textContent = "Asset Count";

      // Aggregate by category
      const catMap = {};
      report.rows.forEach(r => {
        const cat = r.category || "General";
        if (!catMap[cat]) {
          catMap[cat] = {
            category: cat,
            count: 0,
            opening_gross: 0,
            additions: 0,
            disposal_gross: 0,
            closing_gross: 0,
            opening_accum_dep: 0,
            current_dep: 0,
            disposal_accum: 0,
            closing_accum_dep: 0,
            opening_wdv: 0,
            closing_wdv: 0,
            gain_loss: 0
          };
        }
        const c = catMap[cat];
        c.count++;
        c.opening_gross += r.opening_gross || 0;
        c.additions += r.additions || 0;
        c.disposal_gross += r.disposal_gross || 0;
        c.closing_gross += r.closing_gross || 0;
        c.opening_accum_dep += r.opening_accum_dep || 0;
        c.current_dep += r.current_dep || 0;
        c.disposal_accum += Math.max(0, (r.disposal_gross || 0) - (r.disposal_wdv || 0));
        c.closing_accum_dep += r.closing_accum_dep || 0;
        c.opening_wdv += r.opening_wdv || 0;
        c.closing_wdv += r.closing_wdv || 0;
        c.gain_loss += r.gain_loss || 0;
      });

      tbody.innerHTML = Object.values(catMap).map(c => `
        <tr>
          <td><div class="cell-title">📁 ${c.category}</div></td>
          <td><span class="badge badge-blue">${c.count} assets</span></td>
          <td class="num">${FA_ENGINE.formatINR(c.opening_gross)}</td>
          <td class="num">${c.additions ? FA_ENGINE.formatINR(c.additions) : "—"}</td>
          <td class="num">${c.disposal_gross ? FA_ENGINE.formatINR(c.disposal_gross) : "—"}</td>
          <td class="num"><strong>${FA_ENGINE.formatINR(c.closing_gross)}</strong></td>
          <td class="num">${FA_ENGINE.formatINR(c.opening_accum_dep)}</td>
          <td class="num" style="color:var(--primary); font-weight:700;">${FA_ENGINE.formatINR(c.current_dep)}</td>
          <td class="num">${c.disposal_accum ? FA_ENGINE.formatINR(c.disposal_accum) : "—"}</td>
          <td class="num"><strong>${FA_ENGINE.formatINR(c.closing_accum_dep)}</strong></td>
          <td class="num">${FA_ENGINE.formatINR(c.opening_wdv)}</td>
          <td class="num" style="color:var(--success); font-weight:700;">${FA_ENGINE.formatINR(c.closing_wdv)}</td>
          <td class="num" style="${c.gain_loss < 0 ? 'color:var(--danger);' : (c.gain_loss > 0 ? 'color:var(--success);' : '')}">
            ${c.gain_loss ? FA_ENGINE.formatINR(c.gain_loss) : "—"}
          </td>
          <td><span class="badge badge-active">Summary</span></td>
        </tr>
      `).join("");
    } else {
      if (thName) thName.textContent = "Asset Code & Description";
      if (thMethod) thMethod.textContent = "Method & Life";

      tbody.innerHTML = report.rows.map(r => {
        let statusBadge = `<span class="badge badge-active">OK</span>`;
        if (r.is_cwip) statusBadge = `<span class="badge badge-cwip">CWIP</span>`;
        else if (["Disposal / Sale", "Scrap", "Write-Off"].includes(r.status)) {
          statusBadge = `<span class="badge badge-disposed">${r.status}</span>`;
        }
        if (r.exceptions) {
          statusBadge += `<div class="cell-sub" style="color:var(--danger);">${r.exceptions}</div>`;
        }

        return `
          <tr>
            <td>
              <div class="cell-title">${r.asset_code} · ${r.asset_name}</div>
              <div class="cell-sub">${r.category} · Ready: ${r.ready_to_use_date}</div>
            </td>
            <td>
              <div>${r.method} · ${r.useful_life_years}y</div>
              <div class="cell-sub">${r.shift_type !== "Single" ? "⭐ " + r.shift_type : "1x"}</div>
            </td>
            <td class="num">${FA_ENGINE.formatINR(r.opening_gross)}</td>
            <td class="num">${r.additions ? FA_ENGINE.formatINR(r.additions) : "—"}</td>
            <td class="num">${r.disposal_gross ? FA_ENGINE.formatINR(r.disposal_gross) : "—"}</td>
            <td class="num"><strong>${FA_ENGINE.formatINR(r.closing_gross)}</strong></td>
            <td class="num">${FA_ENGINE.formatINR(r.opening_accum_dep)}</td>
            <td class="num" style="color:var(--primary); font-weight:700;">${FA_ENGINE.formatINR(r.current_dep)}</td>
            <td class="num">${r.disposal_gross ? FA_ENGINE.formatINR(Math.max(0, r.disposal_gross - r.disposal_wdv)) : "—"}</td>
            <td class="num"><strong>${FA_ENGINE.formatINR(r.closing_accum_dep)}</strong></td>
            <td class="num">${FA_ENGINE.formatINR(r.opening_wdv)}</td>
            <td class="num" style="color:var(--success); font-weight:700;">${FA_ENGINE.formatINR(r.closing_wdv)}</td>
            <td class="num" style="${r.gain_loss < 0 ? 'color:var(--danger);' : (r.gain_loss > 0 ? 'color:var(--success);' : '')}">
              ${r.gain_loss ? FA_ENGINE.formatINR(r.gain_loss) : "—"}
            </td>
            <td>${statusBadge}</td>
          </tr>
        `;
      }).join("");
    }

    const t = report.totals;
    tfoot.innerHTML = `
      <tr>
        <th colspan="2">TOTAL (SCHEDULE II)</th>
        <th class="num">${FA_ENGINE.formatINR(t.opening_gross)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.additions)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.disposal_gross)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.closing_gross)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.opening_accum_dep)}</th>
        <th class="num" style="color:var(--primary); font-weight:800;">${FA_ENGINE.formatINR(t.current_dep)}</th>
        <th class="num">${FA_ENGINE.formatINR(Math.max(0, t.disposal_gross - t.disposal_wdv))}</th>
        <th class="num">${FA_ENGINE.formatINR(t.closing_accum_dep)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.opening_wdv)}</th>
        <th class="num" style="color:var(--success); font-weight:800;">${FA_ENGINE.formatINR(t.closing_wdv)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.gain_loss)}</th>
        <th></th>
      </tr>
    `;
  }

  // --- 4. Income Tax Act (Section 32) View ---
  function renderTaxSchedule() {
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const txns = FA_STORAGE.getTransactions(currentCompany.id);
    const fy = getFYDates(currentFY);
    const taxOpenings = FA_STORAGE.getTaxOpenings(currentCompany.id, currentFY);
    const includeAddl = document.getElementById("includeAdditionalDepCheckbox")?.checked ?? true;

    const report = FA_ENGINE.generateTaxSchedule(currentCompany, assets, txns, fy.start, fy.end, taxOpenings, includeAddl);
    const tbody = document.getElementById("taxScheduleTableBody");
    const tfoot = document.getElementById("taxScheduleTableFoot");

    if (!report.rows.length) {
      tbody.innerHTML = `<tr><td colspan="13" style="text-align: center; color: var(--text-muted); padding: 36px;">No Income-tax categories found for this period.</td></tr>`;
      tfoot.innerHTML = "";
      return;
    }

    tbody.innerHTML = report.rows.map(r => {
      let notesHtml = r.notes ? `<div class="cell-sub" style="color:var(--danger);">${r.notes}</div>` : `<span class="badge badge-active">OK</span>`;
      return `
        <tr>
          <td>
            <div class="cell-title">${r.label}</div>
            <div class="cell-sub">Code: ${r.code} (${r.assets_count} active assets) · ${r.opening_source}</div>
          </td>
          <td class="num"><strong>${r.rate}%</strong></td>
          <td class="num">${FA_ENGINE.formatINR(r.opening_wdv)}</td>
          <td class="num">${FA_ENGINE.formatINR(r.additions_180_plus)}</td>
          <td class="num">${FA_ENGINE.formatINR(r.additions_less_180)}</td>
          <td class="num">${FA_ENGINE.formatINR(r.total_basis)}</td>
          <td class="num">${r.sale_proceeds ? FA_ENGINE.formatINR(r.sale_proceeds) : "—"}</td>
          <td class="num">${FA_ENGINE.formatINR(r.net_basis_before_dep ?? Math.max(0, r.total_basis - r.sale_proceeds))}</td>
          <td class="num">${FA_ENGINE.formatINR(r.normal_dep)}</td>
          <td class="num" style="${r.additional_dep ? 'color:var(--primary); font-weight:700;' : ''}">${r.additional_dep ? FA_ENGINE.formatINR(r.additional_dep) : "—"}</td>
          <td class="num" style="color:var(--success); font-weight:700;">${FA_ENGINE.formatINR(r.total_dep)}</td>
          <td class="num"><strong>${FA_ENGINE.formatINR(r.closing_wdv)}</strong></td>
          <td>${r.capital_gains ? `<strong style="color:var(--danger);">${r.stcg_type}: ${FA_ENGINE.formatINR(r.capital_gains)}</strong>` : notesHtml}</td>
        </tr>
      `;
    }).join("");

    const t = report.totals;
    const totalBasis = t.opening_wdv + t.additions_180_plus + t.additions_less_180;
    const netBasis = Math.max(0, totalBasis - t.sale_proceeds);

    tfoot.innerHTML = `
      <tr>
        <th colspan="2">TOTAL (FORM 3CD CLAUSE 18)</th>
        <th class="num">${FA_ENGINE.formatINR(t.opening_wdv)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.additions_180_plus)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.additions_less_180)}</th>
        <th class="num">${FA_ENGINE.formatINR(totalBasis)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.sale_proceeds)}</th>
        <th class="num">${FA_ENGINE.formatINR(netBasis)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.normal_dep)}</th>
        <th class="num">${FA_ENGINE.formatINR(t.additional_dep)}</th>
        <th class="num" style="color:var(--success); font-weight:800;">${FA_ENGINE.formatINR(t.normal_dep + t.additional_dep)}</th>
        <th class="num" style="font-weight:800;">${FA_ENGINE.formatINR(t.closing_wdv)}</th>
        <th></th>
      </tr>
    `;
  }

  // --- 5. Deferred Tax View ---
  function renderDeferredTax() {
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const txns = FA_STORAGE.getTransactions(currentCompany.id);
    const fy = getFYDates(currentFY);
    const taxOpenings = FA_STORAGE.getTaxOpenings(currentCompany.id, currentFY);
    const taxRate = parseFloat(document.getElementById("deferredTaxRateSelect")?.value || "25.17");

    const bookReport = FA_ENGINE.generateBookSchedule(currentCompany, assets, txns, fy.start, fy.end);
    const taxReport = FA_ENGINE.generateTaxSchedule(currentCompany, assets, txns, fy.start, fy.end, taxOpenings, true);
    const defTax = FA_ENGINE.generateDeferredTaxSchedule(bookReport, taxReport, taxRate);

    document.getElementById("dtBookDepr").textContent = FA_ENGINE.formatINR(defTax.bookDepreciation);
    document.getElementById("dtTaxDepr").textContent = FA_ENGINE.formatINR(defTax.taxDepreciation);
    document.getElementById("dtTimingDiff").textContent = FA_ENGINE.formatINR(defTax.timingDifference);
    document.getElementById("dtTaxRateDisplay").textContent = defTax.taxRate + "%";
    
    document.getElementById("dtImpactLabel").textContent = `${defTax.deferredTaxType} for the year:`;
    document.getElementById("dtImpactValue").textContent = FA_ENGINE.formatINR(defTax.taxEffect);

    document.getElementById("dtBookClosing").textContent = FA_ENGINE.formatINR(defTax.bookClosingWDV);
    document.getElementById("dtTaxClosing").textContent = FA_ENGINE.formatINR(defTax.taxClosingWDV);
    document.getElementById("dtCumulativeDiff").textContent = FA_ENGINE.formatINR(defTax.cumulativeDifference);

    // Populate Category-Wise Timing Difference Table
    const dtTbody = document.getElementById("dtCategoryTableBody");
    const dtTfoot = document.getElementById("dtCategoryTableFoot");
    if (dtTbody) {
      dtTbody.innerHTML = (defTax.categoryRows || []).map(cr => `
        <tr>
          <td>
            <strong>${cr.categoryLabel}</strong>
            <div class="cell-sub">Block: ${cr.blockCode}</div>
          </td>
          <td class="num">${FA_ENGINE.formatINR(cr.bookDep)}</td>
          <td class="num">${FA_ENGINE.formatINR(cr.taxDep)}</td>
          <td class="num" style="${cr.diff >= 0 ? 'color:var(--primary);' : 'color:var(--warning);'} font-weight:700;">
            ${FA_ENGINE.formatINR(cr.diff)}
          </td>
          <td>
            <span class="badge ${cr.type.includes('Asset') ? 'badge-active' : 'badge-amber'}">${cr.type}</span>
          </td>
          <td class="num"><strong>${FA_ENGINE.formatINR(cr.effect)}</strong></td>
        </tr>
      `).join("");

      if (dtTfoot) {
        dtTfoot.innerHTML = `
          <tr>
            <th>TOTAL WORKING</th>
            <th class="num">${FA_ENGINE.formatINR(defTax.bookDepreciation)}</th>
            <th class="num">${FA_ENGINE.formatINR(defTax.taxDepreciation)}</th>
            <th class="num" style="color:var(--primary); font-weight:800;">${FA_ENGINE.formatINR(defTax.timingDifference)}</th>
            <th><span class="badge ${defTax.deferredTaxType.includes('Asset') ? 'badge-active' : 'badge-amber'}">${defTax.deferredTaxType}</span></th>
            <th class="num" style="font-weight:800;">${FA_ENGINE.formatINR(defTax.taxEffect)}</th>
          </tr>
        `;
      }
    }
  }

  // --- 6. Operations Hub & Transactions Audit Trail ---
  function renderTransactionsTable() {
    const txns = FA_STORAGE.getTransactions(currentCompany.id);
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const tbody = document.getElementById("txnsTableBody");
    const typeFilter = document.getElementById("txnTypeFilter")?.value || "";

    if (!txns.length) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 36px;">No lifecycle operations recorded yet. Use the Action Launchpad above to record an acquisition, capex addition, transfer, or disposal.</td></tr>`;
      return;
    }

    let filtered = [...txns];
    if (typeFilter) {
      filtered = filtered.filter(t => t.txn_type === typeFilter);
    }
    const sorted = filtered.sort((a, b) => new Date(b.txn_date) - new Date(a.txn_date));

    if (!sorted.length) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 36px;">No transactions found matching the selected type filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = sorted.map(t => {
      const asset = assets.find(a => a.asset_code === t.asset_code);
      const name = asset ? asset.asset_name : "—";
      const isVoided = Boolean(t.voided_at);

      // Determine details text
      let details = t.remarks || "";
      if (t.counterparty) details += ` (Counterparty: ${t.counterparty})`;
      if (t.new_location || t.new_department || t.new_custodian) {
        details += ` → Relocated to: ${[t.new_location, t.new_department, t.new_custodian].filter(Boolean).join(", ")}`;
      }

      return `
        <tr style="${isVoided ? 'opacity: 0.5; text-decoration: line-through;' : ''}">
          <td><strong>${t.id}</strong></td>
          <td>${FA_ENGINE.formatDateDisplay(t.txn_date)}</td>
          <td><div class="cell-title">${t.asset_code}</div><div class="cell-sub">${name}</div></td>
          <td><span class="badge ${t.txn_type.includes('Disposal') ? 'badge-disposed' : (t.txn_type === 'Transfer' ? 'badge-blue' : 'badge-active')}">${t.txn_type}</span></td>
          <td>${t.reference || "—"}</td>
          <td class="num">${t.amount ? FA_ENGINE.formatINR(t.amount) : "—"}</td>
          <td class="num">${t.proceeds ? FA_ENGINE.formatINR(t.proceeds) : "—"}</td>
          <td>${details || "—"}</td>
          <td>
            ${isVoided ? `<span class="badge badge-disposed">Reversed</span><div class="cell-sub">${t.void_reason || ""}</div>` : `<span class="badge badge-active">Recorded</span>`}
          </td>
          <td style="text-align: right;">
            ${!isVoided ? `<button class="btn btn-sm btn-secondary" onclick="APP.promptVoidTxn('${t.id}')" title="Reverse / Undo Transaction">↩️ Reverse</button>` : "—"}
          </td>
        </tr>
      `;
    }).join("");
  }

  // --- Operations Quick Launchers ---
  function openQuickCapexModal() { openRecordTxnModal("", "Cost Addition"); }
  function openQuickTransferModal() { openRecordTxnModal("", "Transfer"); }
  function openQuickCapitaliseModal() { openRecordTxnModal("", "Capitalise CWIP"); }
  function openQuickDisposalModal() { openRecordTxnModal("", "Disposal / Sale"); }
  function openQuickScrapModal() { openRecordTxnModal("", "Scrap"); }
  function openQuickWriteOffModal() { openRecordTxnModal("", "Write-Off"); }
  function scrollToAuditTrail() {
    const el = document.getElementById("auditTrailSection");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  // --- Asset CRUD & Lifecycle Modal Handlers ---
  function openAddAssetModal() {
    document.getElementById("assetForm").reset();
    document.getElementById("formAssetOriginalCode").value = "";
    document.getElementById("assetModalTitle").textContent = "Add Fixed Asset";
    document.getElementById("formAssetCode").disabled = false;
    document.getElementById("formStatus").value = "Active";
    document.getElementById("formBookMethod").value = "SLM";
    document.getElementById("formResidualPct").value = 5;
    document.getElementById("formOpeningAccumDep").value = 0;
    document.getElementById("formShiftType").value = "Single";
    openModal("assetModal");
  }

  function openEditAssetModal(assetCode) {
    const asset = FA_STORAGE.getAsset(currentCompany.id, assetCode);
    if (!asset) return;

    document.getElementById("assetModalTitle").textContent = `Edit Asset: ${asset.asset_code}`;
    document.getElementById("formAssetOriginalCode").value = asset.asset_code;
    document.getElementById("formAssetCode").value = asset.asset_code;
    document.getElementById("formAssetCode").disabled = true; // Key cannot change

    document.getElementById("formAssetTag").value = asset.asset_tag || "";
    document.getElementById("formAssetName").value = asset.asset_name || "";
    document.getElementById("formCategory").value = asset.category || "";
    document.getElementById("formSubCategory").value = asset.sub_category || "";
    document.getElementById("formStatus").value = asset.status || "Active";
    document.getElementById("formMakeModel").value = asset.make_model || "";
    document.getElementById("formSerialNumber").value = asset.serial_number || "";
    document.getElementById("formParentAssetCode").value = asset.parent_asset_code || "";

    document.getElementById("formLocation").value = asset.location || "";
    document.getElementById("formDepartment").value = asset.department || "";
    document.getElementById("formCostCentre").value = asset.cost_centre || "";
    document.getElementById("formCustodian").value = asset.custodian || "";
    document.getElementById("formVendor").value = asset.vendor || "";
    document.getElementById("formInvoiceNumber").value = asset.invoice_number || "";
    document.getElementById("formPoNumber").value = asset.po_number || "";

    document.getElementById("formPurchaseDate").value = asset.purchase_date || "";
    document.getElementById("formReadyToUseDate").value = asset.ready_to_use_date || "";
    document.getElementById("formPutToUseDate").value = asset.put_to_use_date || "";
    document.getElementById("formAcquisitionCost").value = asset.acquisition_cost || 0;
    document.getElementById("formOpeningAccumDep").value = asset.opening_accum_dep || 0;
    document.getElementById("formOpeningBalanceDate").value = asset.opening_balance_date || "";

    document.getElementById("formScheduleClass").value = asset.schedule_class || "";
    document.getElementById("formBookMethod").value = asset.book_method || "SLM";
    document.getElementById("formUsefulLife").value = asset.useful_life_years || "";
    document.getElementById("formResidualPct").value = asset.residual_value_pct ?? 5;
    document.getElementById("formShiftType").value = asset.shift_type || "Single";
    document.getElementById("formBookOverrideReason").value = asset.book_override_reason || "";

    document.getElementById("formTaxBlockCode").value = asset.tax_block_code || "";
    document.getElementById("formTaxCustomRate").value = asset.tax_custom_rate || "";
    document.getElementById("formTaxActualCost").value = asset.tax_actual_cost || "";
    document.getElementById("formAdditionalDepEligible").checked = Boolean(asset.additional_dep_eligible);
    document.getElementById("formNotes").value = asset.notes || "";

    openModal("assetModal");
  }

  function onFormPurchaseDateChange(purchaseDateVal) {
    const readyField = document.getElementById("formReadyToUseDate");
    const ptuField = document.getElementById("formPutToUseDate");
    if (!readyField.value && purchaseDateVal) readyField.value = purchaseDateVal;
    if (!ptuField.value && purchaseDateVal) ptuField.value = purchaseDateVal;
  }

  function onFormScheduleClassChange(classKey) {
    if (!classKey) return;
    const item = STATUTORY_DATA.SCHEDULE_II_CLASSES[classKey];
    if (item) {
      if (item.life !== null) {
        document.getElementById("formUsefulLife").value = item.life;
      }
      if (item.category && !document.getElementById("formCategory").value) {
        document.getElementById("formCategory").value = item.category;
      }
    }
    // Auto-map tax block
    const defaultTaxBlock = STATUTORY_DATA.DEFAULT_TAX_MAP[classKey];
    if (defaultTaxBlock) {
      document.getElementById("formTaxBlockCode").value = defaultTaxBlock;
    }
  }

  function onSaveAsset(e) {
    e.preventDefault();
    try {
      const code = document.getElementById("formAssetCode").value.trim();
      const origCode = document.getElementById("formAssetOriginalCode").value.trim();

      const assetData = {
        asset_code: code,
        asset_tag: document.getElementById("formAssetTag").value.trim(),
        asset_name: document.getElementById("formAssetName").value.trim(),
        category: document.getElementById("formCategory").value.trim(),
        sub_category: document.getElementById("formSubCategory").value.trim(),
        status: document.getElementById("formStatus").value,
        make_model: document.getElementById("formMakeModel").value.trim(),
        serial_number: document.getElementById("formSerialNumber").value.trim(),
        parent_asset_code: document.getElementById("formParentAssetCode").value.trim(),
        location: document.getElementById("formLocation").value.trim(),
        department: document.getElementById("formDepartment").value.trim(),
        cost_centre: document.getElementById("formCostCentre").value.trim(),
        custodian: document.getElementById("formCustodian").value.trim(),
        vendor: document.getElementById("formVendor").value.trim(),
        invoice_number: document.getElementById("formInvoiceNumber").value.trim(),
        po_number: document.getElementById("formPoNumber").value.trim(),
        purchase_date: document.getElementById("formPurchaseDate").value,
        ready_to_use_date: document.getElementById("formReadyToUseDate").value || document.getElementById("formPurchaseDate").value,
        put_to_use_date: document.getElementById("formPutToUseDate").value,
        acquisition_cost: parseFloat(document.getElementById("formAcquisitionCost").value) || 0,
        opening_accum_dep: parseFloat(document.getElementById("formOpeningAccumDep").value) || 0,
        opening_balance_date: document.getElementById("formOpeningBalanceDate").value,
        schedule_class: document.getElementById("formScheduleClass").value,
        book_method: document.getElementById("formBookMethod").value,
        useful_life_years: parseFloat(document.getElementById("formUsefulLife").value) || null,
        residual_value_pct: parseFloat(document.getElementById("formResidualPct").value) ?? 5,
        shift_type: document.getElementById("formShiftType").value,
        book_override_reason: document.getElementById("formBookOverrideReason").value.trim(),
        tax_block_code: document.getElementById("formTaxBlockCode").value,
        tax_custom_rate: parseFloat(document.getElementById("formTaxCustomRate").value) || null,
        tax_actual_cost: parseFloat(document.getElementById("formTaxActualCost").value) || parseFloat(document.getElementById("formAcquisitionCost").value) || 0,
        additional_dep_eligible: document.getElementById("formAdditionalDepEligible").checked ? 1 : 0,
        notes: document.getElementById("formNotes").value.trim()
      };

      FA_STORAGE.saveAsset(currentCompany.id, assetData);
      closeModal("assetModal");
      renderActiveTab();
      alert(`Asset '${assetData.asset_code}' saved successfully.`);
    } catch (err) {
      alert("Error saving asset: " + err.message);
    }
  }

  function confirmDeleteAsset(assetCode) {
    if (confirm(`Are you sure you want to delete asset '${assetCode}'?\nNote: Genuine sales/scraps should be recorded via 'Exit' instead of deletion.`)) {
      FA_STORAGE.deleteAsset(currentCompany.id, assetCode);
      renderActiveTab();
    }
  }

  // --- Lifecycle Transactions Handlers ---
  function openRecordTxnModal(assetCode = "", defaultType = "Disposal / Sale") {
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const select = document.getElementById("txnAssetCode");
    select.innerHTML = `<option value="">-- Choose Asset --</option>` +
      assets.map(a => `<option value="${a.asset_code}" ${a.asset_code === assetCode ? "selected" : ""}>${a.asset_code} · ${a.asset_name} (${a.status})</option>`).join("");

    document.getElementById("txnType").value = defaultType;
    document.getElementById("txnDate").value = new Date().toISOString().split("T")[0];
    onTxnTypeChange(defaultType);
    openModal("txnModal");
  }

  function openDisposalModal(assetCode) {
    openRecordTxnModal(assetCode, "Disposal / Sale");
  }

  function openCapitaliseModal(assetCode) {
    openRecordTxnModal(assetCode, "Capitalise CWIP");
  }

  function openCostAdditionModal(assetCode) {
    openRecordTxnModal(assetCode, "Cost Addition");
  }

  function onTxnTypeChange(type) {
    const dispBox = document.getElementById("txnDisposalFields");
    const addBox = document.getElementById("txnAdditionFields");
    const trfBox = document.getElementById("txnTransferFields");

    dispBox.style.display = ["Disposal / Sale", "Scrap", "Write-Off"].includes(type) ? "grid" : "none";
    addBox.style.display = type === "Cost Addition" ? "grid" : "none";
    trfBox.style.display = type === "Transfer" ? "grid" : "none";
  }

  function onTxnAssetChange(assetCode) {
    // Optional helper
  }

  function onSaveTransaction(e) {
    e.preventDefault();
    try {
      const type = document.getElementById("txnType").value;
      const assetCode = document.getElementById("txnAssetCode").value;
      const date = document.getElementById("txnDate").value;

      if (!assetCode) throw new Error("Please select an asset.");
      if (!date) throw new Error("Transaction date is required.");

      const txnData = {
        asset_code: assetCode,
        txn_type: type,
        txn_date: date,
        reference: document.getElementById("txnReference").value.trim(),
        remarks: document.getElementById("txnRemarks").value.trim(),
        proceeds: parseFloat(document.getElementById("txnProceeds").value) || 0,
        transfer_expenses: parseFloat(document.getElementById("txnTransferExpenses").value) || 0,
        counterparty: document.getElementById("txnCounterparty").value.trim(),
        amount: parseFloat(document.getElementById("txnAmount").value) || 0,
        tax_amount: parseFloat(document.getElementById("txnTaxAmount").value) || null,
        new_location: document.getElementById("txnNewLocation").value.trim(),
        new_department: document.getElementById("txnNewDept").value.trim(),
        new_cost_centre: document.getElementById("txnNewCostCentre").value.trim(),
        new_custodian: document.getElementById("txnNewCustodian").value.trim()
      };

      FA_STORAGE.addTransaction(currentCompany.id, txnData);
      closeModal("txnModal");
      renderActiveTab();
      alert(`Transaction '${type}' recorded successfully for asset ${assetCode}.`);
    } catch (err) {
      alert("Error recording transaction: " + err.message);
    }
  }

  function promptVoidTxn(txnId) {
    const reason = prompt("Enter the reason for reversing this transaction:");
    if (reason !== null && reason.trim()) {
      FA_STORAGE.voidTransaction(currentCompany.id, txnId, reason.trim());
      renderActiveTab();
    }
  }

  // --- Bulk Import Handling ---
  function setupDragAndDrop() {
    const zone = document.getElementById("uploadZone");
    if (!zone) return;

    ["dragenter", "dragover"].forEach(eventName => {
      zone.addEventListener(eventName, e => {
        e.preventDefault();
        zone.classList.add("dragover");
      }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
      zone.addEventListener(eventName, e => {
        e.preventDefault();
        zone.classList.remove("dragover");
      }, false);
    });

    zone.addEventListener("drop", e => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        onFileSelected(files[0]);
      }
    });
  }

  async function onFileSelected(file) {
    if (!file) return;
    try {
      const existingAssets = FA_STORAGE.getAssets(currentCompany.id);
      const res = await FA_EXCEL_IO.parseAndValidateFile(file, existingAssets);
      pendingImportData = res;

      const reportBox = document.getElementById("importValidationReport");
      const summaryTitle = document.getElementById("importSummaryTitle");
      const errorAlert = document.getElementById("importErrorAlert");
      const errorText = document.getElementById("importErrorSummaryText");
      const errorTableWrap = document.getElementById("importErrorTableWrap");
      const errorTableBody = document.getElementById("importErrorTableBody");

      reportBox.style.display = "block";
      summaryTitle.innerHTML = `File Analyzed: <strong>${file.name}</strong> · Total Rows: <strong>${res.totalRows}</strong> (Valid: <strong>${res.validRows.length}</strong>, Issues: <strong>${res.errorRows.length}</strong>)`;

      if (res.hasErrors) {
        errorAlert.style.display = "flex";
        errorText.innerHTML = `Found <strong>${res.errorRows.length}</strong> row(s) with errors. Only valid rows will be imported.`;
        errorTableWrap.style.display = "block";
        errorTableBody.innerHTML = res.errorRows.map(e => `
          <tr>
            <td><strong>Row ${e.rowNumber}</strong></td>
            <td>${e.assetCode}</td>
            <td>${e.assetName}</td>
            <td style="color:var(--danger);">${e.errors.join("; ")}</td>
          </tr>
        `).join("");
      } else {
        errorAlert.style.display = "none";
        errorTableWrap.style.display = "none";
      }

      document.getElementById("btnConfirmImport").disabled = res.validRows.length === 0;
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  }

  function confirmImport() {
    if (!pendingImportData || !pendingImportData.validRows.length) return;
    const overwrite = document.getElementById("importOverwriteCheckbox").checked;

    let existing = FA_STORAGE.getAssets(currentCompany.id);
    const existingMap = new Map(existing.map(a => [a.asset_code.toUpperCase(), a]));

    pendingImportData.validRows.forEach(row => {
      const key = row.asset_code.toUpperCase();
      if (existingMap.has(key)) {
        if (overwrite) {
          existingMap.set(key, { ...existingMap.get(key), ...row });
        }
      } else {
        existingMap.set(key, row);
      }
    });

    FA_STORAGE.saveAssets(currentCompany.id, Array.from(existingMap.values()));
    closeModal("importModal");
    pendingImportData = null;
    renderActiveTab();
    alert(`Successfully imported ${pendingImportData ? pendingImportData.validRows.length : "assets"} into ${currentCompany.name}.`);
  }

  // --- 1-Click Load Sample Portfolio ---
  function loadSamplePortfolio() {
    if (confirm("Load 16 realistic CA sample assets (IT hardware, factory premises, CNC machinery, vehicles, solar systems, CWIP)?\nThis will reset the current entity to CA Ashish Tripathi's benchmark test portfolio.")) {
      FA_STORAGE.resetCompanyToSample(currentCompany.id);
      renderActiveTab();
      alert("Benchmark CA Portfolio loaded successfully with 16 diverse assets!");
    }
  }

  // --- Tax Opening Balances Modal ---
  function openTaxOpeningModal() {
    const fyYear = currentFY;
    const openings = FA_STORAGE.getTaxOpenings(currentCompany.id, fyYear);
    const container = document.getElementById("taxOpeningBlocksContainer");

    container.innerHTML = Object.keys(STATUTORY_DATA.TAX_BLOCKS).map(code => {
      const def = STATUTORY_DATA.TAX_BLOCKS[code];
      const val = openings[code] || "";
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-light);">
          <div>
            <strong>${def.label}</strong>
            <div class="cell-sub">Code: ${code} (${def.rate !== null ? def.rate + "%" : "Custom"})</div>
          </div>
          <div style="width: 180px;">
            <input type="number" step="0.01" min="0" class="form-control tax-open-input" data-code="${code}" placeholder="₹ Opening WDV" value="${val}">
          </div>
        </div>
      `;
    }).join("");

    openModal("taxOpeningModal");
  }

  function saveTaxOpenings() {
    const openings = {};
    document.querySelectorAll(".tax-open-input").forEach(input => {
      const code = input.getAttribute("data-code");
      const val = parseFloat(input.value);
      if (!isNaN(val) && val > 0) {
        openings[code] = val;
      }
    });

    FA_STORAGE.saveTaxOpenings(currentCompany.id, currentFY, openings);
    closeModal("taxOpeningModal");
    renderActiveTab();
    alert("Income Tax Opening Block WDV saved successfully.");
  }

  // --- Company Profile Modal ---
  function openCompanyModal() {
    document.getElementById("compName").value = currentCompany.name || "";
    document.getElementById("compSector").value = currentCompany.sector || "Manufacturing";
    document.getElementById("compCin").value = currentCompany.cin || "";
    document.getElementById("compPan").value = currentCompany.pan || "";
    document.getElementById("compGstin").value = currentCompany.gstin || "";
    openModal("companyModal");
  }

  function onSaveCompany(e) {
    e.preventDefault();
    currentCompany.name = document.getElementById("compName").value.trim();
    currentCompany.legal_name = document.getElementById("compName").value.trim();
    currentCompany.sector = document.getElementById("compSector").value;
    currentCompany.cin = document.getElementById("compCin").value.trim();
    currentCompany.pan = document.getElementById("compPan").value.trim();
    currentCompany.gstin = document.getElementById("compGstin").value.trim();

    FA_STORAGE.saveCompany(currentCompany);
    populateCompanySelector();
    updateEntityLabels();
    closeModal("companyModal");
    renderActiveTab();
    alert("Entity profile updated successfully.");
  }

  function onDeleteCompany() {
    if (confirm(`Are you sure you want to delete entity '${currentCompany.name}' and all its assets?`)) {
      try {
        FA_STORAGE.deleteCompany(currentCompany.id);
        currentCompany = FA_STORAGE.getActiveCompany();
        populateCompanySelector();
        updateEntityLabels();
        closeModal("companyModal");
        renderActiveTab();
      } catch (err) {
        alert(err.message);
      }
    }
  }

  function onCompanyChange(val) {
    if (val === "__NEW__") {
      const name = prompt("Enter new entity / client company name:");
      if (name && name.trim()) {
        const newComp = FA_STORAGE.saveCompany({
          name: name.trim(),
          legal_name: name.trim(),
          sector: "Manufacturing"
        });
        FA_STORAGE.setActiveCompany(newComp.id);
        currentCompany = newComp;
        populateCompanySelector();
        updateEntityLabels();
        renderActiveTab();
      } else {
        populateCompanySelector();
      }
    } else {
      FA_STORAGE.setActiveCompany(val);
      currentCompany = FA_STORAGE.getActiveCompany();
      updateEntityLabels();
      renderActiveTab();
    }
  }

  function onFYChange(val) {
    currentFY = parseInt(val, 10);
    updateEntityLabels();
    renderActiveTab();
  }

  // --- Backup & Restore ---
  function openBackupModal() {
    openModal("backupModal");
  }

  function exportBackupJSON() {
    const jsonStr = FA_STORAGE.exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `cajob_FAR_Backup_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  }

  function importBackupJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        FA_STORAGE.importAllDataJSON(e.target.result);
        currentCompany = FA_STORAGE.getActiveCompany();
        populateCompanySelector();
        updateEntityLabels();
        closeModal("backupModal");
        renderActiveTab();
        alert("Backup restored successfully!");
      } catch (err) {
        alert("Error restoring backup: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  // --- Modal Helpers ---
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add("active");
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove("active");
  }

  function openTemplateModal() { openModal("templateModal"); }
  function openImportModal() { openModal("importModal"); }

  // --- Export Actions ---
  function exportCompaniesActSchedule() {
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const txns = FA_STORAGE.getTransactions(currentCompany.id);
    const fy = getFYDates(currentFY);
    const report = FA_ENGINE.generateBookSchedule(currentCompany, assets, txns, fy.start, fy.end);
    FA_EXCEL_IO.exportCompaniesActScheduleXLSX(report, currentCompany);
  }

  function exportTaxSchedule() {
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const txns = FA_STORAGE.getTransactions(currentCompany.id);
    const fy = getFYDates(currentFY);
    const taxOpenings = FA_STORAGE.getTaxOpenings(currentCompany.id, currentFY);
    const includeAddl = document.getElementById("includeAdditionalDepCheckbox")?.checked ?? true;
    const report = FA_ENGINE.generateTaxSchedule(currentCompany, assets, txns, fy.start, fy.end, taxOpenings, includeAddl);
    FA_EXCEL_IO.exportIncomeTaxScheduleXLSX(report, currentCompany);
  }

  function exportDeferredTax() {
    const assets = FA_STORAGE.getAssets(currentCompany.id);
    const txns = FA_STORAGE.getTransactions(currentCompany.id);
    const fy = getFYDates(currentFY);
    const taxOpenings = FA_STORAGE.getTaxOpenings(currentCompany.id, currentFY);
    const taxRate = parseFloat(document.getElementById("deferredTaxRateSelect")?.value || "25.17");

    const bookReport = FA_ENGINE.generateBookSchedule(currentCompany, assets, txns, fy.start, fy.end);
    const taxReport = FA_ENGINE.generateTaxSchedule(currentCompany, assets, txns, fy.start, fy.end, taxOpenings, true);
    const defTax = FA_ENGINE.generateDeferredTaxSchedule(bookReport, taxReport, taxRate);
    FA_EXCEL_IO.exportDeferredTaxComparisonXLSX(defTax, bookReport, taxReport, currentCompany);
  }

  return {
    init,
    switchTab,
    onCompanyChange,
    onFYChange,
    renderAssetsTable,
    renderTaxSchedule,
    renderDeferredTax,
    openAddAssetModal,
    openEditAssetModal,
    openDisposalModal,
    openCapitaliseModal,
    openCostAdditionModal,
    openRecordTxnModal,
    openQuickCapexModal,
    openQuickTransferModal,
    openQuickCapitaliseModal,
    openQuickDisposalModal,
    openQuickScrapModal,
    openQuickWriteOffModal,
    scrollToAuditTrail,
    renderTransactionsTable,
    renderBookSchedule,
    onSaveAsset,
    confirmDeleteAsset,
    onFormPurchaseDateChange,
    onFormScheduleClassChange,
    onTxnTypeChange,
    onTxnAssetChange,
    onSaveTransaction,
    promptVoidTxn,
    onFileSelected,
    confirmImport,
    loadSamplePortfolio,
    openTaxOpeningModal,
    saveTaxOpenings,
    openCompanyModal,
    onSaveCompany,
    onDeleteCompany,
    openBackupModal,
    exportBackupJSON,
    importBackupJSON,
    openModal,
    closeModal,
    openTemplateModal,
    openImportModal,
    exportCompaniesActSchedule,
    exportTaxSchedule,
    exportDeferredTax
  };
})();

window.addEventListener("DOMContentLoaded", APP.init);
