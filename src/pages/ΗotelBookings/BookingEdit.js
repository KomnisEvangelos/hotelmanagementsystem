import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

function BookingEdit() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [inputErrorList, setInputErrorList] = useState({});
  const [booking, setBooking] = useState({
    customer_id: "",
    room_id: "",
    check_in_date: "",
    check_out_date: "",
    total_price: "",
    payment_status: "",
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/api/bookings/${id}/edit`)
      .then(res => {
        const bookingData = res.data.booking;
        setBooking(bookingData);
        setLoading(false);
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 404) {
            alert(error.response.data.message);
          } else if (error.response.status === 500) {
            alert(error.response.data);
          }
        }
        setLoading(false);
      });
  }, [id]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setBooking({ ...booking, [name]: value });
  };

  const updateBooking = (event) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      customer_id: booking.customer_id,
      room_id: booking.room_id,
      check_in_date: booking.check_in_date,
      check_out_date: booking.check_out_date,
      total_price: booking.total_price,
      payment_status: booking.payment_status,
    };

    axios.put(`http://localhost:8000/api/bookings/${id}/edit`, data)
      .then(res => {
        alert(res.data.message);
        setLoading(false);
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 422) {
            setInputErrorList(error.response.data.errors);
          } else if (error.response.status === 404) {
            alert(error.response.data.message);
          } else if (error.response.status === 500) {
            alert(error.response.data);
          }
        }
        setLoading(false);
      });
  };

  if (loading) {
    return <Loading />;
  }

  if (!booking) {
    return (
      <div className="container">
        <h4>No such Booking ID Found</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4>
                Edit Existing Booking
                <Link to="/bookings" className="btn btn-danger float-end">Back</Link>
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={updateBooking}>
                <div className="mb-3">
                  <label>Customer ID</label>
                  <input type="text" name="customer_id" className="form-control" value={booking.customer_id} onChange={handleInput} />
                  <span className="text-danger">{inputErrorList.customer_id}</span>
                </div>
                <div className="mb-3">
                  <label>Room ID</label>
                  <input type="text" name="room_id" className="form-control" value={booking.room_id} onChange={handleInput} />
                  <span className="text-danger">{inputErrorList.room_id}</span>
                </div>
                <div className="mb-3">
                  <label>Check-In Date</label>
                  <input type="date" name="check_in_date" className="form-control" value={booking.check_in_date} onChange={handleInput} />
                  <span className="text-danger">{inputErrorList.check_in_date}</span>
                </div>
                <div className="mb-3">
                  <label>Check-Out Date</label>
                  <input type="date" name="check_out_date" className="form-control" value={booking.check_out_date} onChange={handleInput} />
                  <span className="text-danger">{inputErrorList.check_out_date}</span>
                </div>
                <div className="mb-3">
                  <label>Total Price</label>
                  <input type="text" name="total_price" className="form-control" value={booking.total_price} onChange={handleInput} />
                  <span className="text-danger">{inputErrorList.total_price}</span>
                </div>
                <div className="mb-3">
                  <label>Payment Status</label>
                  <input type="text" name="payment_status" className="form-control" value={booking.payment_status} onChange={handleInput} />
                  <span className="text-danger">{inputErrorList.payment_status}</span>
                </div>
                <div className="mb-3 mt-3">
                  <button type="submit" className="btn btn-primary">Update Booking</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingEdit;
