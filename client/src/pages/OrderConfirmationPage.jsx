// /client/src/pages/OrderConfirmationPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as checkoutApi from '../api/checkoutApi';

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

const PAYMENT_LABELS = { card: 'Credit / Debit Card', paypal: 'PayPal', cod: 'Cash on Delivery' };

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await checkoutApi.getOrderConfirmation(id);
        setOrder(res.data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
          <Link to="/products" className="text-blue-600 hover:underline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const addr = order.shippingAddress;
  const estimatedDelivery = new Date(
    new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Success header */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h1 className="text-2xl font-bold text-green-800 mb-1">Order Confirmed!</h1>
          <p className="text-green-600 text-sm">
            Thank you for your purchase. We'll send you a shipping update soon.
          </p>
        </div>

        {/* AC-CHK-12: Order details */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Detail label="Order ID" value={`#${order._id.toString().slice(-8).toUpperCase()}`} />
            <Detail label="Status" value={order.status.charAt(0).toUpperCase() + order.status.slice(1)} />
            <Detail label="Payment" value={PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod} />
            <Detail label="Estimated Delivery" value={estimatedDelivery} />
          </div>
        </div>

        {/* Items list */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Items Ordered</h2>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-3">
                <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 pt-4 mt-2 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
              <span>Total Paid</span>
              <span className="text-blue-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Shipping To</h2>
          <p className="text-sm text-gray-700 font-medium">{addr.fullName}</p>
          <p className="text-sm text-gray-600">{addr.addressLine1}</p>
          {addr.addressLine2 && <p className="text-sm text-gray-600">{addr.addressLine2}</p>}
          <p className="text-sm text-gray-600">
            {addr.city}, {addr.state} {addr.zipCode}
          </p>
          <p className="text-sm text-gray-600">{addr.country}</p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/products"
            className="flex-1 text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
