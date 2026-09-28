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
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {step === 'form' && (
          <>
            <div className="modal-header">
              <h2>Book a mechanic</h2>

              <p>
                Schedule a hands-on inspection based on this diagnosis.
              </p>
            </div>

            <form
              className="booking-form"
              onSubmit={handleSubmit}
            >
              {/* Service */}
              <label className="form-field">
                <span>Service</span>

                <input
                  type="text"
                  value={recommendedService}
                  readOnly
                />
              </label>

              {/* Location */}
              <label className="form-field">
                <span>Location</span>

                <div className="input-with-icon">
                  <MapPin size={15} strokeWidth={2} />

                  <input
                    type="text"
                    name="location"
                    placeholder="Enter address or zip code"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              {/* Vehicle */}
              <label className="form-field">
                <span>Vehicle</span>

                <div className="input-with-icon">
                  <Car size={15} strokeWidth={2} />

                  <input
                    type="text"
                    name="vehicle"
                    placeholder="e.g. 2018 Honda Civic"
                    value={form.vehicle}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              {/* Phone */}
              <label className="form-field">
                <span>Phone number</span>

                <div className="input-with-icon">
                  <Phone size={15} strokeWidth={2} />

                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Enter phone number"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              {/* Email */}
              <label className="form-field">
                <span>Email</span>

                <div className="input-with-icon">
                  <Mail size={15} strokeWidth={2} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <button
                className="modal-submit"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Booking…' : 'Confirm booking'}
              </button>
            </form>
          </>
        )}

        {step === 'confirmed' && (
          <div className="confirmation-state">
            <div className="confirmation-icon">
              <Check size={32} strokeWidth={2.5} />
            </div>

            <h2>Booking confirmed</h2>

            <p>
              Your mechanic visit has been booked.
            </p>

            <div className="confirmation-details">
              <div className="detail-row">
                <span>Service</span>
                <span>{recommendedService}</span>
              </div>

              <div className="detail-row">
                <span>Location</span>
                <span>{form.location}</span>
              </div>

              <div className="detail-row">
                <span>Vehicle</span>
                <span>{form.vehicle}</span>
              </div>

              <div className="detail-row">
                <span>Phone</span>
                <span>{form.phone_number}</span>
              </div>

              <div className="detail-row">
                <span>Email</span>
                <span>{form.email}</span>
              </div>
            </div>

            <button
              className="modal-submit"
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

