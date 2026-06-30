// /client/src/pages/CheckoutPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setStep,
  setShippingAddress,
  submitOrder,
  resetCheckout,
  selectCheckoutStep,
  selectShippingAddress,
  selectPaymentMethod,
  selectCouponCode,
} from '../store/checkoutSlice';
import { selectAuthUser } from '../store/authSlice';
import ShippingForm from '../components/checkout/ShippingForm';
import OrderReview from '../components/checkout/OrderReview';
import PaymentMethod from '../components/checkout/PaymentMethod';

const STEPS = ['Shipping', 'Review', 'Payment'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((label, idx) => {
        const step = idx + 1;
        const done = step < current;
        const active = step === current;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  done
                    ? 'bg-green-500 text-white'
                    : active
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {done ? '✓' : step}
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 mx-2 mb-4 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const step = useSelector(selectCheckoutStep);
  const shippingAddress = useSelector(selectShippingAddress);
  const paymentMethod = useSelector(selectPaymentMethod);
  const couponCode = useSelector(selectCouponCode);
  const user = useSelector(selectAuthUser);

  // AC-CHK-04: pre-fill from user profile address
  const prefilled = {
    fullName: user?.name || '',
    addressLine1: user?.address?.street || '',
    addressLine2: '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zip || '',
    country: user?.address?.country || 'US',
  };

  // Merge prefilled only where checkout state is still blank
  const initialAddress = {
    ...prefilled,
    ...Object.fromEntries(
      Object.entries(shippingAddress).filter(([, v]) => v !== '' && v !== 'US')
    ),
  };

  useEffect(() => {
    dispatch(setStep(1));
  }, [dispatch]);

  const handleShippingSubmit = (data) => {
    dispatch(setShippingAddress(data));
    dispatch(setStep(2));
  };

  const handlePlaceOrder = async () => {
    const result = await dispatch(
      submitOrder({ shippingAddress, paymentMethod, couponCode })
    );
    if (submitOrder.fulfilled.match(result)) {
      const orderId = result.payload.data.orderId;
      dispatch(resetCheckout());
      navigate(`/orders/${orderId}/confirmation`);
    }
    // If rejected, error is shown in PaymentMethod component
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Checkout</h1>
        <StepIndicator current={step} />

        <div className="bg-white rounded-2xl shadow-sm p-6">
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Shipping Address</h2>
              <ShippingForm
                initialValues={initialAddress}
                onSubmit={handleShippingSubmit}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Review Your Order</h2>
              <OrderReview
                onBack={() => dispatch(setStep(1))}
                onNext={() => dispatch(setStep(3))}
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Payment Method</h2>
              <PaymentMethod
                onBack={() => dispatch(setStep(2))}
                onPlaceOrder={handlePlaceOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
