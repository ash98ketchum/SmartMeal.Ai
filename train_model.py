# model.py

import json
from pathlib import Path
from datetime import datetime, timedelta
import numpy as np
from sklearn.linear_model import LinearRegression

# --- file paths ---
ARCHIVE_PATH       = Path("dataformodel.json")
PRED_WEEKLY_PATH   = Path("predicted_weekly.json")
PRED_MONTHLY_PATH  = Path("predicted_monthly.json")
METRICS_WEEKLY     = Path("metrics_weekly.json")
METRICS_MONTHLY    = Path("metrics_monthly.json")

def load_archive():
    if not ARCHIVE_PATH.exists():
        return []
    return json.loads(ARCHIVE_PATH.read_text())

def aggregate(archive):
    archive.sort(key=lambda d: d["date"])
    dates  = [d["date"] for d in archive]
    totals = [sum(item.get("totalPlates",0) for item in d["items"]) for d in archive]
    return dates, totals

def fit_and_forecast(totals, horizon):
    X = np.arange(len(totals)).reshape(-1,1)
    y = np.array(totals)
    model = LinearRegression().fit(X,y)
    future_idxs = np.arange(len(totals), len(totals)+horizon).reshape(-1,1)
    preds = model.predict(future_idxs).clip(min=0)
    return [round(float(p),2) for p in preds]

def make_dates(last_date, n):
    dt = datetime.fromisoformat(last_date)
    return [(dt + timedelta(days=i+1)).date().isoformat() for i in range(n)]

def compute_metrics(dates, totals, preds):
    """
    Build the four metrics you showed:
      1. Accuracy Rate = average(1 - |pred-actual|/actual)
      2. Ingredients Saved = sum of (actual - predicted) plates?
      3. Amount Saved = sum of (actual-predicted)*costPerPlate (estimate)
      4. Successful Predictions = count of days where |error|/actual < threshold
    Here we’ll do rough placeholders—adjust formulas to your real definitions!
    """
    # 1) Accuracy Rate (%)
    rates = []
    for a,p in zip(totals, preds):
        if a > 0:
            rates.append(1 - abs(p - a)/a)
    acc_rate = round(100 * (sum(rates)/len(rates)), 1) if rates else 0

    # 2) Ingredients Saved (plates difference sum)
    ing_saved = round(sum(max(a-p,0) for a,p in zip(totals,preds)))

    # 3) Amount Saved (assume uniform cost per plate = $10 as example)
    AMOUNT_PER_PLATE = 10
    amt_saved = round(ing_saved * AMOUNT_PER_PLATE,2)

    # 4) Successful Predictions (within 10% error)
    success = sum(1 for a,p in zip(totals,preds) if a>0 and abs(p-a)/a < 0.1)

    return [
      {"name":"Accuracy Rate",      "icon":"chart",  "value": acc_rate, "change": 0,   "unit":"%"},
      {"name":"Ingredients Saved",  "icon":"carrot", "value": ing_saved, "change": 0,   "unit":""},
      {"name":"Amount Saved",       "icon":"dollar", "value": amt_saved, "change": 0,   "unit":"$"},
      {"name":"Successful Predictions","icon":"check","value": success,   "change": 0,   "unit":""}
    ]

def main():
    archive = load_archive()
    if len(archive) < 2:
        print("Not enough history to model.")
        return

    dates, totals = aggregate(archive)
    last_date = dates[-1]

    # 1) Forecast
    weekly_preds  = fit_and_forecast(totals, 7)
    monthly_preds = fit_and_forecast(totals, 30)

    weekly_dates  = make_dates(last_date, 7)
    monthly_dates = make_dates(last_date, 30)

    wk_out = [{"date":d,"predictedServings":p} for d,p in zip(weekly_dates, weekly_preds)]
    mo_out = [{"date":d,"predictedServings":p} for d,p in zip(monthly_dates, monthly_preds)]

    # 2) Metrics
    weekly_metrics  = compute_metrics(weekly_dates,  weekly_preds,  weekly_preds)
    monthly_metrics = compute_metrics(monthly_dates, monthly_preds, monthly_preds)

    # 3) Write all four files
    PRED_WEEKLY_PATH.write_text(json.dumps(wk_out, indent=2))
    PRED_MONTHLY_PATH.write_text(json.dumps(mo_out, indent=2))
    METRICS_WEEKLY.write_text(json.dumps(weekly_metrics, indent=2))
    METRICS_MONTHLY.write_text(json.dumps(monthly_metrics, indent=2))

    print(f"[{datetime.now()}] Wrote weekly/monthly predictions & metrics.")

if __name__=="__main__":
    main()
