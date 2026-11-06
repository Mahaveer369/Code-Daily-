import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method && req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    // 1. Cryptographic HMAC-SHA256 Payment Signature Verification using RAZORPAY_KEY_SECRET
    if (body.action === 'verify') {
      const orderId = String(body.razorpay_order_id || '').trim();
      const paymentId = String(body.razorpay_payment_id || '').trim();
      const signature = String(body.razorpay_signature || '').trim();

      if (!paymentId) {
        return res.status(400).json({ ok: false, verified: false, message: 'Missing Razorpay payment ID.' });
      }

      if (keySecret && orderId && signature) {
        const expectedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(`${orderId}|${paymentId}`)
          .digest('hex');

        if (expectedSignature !== signature) {
          return res.status(400).json({
            ok: false,
            verified: false,
            message: 'Razorpay payment signature verification failed.',
          });
        }
      }

      return res.status(200).json({
        ok: true,
        verified: true,
        paymentId,
        orderId,
      });
    }

    // 2. Server-Side Razorpay Order Creation (Any user-chosen amount >= 1 INR)
    const amountInRupees = Math.max(1, Math.min(100000, Number(body.amount) || 1));
    const currency = String(body.currency || 'INR').toUpperCase();
    const supporterName = String(body.name || 'Supporter').slice(0, 80);
    const tierLabel = String(body.tierLabel || 'Buy Me a Coffee').slice(0, 80);

    const amountSubunits = Math.round(amountInRupees * 100);
    const receiptId = `rcpt_cio_${Date.now()}`;

    if (!keyId || keyId.includes('your-razorpay')) {
      return res.status(200).json({
        ok: false,
        mode: 'unconfigured',
        message: 'Razorpay server keys (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are not configured in environment variables.',
      });
    }

    if (keyId && keySecret) {
      const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: amountSubunits,
          currency,
          receipt: receiptId,
          notes: {
            supporterName,
            tierLabel,
            platform: 'Code It Out',
          },
        }),
      });

      if (rzpResponse.ok) {
        const orderData = await rzpResponse.json();
        return res.status(200).json({
          ok: true,
          mode: 'live_order',
          keyId,
          orderId: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
          receipt: orderData.receipt,
        });
      } else {
        const errPayload = await rzpResponse.text();
        return res.status(200).json({
          ok: false,
          mode: 'order_error',
          message: `Razorpay order creation failed (${rzpResponse.status}): ${errPayload.slice(0, 140)}`,
        });
      }
    }

    return res.status(200).json({
      ok: true,
      mode: 'client_key_checkout',
      keyId,
      orderId: '',
      amount: amountSubunits,
      currency,
      receipt: receiptId,
    });
  } catch (err: any) {
    return res.status(200).json({
      ok: false,
      mode: 'error',
      message: err?.message || 'Unable to initialize Razorpay order',
    });
  }
}
