import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { X, Check, MapPin, Car, Phone, Mail } from 'lucide-react';

export default function BookingModal({
  open,
  onClose,
  recommendedService,
}) {
  const [step, setStep] = useState('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    location: '',
    vehicle: '',
    phone_number: '',
    email: '',
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      const res = await axiosClient.post('/api/booking/', {
        service: recommendedService,
        location: form.location,
        vehicle: form.vehicle,
        phone_number: form.phone_number,
        email: form.email,
      });

      if (res.status === 201) {
        setStep('confirmed');
      }
    } catch (err) {
      const data = err?.response?.data;

      let message = 'Something went wrong. Please try again.';

      if (data) {
        if (typeof data === 'string') {
          message = data;
        } else if (data.detail) {
          message = data.detail;
        } else if (data.error) {
          message = data.error;
        } else if (data.message) {
          message = data.message;
        } else {
          const firstField = Object.keys(data)[0];

          if (firstField && Array.isArray(data[firstField])) {
            message = `${firstField}: ${data[firstField][0]}`;
          }
        }
      } else if (err?.code === 'ERR_NETWORK') {
        message = 'Network error. Check your connection.';
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();

    setError('');

    setTimeout(() => {
      setStep('form');

      setForm({
        location: '',
        vehicle: '',
        phone_number: '',
        email: '',
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[rgba(40,55,48,0.42)] p-5 backdrop-blur-[3px]" onClick={handleClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-[20px] bg-[#fbfcfa] p-[28px_26px_24px] shadow-[0_24px_60px_rgba(40,55,48,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-[9px] border-0 bg-transparent text-[#849088] transition-colors hover:bg-[#eef2ec] hover:text-[#2f4039] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5d806e]"
          type="button"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {step === 'form' && (
          <>
            <div className="mb-[22px] pr-8">
              <h2 className="mb-1 text-lg font-bold text-[#2f4039]">Book a mechanic</h2>

              <p className="m-0 text-xs leading-[1.5] text-[#849088]">
                Schedule a hands-on inspection based on this diagnosis.
              </p>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              {/* Service */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#56635d]">Service</span>

                <input
                  type="text"
                  value={recommendedService}
                  readOnly
                  className="rounded-[10px] border border-[#dce4dc] bg-white px-3 py-2.5 text-[13px] text-[#44544c] outline-none focus:border-[#5d806e]"
                />
              </label>

              {/* Location */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#56635d]">Location</span>

                <div className="flex items-center gap-[9px] rounded-[10px] border border-[#dce4dc] bg-white px-3 transition-colors focus-within:border-[#5d806e] [&>svg]:shrink-0 [&>svg]:text-[#8b9b91]">
                  <MapPin size={15} strokeWidth={2} />

                  <input
                    type="text"
                    name="location"
                    placeholder="Enter address or zip code"
                    value={form.location}
                    onChange={handleChange}
                    required
                    className="w-full min-w-0 border-0 bg-transparent py-2.5 text-[13px] text-[#44544c] outline-none placeholder:text-[#849088]"
                  />
                </div>
              </label>

              {/* Vehicle */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#56635d]">Vehicle</span>

                <div className="flex items-center gap-[9px] rounded-[10px] border border-[#dce4dc] bg-white px-3 transition-colors focus-within:border-[#5d806e] [&>svg]:shrink-0 [&>svg]:text-[#8b9b91]">
                  <Car size={15} strokeWidth={2} />

                  <input
                    type="text"
                    name="vehicle"
                    placeholder="e.g. 2018 Honda Civic"
                    value={form.vehicle}
                    onChange={handleChange}
                    required
                    className="w-full min-w-0 border-0 bg-transparent py-2.5 text-[13px] text-[#44544c] outline-none placeholder:text-[#849088]"
                  />
                </div>
              </label>

              {/* Phone */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#56635d]">Phone number</span>

                <div className="flex items-center gap-[9px] rounded-[10px] border border-[#dce4dc] bg-white px-3 transition-colors focus-within:border-[#5d806e] [&>svg]:shrink-0 [&>svg]:text-[#8b9b91]">
                  <Phone size={15} strokeWidth={2} />

                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Enter phone number"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                    className="w-full min-w-0 border-0 bg-transparent py-2.5 text-[13px] text-[#44544c] outline-none placeholder:text-[#849088]"
                  />
                </div>
              </label>

              {/* Email */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#56635d]">Email</span>

                <div className="flex items-center gap-[9px] rounded-[10px] border border-[#dce4dc] bg-white px-3 transition-colors focus-within:border-[#5d806e] [&>svg]:shrink-0 [&>svg]:text-[#8b9b91]">
                  <Mail size={15} strokeWidth={2} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full min-w-0 border-0 bg-transparent py-2.5 text-[13px] text-[#44544c] outline-none placeholder:text-[#849088]"
                  />
                </div>
              </label>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {error}
                </div>
              )}

              <button
                className="mt-1.5 rounded-xl border-0 bg-[#24594e] p-[13px] text-sm font-bold text-[#fffdf7] transition-colors hover:bg-[#1d4a40] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5d806e]"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Booking…' : 'Confirm booking'}
              </button>
            </form>
          </>
        )}

        {step === 'confirmed' && (
          <div className="flex flex-col items-center pt-2 text-center">
            <div className="mb-4 grid size-14 place-items-center rounded-full bg-[#dceee2] text-[#2f7a4f]">
              <Check size={32} strokeWidth={2.5} />
            </div>

            <h2 className="mb-1.5 text-lg font-bold text-[#2f4039]">Booking confirmed</h2>

            <p className="mb-5 text-[13px] leading-[1.6] text-[#56635d]">
              Your mechanic visit has been booked.
            </p>

            <div className="mb-[22px] flex w-full flex-col gap-2.5 rounded-xl bg-[#f4f7f2] p-4">
              <div className="flex justify-between gap-3 text-xs">
                <span className="font-semibold text-[#849088]">Service</span>
                <span className="text-right text-[#44544c]">{recommendedService}</span>
              </div>

              <div className="flex justify-between gap-3 text-xs">
                <span className="font-semibold text-[#849088]">Location</span>
                <span className="text-right text-[#44544c]">{form.location}</span>
              </div>

              <div className="flex justify-between gap-3 text-xs">
                <span className="font-semibold text-[#849088]">Vehicle</span>
                <span className="text-right text-[#44544c]">{form.vehicle}</span>
              </div>

              <div className="flex justify-between gap-3 text-xs">
                <span className="font-semibold text-[#849088]">Phone</span>
                <span className="text-right text-[#44544c]">{form.phone_number}</span>
              </div>

              <div className="flex justify-between gap-3 text-xs">
                <span className="font-semibold text-[#849088]">Email</span>
                <span className="text-right text-[#44544c]">{form.email}</span>
              </div>
            </div>

            <button
              className="w-full rounded-xl border-0 bg-[#24594e] p-[13px] text-sm font-bold text-[#fffdf7] transition-colors hover:bg-[#1d4a40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5d806e]"
              type="button"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

