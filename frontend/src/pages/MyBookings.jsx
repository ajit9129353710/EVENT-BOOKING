import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
CalendarDays,
MapPin,
Ticket,
Download,
XCircle,
QrCode,
LoaderCircle,
} from "lucide-react";
import api from "../services/api";

function MyBookings() {
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [cancellingId, setCancellingId] = useState(null);

useEffect(() => {
fetchBookings();
}, []);

async function fetchBookings() {
try {
setLoading(true);
setError("");

  const response = await api.get("/bookings/my-bookings");

  setBookings(
    Array.isArray(response.data.bookings)
      ? response.data.bookings
      : []
  );
} catch (err) {
  setError(
    err.response?.data?.message ||
      "Bookings load nahi ho sakin. Please login karke dobara try karein."
  );
} finally {
  setLoading(false);
}

}

async function cancelBooking(bookingId) {
const confirmed = window.confirm(
"Kya aap sach mein ye booking cancel karna chahte hain?"
);

if (!confirmed) return;

try {
  setCancellingId(bookingId);

  await api.delete(`/bookings/${bookingId}`);

  await fetchBookings();

  window.alert("Booking successfully cancel ho gayi.");
} catch (err) {
  window.alert(
    err.response?.data?.message || "Booking cancel nahi ho saki."
  );
} finally {
  setCancellingId(null);
}

}

function downloadQRCode(bookingId) {
const canvas = document.getElementById("qr-${bookingId}");

if (!canvas) {
  window.alert("QR Code nahi mila. Page refresh karke try karein.");
  return;
}

const link = document.createElement("a");

link.download = `EventSphere-Booking-${bookingId}.png`;
link.href = canvas.toDataURL("image/png");

document.body.appendChild(link);
link.click();
link.remove();

}

if (loading) {
return (
<div className="container section">
<div className="booking-message">
<LoaderCircle size={30} className="booking-spinner" />
<p>Aapki bookings load ho rahi hain...</p>
</div>
</div>
);
}

if (error) {
return (
<div className="container section">
<div className="booking-message booking-error">
<h2>Bookings load nahi hui</h2>
<p>{error}</p>
<button className="btn btn-primary" onClick={fetchBookings}>
Try Again
</button>
</div>
</div>
);
}

const activeBookings = bookings.filter(
(booking) => booking.status === "confirmed"
);

const cancelledBookings = bookings.filter(
(booking) => booking.status === "cancelled"
);

return (
<section className="container section my-bookings-page">
<div className="booking-page-heading">
<span className="badge">
<Ticket size={15} /> My Tickets
</span>

    <h1 className="section-title">
      My <span className="gradient-text">Bookings</span>
    </h1>

    <p className="section-description">
      Apni event bookings dekhein, QR Codes download karein aur
      apne tickets manage karein.
    </p>
  </div>

  <div className="booking-stats">
    <div className="booking-stat-card">
      <span>Total Bookings</span>
      <strong>{bookings.length}</strong>
    </div>

    <div className="booking-stat-card">
      <span>Confirmed</span>
      <strong>{activeBookings.length}</strong>
    </div>

    <div className="booking-stat-card">
      <span>Cancelled</span>
      <strong>{cancelledBookings.length}</strong>
    </div>
  </div>

  {bookings.length === 0 ? (
    <div className="booking-empty">
      <div className="booking-empty-icon">
        <Ticket size={35} />
      </div>

      <h2>Abhi koi booking nahi hai</h2>

      <p>
        Events explore karein aur apna pehla ticket book karein.
      </p>

      <a href="/events" className="btn btn-primary">
        Explore Events
      </a>
    </div>
  ) : (
    <div className="booking-list">
      {bookings.map((booking) => {
        const event = booking.event;
        const isCancelled = booking.status === "cancelled";

        const qrValue = JSON.stringify({
          platform: "EventSphere",
          bookingReference: booking.bookingReference,
        });

        return (
          <article
            className="booking-card"
            key={booking._id}
          >
            <div className="booking-card-main">
              <div className="booking-event-details">
                <div className="booking-card-top">
                  <span className="booking-category">
                    {event?.category || "Event"}
                  </span>

                  <span
                    className={`booking-status ${
                      isCancelled
                        ? "booking-status-cancelled"
                        : "booking-status-confirmed"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <h2>{event?.title || "Event unavailable"}</h2>

                <div className="booking-detail-row">
                  <CalendarDays size={17} />

                  <span>
                    {event?.date
                      ? new Date(event.date).toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Date unavailable"}
                  </span>
                </div>

                <div className="booking-detail-row">
                  <MapPin size={17} />

                  <span>
                    {event?.location || "Location unavailable"}
                  </span>
                </div>

                <div className="booking-detail-row">
                  <Ticket size={17} />

                  <span>
                    {booking.quantity} ticket(s)
                  </span>
                </div>

                <div className="booking-reference">
                  <span>Booking Reference</span>
                  <strong>{booking.bookingReference}</strong>
                </div>

                <div className="booking-total">
                  <span>Total Amount</span>
                  <strong>
                    ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="booking-qr-panel">
                <div className="booking-qr-heading">
                  <QrCode size={19} />
                  <h3>Your Booking QR</h3>
                </div>

                <div
                  className={`booking-qr-image ${
                    isCancelled ? "booking-qr-disabled" : ""
                  }`}
                >
                  <QRCodeCanvas
                    id={`qr-${booking._id}`}
                    value={qrValue}
                    size={180}
                    level="H"
                    includeMargin
                    bgColor="#ffffff"
                    fgColor="#111827"
                  />
                </div>

                {isCancelled ? (
                  <p className="booking-qr-note">
                    Ye booking cancel ho chuki hai.
                  </p>
                ) : (
                  <>
                    <p className="booking-qr-note">
                      QR Code download karke apne paas rakhein.
                    </p>

                    <button
                      type="button"
                      className="btn btn-primary booking-download-btn"
                      onClick={() => downloadQRCode(booking._id)}
                    >
                      <Download size={17} />
                      Download QR
                    </button>

                    <button
                      type="button"
                      className="btn booking-cancel-btn"
                      onClick={() => cancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                    >
                      <XCircle size={17} />

                      {cancellingId === booking._id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  )}
</section>

);
}

export default MyBookings;