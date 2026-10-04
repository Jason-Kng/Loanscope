# LoanScope

LoanScope is a React web application that allows users to explore how a loan changes based on the starting principal, annual interest rate, and monthly payment.

The application calculates the loan payoff time, payoff date, total interest paid, and generates an amortization schedule. It also displays the remaining loan balance over time using an interactive chart.

## Features

- Adjust loan principal, interest rate, and monthly payment using sliders or numeric inputs
- Calculate loan payoff time and payoff date
- Calculate total interest paid
- Display remaining loan balance over time
- Toggle cumulative interest on the loan chart
- Display a month-by-month amortization schedule
- Export the amortization schedule as a CSV file
- Share a loan scenario using URL parameters

## Requirements

Before running the project, make sure the following are installed:

- Node.js
- npm

## Running the Project

1. Clone or download the repository.

2. Open a terminal in the project directory.

3. Install the project dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL displayed in the terminal in a web browser. Vite will typically use:

```text
http://localhost:5173/
```

## Disclaimer

LoanScope provides illustrative loan estimates only and is not financial advice. Actual lender terms may differ due to fees, escrow, or different compounding methods.

