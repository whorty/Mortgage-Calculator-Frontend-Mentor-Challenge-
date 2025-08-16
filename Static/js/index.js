document.querySelector('.calculate-btn').addEventListener('click', function (e) {
  // e.preventDefault();
  // form.reportValidity()
  const form = document.querySelector('form');
  let allValid = true;
  document.querySelectorAll('.input-wrapper').forEach(wrapper => {
    const input = wrapper.querySelector('input');
    if (input && !input.checkValidity()) {
      wrapper.classList.add('control--invalid');
      allValid = false;
      form.reportValidity()
    } else {
      wrapper.classList.remove('control--invalid');
    }
  });
  if (allValid) {
    // Get form values
    // Get the value as a string in en-UK format and convert it to a decimal number
    const amountStr = document.getElementById('mortgage-amount').value.replace(/,/g, '');
    const amount = parseFloat(amountStr) || 0;
    const years = parseFloat(document.getElementById('mortgage-term').value);
    const rate = parseFloat(document.getElementById('interest-rate').value);
    const type = form.querySelector('input[name="mortgage-type"]:checked').value;

    let monthly = 0;
    let total = 0;
    const n = years * 12;
    const r = rate / 100 / 12;

    if (type === 'repayment') {
      // Amortization formula
      if (r > 0) {
        monthly = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        total = monthly * n;
      } else {
        monthly = amount / n;
        total = amount;
      }
    } else if (type === 'interest-only') {
      // Interest only
      monthly = amount * r;
      total = (monthly * n) + amount;
    }

    // Show results
    document.getElementById('monthly_value').textContent = monthly.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('repay').textContent = total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (form.requestSubmit) {
      // form.requestSubmit();
      console.log('success');
      document.getElementById('results').classList.add('show');
      document.querySelector('.illustration-section').classList.add('show');
      document.getElementById('empty-state-content').classList.add('empty');
    } else {
      console.log('bad');
    }
  }
});

const interestInput = document.getElementById('interest-rate');

// Allows decimals and only one dot
interestInput.addEventListener('input', function (e) {
  let value = e.target.value;

  // Allow only numbers and one decimal point
  value = value.replace(/[^0-9.]/g, '');

  // Allow only one decimal point
  const firstDot = value.indexOf('.');
  if (firstDot !== -1) {
    // Remove additional dots
    value = value.substring(0, firstDot + 1) + value.substring(firstDot + 1).replace(/\./g, '');
  }

  // Limit to 8 characters
  if (value.length > 8) {
    value = value.slice(0, 8);
  }
  // Do not force the numeric value here to allow writing "0." or "0.0"
  // e.target.value = value;
});

interestInput.addEventListener('blur', function (e) {
  let value = e.target.value;
  if (value !== '') {
    let num = parseFloat(value);
    if (isNaN(num) || num < 0.01) num = 0.01;
    if (num > 100) num = 100;
    e.target.value = num.toFixed(2);
  }
});

const input = document.getElementById("mortgage-amount");

input.addEventListener("input", (e) => {
  // Remove everything that is not a digit or dot
  let valor = e.target.value.replace(/[^0-9.]/g, "");

  if (valor) {
    // Separate integer and decimal part
    let [entero, decimal] = valor.split(".");

    // Format integer part with UK-style commas
    entero = new Intl.NumberFormat("en-UK").format(entero);

    // Rejoin with the decimal part (if exists)
    e.target.value = decimal !== undefined ? `${entero}.${decimal}` : entero;
  } else {
    e.target.value = "";
  }
});