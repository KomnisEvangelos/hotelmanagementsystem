import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

function BookingCreate() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [inputErrorList, setInputErrorList] = useState({});
    const [customers, setCustomers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [pricePerNight, setPricePerNight] = useState(0);
  
    const [booking, setBooking] = useState({
        customer_id: "",
        room_number: "", 
        check_in_date: "",
        check_out_date: "",
        total_price: 0, 
        payment_status: "pending",
      });
      
  
    useEffect(() => {
      axios.get('http://localhost:8000/api/customers').then(res => {
          setCustomers(res.data.customers);
      });
  
      axios.get('http://localhost:8000/api/rooms').then(res => {
        setRooms(res.data.rooms);
      });
    }, []);
  
    useEffect(() => {
      if (booking.room_number && booking.check_in_date && booking.check_out_date) {
        axios.get(`http://localhost:8000/api/rooms/get-room-by-number/${booking.room_number}`)
          .then(res => {
            setPricePerNight(res.data.price_per_night);
          })
          .catch(error => {
            console.error("Error fetching price per night:", error);
          });
      }
    }, [booking.room_number, booking.check_in_date, booking.check_out_date]);
  
    const calculateTotalPrice = () => {
      if (pricePerNight && booking.check_in_date && booking.check_out_date) {
        const numberOfNights = Math.ceil(
          (new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000 * 60 * 60 * 24)
        );
        return pricePerNight * numberOfNights || 0; 
      }
      return 0;
    };
    
    const [selectedRoom, setSelectedRoom] = useState(""); 

    const handleRoomChange = (event) => {
      const { name, value } = event.target;
      const selectedRoomNumber = event.target.value;
      setSelectedRoom(selectedRoomNumber);
      setBooking({ ...booking, [name]: value });
      axios.get(`http://localhost:8000/api/rooms/get-room-by-number/101`)
      .then(res => {
        setPricePerNight(res.data.price_per_night);
      })
      .catch(error => {
        console.error("Error fetching price per night:", error);
      });
      
    };
  
    const handleInput = (event) => {
      const { name, value } = event.target;
      setBooking({ ...booking, [name]: value });
  
      if (name === 'room_number') {
        updatePricePerNight(value);
      }
    };
  
    const updatePricePerNight = (selectedRoomNumber) => {
      axios.get(`http://localhost:8000/api/rooms/get-room-by-number/${selectedRoomNumber}`)
        .then(res => {
          setPricePerNight(res.data.price_per_night);
        })
        .catch(error => {
          console.error("Error fetching price per night:", error);
        });
    };


  
    const saveBooking = (event) => {
      event.preventDefault();
  
      setLoading(true);
  
      const data = {
        customer_id: booking.customer_id,
        room_number: booking.room_number, 
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        total_price: calculateTotalPrice(), 
        payment_status: booking.payment_status,
      };
  
      axios.post('http://localhost:8000/api/bookings', data)
        .then(res => {
          alert(res.data.message);
          navigate('/bookings');
          setLoading(false);
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.status === 422) {
              setInputErrorList(error.response.data.errors);
              setLoading(false);
            }
            if (error.response.status === 500) {
              alert(error.response.data);
              setLoading(false);
            }
          }
        });
    }
  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4>Add new Booking
                  <Link to="/bookings" className="btn btn-danger float-end">Back</Link>
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={saveBooking}>
                  <div className="mb-3">
                    <label>Customer</label>
                    <select name="customer_id" className="form-control" value={booking.customer_id} onChange={handleInput}>
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.first_name} {customer.last_name}
                        </option>
                      ))}
                    </select>
                    <span className="text-danger">{inputErrorList.customer_id}</span>
                  </div>
                  <div className="mb-3">
                    <label>Room</label>
                    <select name="room_number" className="form-control" value={booking.room_number} onChange={handleRoomChange}>
                      <option value="">Select Room</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.room_number}>
                          {room.room_number}
                        </option>
                      ))}
                    </select>
                    <span className="text-danger">{inputErrorList.room_number}</span>
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
                    <label>Price Per Night</label>
                    <input type="text" className="form-control" value={pricePerNight} readOnly />
                  </div>
                  <div className="mb-3">
                    <label>Total Price</label>
                    <input type="text" name="total_price" className="form-control" value={calculateTotalPrice()} onChange={handleInput} />
                    <span className="text-danger">{inputErrorList.total_price}</span>
                  </div>
                  <div className="mb-3">
                    <label>Payment Status</label>
                    <select name="payment_status" className="form-control" value={booking.payment_status} onChange={handleInput}>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                    <span className="text-danger">{inputErrorList.payment_status}</span>
                  </div>
                  <div className="mb-3 mt-3" >
                    <button type="submit" className="btn btn-primary">Add Booking</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingCreate;
