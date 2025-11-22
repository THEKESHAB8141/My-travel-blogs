# Northeast Explorer — Demo Travel Website (With Itineraries & Pricing)

This project now includes a simple price calculator and itinerary examples.

## Itineraries & Pricing
- Each itinerary lists an indicative **per-person** price (INR).
- The Price Calculator lets visitors:
  - Choose an itinerary
  - Select number of travellers
  - Toggle currency (INR / USD - illustrative rate)
  - See taxes (GST 5%) and automatic group discounts (5% for 4-5 travellers, 10% for 6+)
- Clicking **Add to booking** copies the selected itinerary and calculated total into hidden fields on the booking form. When the visitor submits the booking form, Netlify Forms captures the itinerary and the estimated total.

## Payments & confirmation
This demo does *not* perform payments. To accept payments online, integrate a payment gateway:
- Stripe Checkout (recommended): create a serverless endpoint to create a Checkout Session and redirect the user to Stripe.
- PayPal Buttons or PayPal Checkout.
- Razorpay (India-specific) with server-side order creation.

### Quick Stripe integration outline
1. Create a serverless function (Netlify Function) that calls Stripe's API to create a Checkout Session.
2. From the client, POST itinerary and traveller details to that function to get a session ID.
3. Redirect the user to `stripe.redirectToCheckout({ sessionId })`.
4. Use webhooks to confirm payment and mark booking as paid in your backend.

If you want, I can add a sample Netlify Function for Stripe (requires your Stripe secret key in Netlify environment variables). I can also wire a "Pay now" button that calls the function and redirects to Stripe Checkout.

## Deploy
Deploy exactly like before to Netlify. Netlify Forms will collect enquiries and include:
- `selected_itinerary`
- `calculated_total`
- `travellers`
- `name`, `email`, `phone`, `notes`

## Customize
- Replace the sample per-person prices with your real prices.
- For live currency conversion, query a rates API (e.g., exchangerate.host, fixer.io) from a serverless function.
