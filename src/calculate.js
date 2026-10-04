export function calculateLoan(principal, annualRate, monthlyPayment) {
  let balance = Math.round(principal * 100);
  const payment = Math.round(monthlyPayment * 100);

  const monthlyRate = annualRate / 100 / 12;

  let month = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;

  const schedule = [];

  const firstMonthInterest = Math.round(balance * monthlyRate);
  const payoffDate = new Date();


  if (payment <= firstMonthInterest) {
    return {
      error: "Monthly payment is too low to pay off this loan.",
      schedule: []
    };
  }

  while (balance > 0 && month < 1200) {
    month++;

    const interest = Math.round(balance * monthlyRate);

    let principalPaid = payment - interest;

    if (principalPaid > balance) {
      principalPaid = balance;
    }

    const actualPayment = principalPaid + interest;

    balance -= principalPaid;

    totalInterest += interest;
    totalPrincipal += principalPaid;

    schedule.push({
      month: month,
      payment: actualPayment / 100,
      principal: principalPaid / 100,
      interest: interest / 100,
      balance: balance / 100,
      cumulativeInterest: totalInterest / 100,
      cumulativePrincipal: totalPrincipal / 100
    });

  }

  if (balance > 0) {
    return {
      error: "Loan payoff exceeds 100 years.",
      schedule
    }
  }

  payoffDate.setMonth(payoffDate.getMonth() + month);

  return {
    error: null,
    months: month,
    totalInterest: totalInterest / 100,
    totalPrincipal: totalPrincipal / 100,
    payoffDate,
    schedule
  };
}
