import { useState, useEffect, useRef } from 'react';
import { calculateLoan } from './calculate.js';
import { CartesianGrid, Tooltip, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from 'recharts';
import './App.css'

function ValueSlider({ min, max, value, onChange, step, id }) {
  const [typedValue, setTypedValue] = useState(value);
  const timer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  function handleSliderChange(e) {
    clearTimeout(timer.current);

    const newValue = Number(e.target.value);

    setTypedValue(newValue);
    onChange(newValue);
  }

  function handleNumberChange(e) {
    const newValue = e.target.value;

    setTypedValue(newValue);
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      if (newValue !== "" && Number.isFinite(Number(newValue))) {
        onChange(Number(newValue));
      }
    }, 300);

  }
  return (
    <>
      <div className="value">
        <input type="range" id={`${id}-slider`} className="slider" min={min} max={max} value={value} onChange={handleSliderChange} step={step} />
        <input type="number" id={`${id}-number`} className="number" min={min} max={max} value={typedValue} onChange={handleNumberChange} step={step} />
      </div>
    </>
  );
}

function App() {
  const params = new URLSearchParams(window.location.search);

  const urlPrincipal = params.has("principal") ? Number(params.get("principal")) : 2500;
  const urlRate = params.has("rate") ? Number(params.get("rate")) : 6.5;
  const urlPayment = params.has("payment") ? Number(params.get("payment")) : 500;


  const [principal, setPrincipal] = useState(urlPrincipal > 0 ? urlPrincipal : 2500);
  const [interestRate, setInterest] = useState(urlRate >= 0 && urlRate <= 40 ? urlRate : 6.5);
  const [monthlyPayment, setPayment] = useState(urlPayment > 0 ? urlPayment : 500);
  const [showInterest, setShowInterest] = useState(false);
  const results = calculateLoan(principal, interestRate, monthlyPayment);

  function exportCSV() {
    const headers = [
      "Month",
      "Payment",
      "Principal",
      "Interest",
      "Remaining Balance"
    ];

    const rows = results.schedule.map((row) => [
      row.month,
      row.payment.toFixed(2),
      row.principal.toFixed(2),
      row.interest.toFixed(2),
      row.balance.toFixed(2)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "loan_schedule.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function shareScenario() {
    const params = new URLSearchParams({
      principal: principal,
      rate: interestRate,
      payment: monthlyPayment
    });

    const shareURL = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareURL);
  }



  return (
    <main className='app'>
      <h1>LoanScope</h1>

      <section className='calculator-card'>

        <div className='input-group'>
          <label>Starting Principal</label>
          <ValueSlider
            id="principal"
            min="1"
            max="100000000"
            value={principal}
            onChange={setPrincipal}
            step="1"
          />
        </div>

        <div className='input-group'>
          <label>Annual Interest Rate</label>
          <ValueSlider
            id="interest"
            min="0"
            max="40"
            value={interestRate}
            onChange={setInterest}
            step="0.01"
          />
        </div>

        <div className='input-group'>
          <label>Monthly Payment</label>
          <ValueSlider
            id="payment"
            min="1"
            max="1000000"
            value={monthlyPayment}
            onChange={setPayment}
            step="1"
          />
        </div>
      </section>


      {results.error ? (
        <p className='error' aria-live="polite">{results.error}</p>
      ) : (
        <>
          <section className="summary">
            <div className="summary-item">
              <span>Principal</span>
              <strong>${principal.toLocaleString()}</strong>
            </div>

            <div className="summary-item">
              <span>Interest Rate</span>
              <strong>{interestRate}%</strong>
            </div>

            <div className="summary-item">
              <span>Monthly Payment</span>
              <strong>${monthlyPayment.toLocaleString()}</strong>
            </div>

            <div className="summary-item">
              <span>Payoff Time</span>
              <strong>{Math.floor(results.months / 12)} years{" "}{results.months % 12} months</strong>
            </div>

            <div className="summary-item">
              <span>Total Interest</span>
              <strong>${results.totalInterest.toLocaleString()}</strong>
            </div>
            <div className="summary-item">
              <span>Payoff Date</span>
              <strong>{results.payoffDate.toLocaleDateString()}</strong>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h2>Loan Balance Over Time</h2>

              <label className="interest-toggle">
                <input
                  type="checkbox"
                  checked={showInterest}
                  onChange={(e) =>
                    setShowInterest(e.target.checked)
                  }
                />
                Show Total Interest Paid
              </label>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={results.schedule}
                  margin={{
                    top: 10,
                    left: 40,
                    right: 30,
                    bottom: 25
                  }}
                >
                  <CartesianGrid />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Month",
                      position: "insideBottom",
                      offset: -10
                    }}
                  />
                  <YAxis />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Remaining Balance"
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="cumulativeInterest"
                    name="Total Interest Paid"
                    dot={false}
                    hide={!showInterest}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <button onClick={exportCSV}>Export CSV</button>
          <button onClick={shareScenario}>Share Scenario</button>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Payment</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>

              <tbody>
                {results.schedule.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>${row.payment.toFixed(2)}</td>
                    <td>${row.principal.toFixed(2)}</td>
                    <td>${row.interest.toFixed(2)}</td>
                    <td>${row.balance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        </>
      )}
      <footer className="disclaimer">
        LoanScope provides illustrative estimates only and is not financial
        advice. Actual lender terms may differ due to fees, escrow, or
        different compounding methods.
      </footer>

    </main>
  )
}

export default App
