# Payment Gateway Integration Guide

## Overview

The ServEase platform supports multiple payment methods:
- **Razorpay** (Online payments - Cards, UPI, Net Banking)
- **QR Code** (UPI QR code payments)
- **Bank Transfer** (NEFT/RTGS/IMPS)

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

This will install Razorpay SDK and other required packages.

### 2. Configure Razorpay (Optional but Recommended)

1. **Create Razorpay Account**
   - Visit https://razorpay.com
   - Sign up for a free account
   - Complete KYC verification

2. **Get API Keys**
   - Go to Dashboard → Settings → API Keys
   - Generate Test Keys (for development)
   - Copy Key ID and Key Secret

3. **Update .env file**
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_key_secret_here
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
   ```

4. **Set up Webhook** (For production)
   - Go to Dashboard → Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payments/webhook`
   - Select events: `payment.captured`, `payment.failed`
   - Copy webhook secret to `.env`

### 3. Configure UPI ID (For QR Payments)

Update `.env` file:
```env
UPI_ID=your-upi-id@paytm
```

### 4. Payment Flow

#### Online Payment (Razorpay)
1. User selects "Online Payment"
2. System creates Razorpay order
3. Razorpay checkout opens
4. User completes payment
5. Payment verified via signature
6. Booking confirmed

#### QR Code Payment
1. User selects "QR Code"
2. System generates QR code with UPI details
3. User scans and pays via UPI app
4. User confirms payment
5. Booking status updated (manual verification)

#### Bank Transfer
1. User selects "Bank Transfer"
2. User enters transaction details
3. Payment recorded as "processing"
4. Admin verifies and confirms payment
5. Booking status updated

## API Endpoints

### Create Payment Order
```
POST /api/payments/create-order
Body: { bookingId, amount }
```

### Verify Payment
```
POST /api/payments/verify
Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId }
```

### QR Payment
```
POST /api/payments/qr-payment
Body: { bookingId, upiId }
```

### Bank Transfer
```
POST /api/payments/bank-transfer
Body: { bookingId, transactionId, bankName, accountNumber, amount }
```

### Get Payment
```
GET /api/payments/:id
GET /api/payments/booking/:bookingId
```

### Webhook (Razorpay)
```
POST /api/payments/webhook
```

## Testing

### Test Mode (Razorpay)
- Use test API keys
- Test cards: https://razorpay.com/docs/payments/test-cards/
- Test UPI: `success@razorpay`

### Production Mode
- Use live API keys
- Complete KYC verification
- Set up webhook URL
- Enable webhook secret

## Security

- All payment endpoints are protected with JWT
- Razorpay signature verification
- Webhook signature verification
- Payment records stored in MongoDB
- Transaction IDs tracked for bank transfers

## Payment Status Flow

```
pending → processing → completed
                ↓
            failed/cancelled
```

## Troubleshooting

### Razorpay not working
- Check API keys in `.env`
- Verify keys are active in Razorpay dashboard
- Check network connectivity
- Review server logs for errors

### QR Code not generating
- Verify UPI_ID in `.env`
- Check QR code service availability
- Review payment creation logs

### Webhook not receiving events
- Verify webhook URL is accessible
- Check webhook secret matches
- Ensure events are enabled in Razorpay dashboard

