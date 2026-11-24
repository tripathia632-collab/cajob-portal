# cajob.in | Fixed Asset Register & Depreciation Engine

> **Architect & Lead Developer:** CA Ashish Tripathi  
> **Brand & Platform:** [cajob.in](https://cajob.in)  
> **Statutory Framework:** Companies Act, 2013 (Schedule II) & Income Tax Act, 1961 (Sections 32, 43(6), 50)

---

## 🌟 Overview

The **cajob.in Fixed Asset Register & Depreciation Engine** is an enterprise-grade, audit-ready web application designed for Chartered Accountants, CFOs, corporate finance teams, and tax practitioners in India. It serves as one of the flagship tools in the **cajob.in** professional financial suite.

It bridges the statutory gap between **Companies Act, 2013** accounting standards (AS 10 / Ind AS 16) and **Income Tax Act, 1961** rules, automating daily pro-rata calculations, block movements, shift adjustments, 180-day rule splitting, and deferred tax computation.

---

## 🏛️ Statutory Principles Implemented

### 1. Companies Act, 2013 (Schedule II & AS 10 / Ind AS 16)
- **Depreciation Commencing Date:** As mandated under AS 10 (Revised) and Ind AS 16, depreciation commences from the **Ready for Use Date** (the date the asset is in the location and condition necessary for it to be capable of operating), even if commercial operations or production begin on a later date.
- **Schedule II Part C Asset Classes:** Pre-configured with statutory useful lives across Buildings (RCC 60y, Factory 30y), Plant & Machinery (General 15y, Continuous Process 25y), Computers (Desktops/Laptops 3y, Servers 6y), Furniture (General 10y, Hotels/Schools 8y), Vehicles (Motor cars 8y, Commercial hire 6y, Two-wheelers 10y), Office Equipment (5y), and Intangibles.
- **Depreciation Methods:**
  - **Straight Line Method (SLM):** Depreciable Amount = `Cost - Residual Value (5%)`, amortized daily based on actual days in the financial year.
  - **Written Down Value (WDV):** Statutory rate derived using the Schedule II formula:  
    $$R = \left[1 - \left(\frac{s}{c}\right)^{1/n}\right] \times 100$$  
    *(where $s$ = residual value, $c$ = cost, $n$ = useful life in years)*.
- **Shift Depreciation:** Note 3 of Schedule II implemented for Plant & Machinery:
  - Single Shift: Normal (1.0x)
  - Double Shift: +50% Depreciation (1.5x)
  - Triple Shift: +100% Depreciation (2.0x)
- **Residual Value Floor:** Enforces the 5% statutory floor—depreciation strictly stops when carrying amount reaches residual value.
- **Leap Year Daily Pro-Rata:** Uses 366 days for leap financial years (e.g., FY 2023-24, FY 2027-28) and 365 days otherwise.

### 2. Income Tax Act, 1961 (Section 32, Section 43(6), Section 50)
- **Depreciation Commencing Date:** Depreciation is allowed only from the date the asset is **actually Put to Use** for business purposes.
- **Block of Assets Concept:** Computes aggregate depreciation on each statutory tax block (Buildings 5%, 10%, 40%; Furniture 10%; Plant & Machinery 15%; Commercial Vehicles 30%; Computers & Software 40%; Intangibles 25%; Custom blocks).
- **180-Day Rule:**
  - Additions used for **$\ge$ 180 days** receive **100%** of statutory rate.
  - Additions used for **$<$ 180 days** receive **50%** half-rate.
- **Additional Depreciation u/s 32(1)(iia):** 20% on new plant & machinery for manufacturing / power entities. If put to use for $<$ 180 days, 10% is allowed in year 1, and the balance 10% is automatically flagged for carry-forward under the second proviso to Section 32(1)(ii).
- **Moneys Payable Deductions u/s 43(6):** Net sale/scrap proceeds deducted from the block basis.
- **Short Term Capital Gains (STCG) u/s 50:**
  - If moneys payable exceed `Opening WDV + Additions`, excess is treated as STCG and Closing WDV becomes NIL.
  - If all assets in a block are transferred (block ceases to exist), the difference is STCG/STCL and Closing WDV becomes NIL.

### 3. Deferred Tax (AS 22 / Ind AS 12)
- Compares Books Depreciation against Income Tax Depreciation.
- Computes timing difference and calculates **Deferred Tax Asset (DTA)** or **Deferred Tax Liability (DTL)** at selectable corporate tax rates (25.17%, 26%, 29.12%, 31.20%, 34.944%).

---

## 🚀 Key Features

1. **Complete Fixed Asset Register Master:**  
   Captures Asset ID, Tag/Barcode, Name, Category, Sub-Category, Parent Asset (Component Accounting), Location, Department, Cost Centre, Custodian, Vendor, Invoice/PO numbers, Purchase Date, Ready for Use Date, Put to Use Date, and Capitalised Cost.
2. **Built-in Excel & CSV Template Generation:**  
   One-click download of the official pre-formatted Excel template (`cajob_fixed_asset_import_template.xlsx`) featuring an import data entry sheet and an extensive statutory guidance sheet.
3. **Bulk Upload with Row-by-Row Validation:**  
   Drag-and-drop Excel or CSV files. Automatically validates every single row, flags missing fields, invalid dates, negative amounts, or logic errors with exact row numbers and issue descriptions.
4. **1-Click CA Benchmark Sample Portfolio:**  
   Instantly loads 16 diverse, real-world Indian business assets (Laptops, Cloud ERP Servers, Factory Buildings, CNC Machinery, Executive Cars, Commercial Delivery Trucks, 100kW Solar Rooftop, and CWIP) for immediate live demonstration.
5. **Lifecycle Management:**  
   Record Disposals, Scrapping, Write-Offs, Subsequent Capex Additions, Capitalisation of CWIP, and Custodian/Location Transfers with a full audit log and reversal capability.
6. **Multi-Company & Multi-FY Management:**  
   Switch between multiple corporate entities and financial years with carried-forward opening balances.
7. **Full Excel (.xlsx) Exports:**  
   Export Asset Master, Schedule II Balance Sheet Schedule, Form 3CD Clause 18 Tax Audit Schedule, and Deferred Tax workings.

---

## 🌐 How to Host on cajob.in

This application is designed with a **100% self-contained, zero-dependency architecture**. It can be deployed in multiple flexible ways:

### Option A: Static Hosting on cajob.in (Recommended)
Simply upload the application directory to your web server:
- **cPanel / Apache / Nginx / Cloudflare Pages / Vercel / Netlify:**  
  Copy all files (`index.html`, `css/`, `js/`, `templates/`, `vendor/`) to your public directory (e.g. `public_html/tools/fixed-asset-register/` or domain root).
- **WordPress Embed:**  
  Upload the folder to your `wp-content/` directory or embed it seamlessly inside any WordPress page using an `<iframe>`:
  ```html
  <iframe src="/tools/fixed-asset-register/" width="100%" height="900px" frameborder="0"></iframe>
  ```

### Option B: Local or VPS Python Server
Run the included zero-dependency Python 3 server:
```bash
python3 server.py
```
Or specify a custom port:
```bash
PORT=3000 python3 server.py
```

---

## 📁 Project Structure

```
Fixed asset register/
├── index.html                           # Single Page Application
├── css/
│   └── styles.css                       # Modern CA Fintech design system
├── js/
│   ├── statutory_data.js                # Schedule II classes, IT blocks, sample assets
│   ├── engine.js                        # Pro-rata math, 180-day rule, block calculation
│   ├── storage.js                       # Local persistence & multi-company manager
│   ├── excel_io.js                      # SheetJS template builder, parser, & exporter
│   └── app.js                           # UI controller, charts, modals, & tables
├── templates/
│   ├── cajob_fixed_asset_import_template.xlsx  # Pre-generated Excel template
│   ├── cajob_fixed_asset_import_template.csv   # Pre-generated CSV template
│   └── cajob_sample_asset_register.xlsx        # Benchmark 16-asset test register
├── vendor/
│   ├── xlsx.full.min.js                 # SheetJS offline bundle
│   └── chart.umd.min.js                 # Chart.js offline bundle
├── server.py                            # Python 3 HTTP runner
└── README.md                            # Documentation
```

---

## 🔒 Data Privacy Guarantee
All data processing and financial calculations happen **purely on the user's client device (browser)**. No sensitive corporate asset details or financial records are stored on third-party servers, ensuring complete confidentiality for Chartered Accountants and their clients.

---

**cajob.in** · *Architected by CA Ashish Tripathi*
