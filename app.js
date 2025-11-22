// Client-side: year filler, basic form validation, price calculator
document.getElementById('year').textContent = new Date().getFullYear();

const itineraries = {
  "light-trek": { name: "Light Trek — 3 Days/2 Nights", priceINR: 8999 },
  "tea-escape": { name: "Tea Garden Escape — 4 Days/3 Nights", priceINR: 14999 },
  "river-valley": { name: "River & Valley Tour — 6 Days/5 Nights", priceINR: 19999 }
};

// Simple conversion rate (illustrative). In production, fetch live rates from an API.
const INR_TO_USD = 0.012; // 1 INR = 0.012 USD (example)

/** Price calculation:
 * base = pricePerPerson * travellers
 * tax = base * 0.05 (GST 5%)
 * discount = group discount: 5% for 4-5 ppl, 10% for 6+ (applied on base)
 * total = base + tax - discount
 */

function formatCurrency(value, currency) {
  if (currency === 'INR') {
    return '₹' + value.toLocaleString('en-IN', {maximumFractionDigits:0});
  } else {
    return '$' + value.toLocaleString('en-US', {maximumFractionDigits:2});
  }
}

function calculate() {
  const itinKey = document.getElementById('calcItin').value;
  const travellers = Math.max(1, parseInt(document.getElementById('travellers').value || '1'));
  const currency = document.getElementById('currency').value;

  const breakdown = {
    base: 0,
    tax: 0,
    discount: 0,
    total: 0
  };

  if (!itinKey || !itineraries[itinKey]) {
    document.getElementById('basePrice').textContent = '—';
    document.getElementById('taxes').textContent = '—';
    document.getElementById('discount').textContent = '—';
    document.getElementById('total').textContent = '—';
    return breakdown;
  }

  const perPersonINR = itineraries[itinKey].priceINR;
  let baseINR = perPersonINR * travellers;
  let discountINR = 0;
  if (travellers >= 6) discountINR = baseINR * 0.10;
  else if (travellers >= 4) discountINR = baseINR * 0.05;
  const taxINR = baseINR * 0.05; // GST 5%
  const totalINR = baseINR + taxINR - discountINR;

  if (currency === 'INR') {
    breakdown.base = formatCurrency(baseINR, 'INR');
    breakdown.tax = formatCurrency(taxINR, 'INR');
    breakdown.discount = '-' + formatCurrency(discountINR, 'INR');
    breakdown.total = formatCurrency(totalINR, 'INR');
  } else {
    const baseUSD = baseINR * INR_TO_USD;
    const taxUSD = taxINR * INR_TO_USD;
    const discountUSD = discountINR * INR_TO_USD;
    const totalUSD = totalINR * INR_TO_USD;
    breakdown.base = formatCurrency(baseUSD, 'USD');
    breakdown.tax = formatCurrency(taxUSD, 'USD');
    breakdown.discount = '-' + formatCurrency(discountUSD, 'USD');
    breakdown.total = formatCurrency(totalUSD, 'USD');
  }

  // return a numeric total in selected currency for programmatic use
  const numericTotal = currency === 'INR' ? Math.round(totalINR) : +(totalINR * INR_TO_USD).toFixed(2);

  document.getElementById('basePrice').textContent = breakdown.base;
  document.getElementById('taxes').textContent = breakdown.tax;
  document.getElementById('discount').textContent = breakdown.discount;
  document.getElementById('total').textContent = breakdown.total;

  return { breakdown, numericTotal, currency, itinKey, travellers };
}

// attach events
document.getElementById('calcItin').addEventListener('change', calculate);
document.getElementById('travellers').addEventListener('input', calculate);
document.getElementById('currency').addEventListener('change', calculate);

// pre-select itinerary when user clicks "Select"
document.querySelectorAll('.select-itin').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const key = e.target.dataset.itin;
    document.getElementById('calcItin').value = key;
    calculate();
    // scroll to calculator
    document.getElementById('priceCalculator').scrollIntoView({behavior: 'smooth'});
  });
});

// Add to booking: populate hidden inputs in booking form
document.getElementById('addToBooking').addEventListener('click', () => {
  const result = calculate();
  if (!result.itinKey) {
    alert('Please select an itinerary first.');
    return;
  }
  // populate hidden fields
  const itinLabel = itineraries[result.itinKey].name;
  document.getElementById('selectedItinInput').value = itinLabel + ' (' + result.travellers + ' traveller(s))';
  document.getElementById('calculatedTotalInput').value = result.numericTotal + ' ' + result.currency;
  // also copy number of travellers to booking form field
  document.getElementById('travellersForm').value = result.travellers;
  alert('Itinerary added to the booking form. Fill your details and submit the enquiry.');
});

// Basic booking form validation
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', function(e){
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  if(!name || !email) {
    e.preventDefault();
    alert('Please provide name and email.');
    return false;
  }
  // allow Netlify to handle form post
});
