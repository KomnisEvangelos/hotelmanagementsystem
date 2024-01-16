import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

function Bookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState({});
  const [customers, setCustomers] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/bookings').then(res => {
      setBookings(res.data.bookings);
      setLoading(false);
    });

    axios.get('http://localhost:8000/api/rooms').then(res => {
      const roomData = res.data.rooms.reduce((acc, room) => {
        acc[room.id] = room.room_number;
        return acc;
      }, {});
      setRooms(roomData);
    });

    axios.get('http://localhost:8000/api/customers').then(res => {
      const customerData = res.data.customers.reduce((acc, customer) => {
        acc[customer.id] = `${customer.first_name} ${customer.last_name}`;
        return acc;
      }, {});
      setCustomers(customerData);
    });
  }, []);

  const deleteBooking = (event, id) => {
    event.preventDefault();

    const thisClicked = event.currentTarget;
    thisClicked.innerText = "Deleting...";

    axios.delete(`http://localhost:8000/api/bookings/${id}`)
      .then(res => {
        alert(res.data.message);
        thisClicked.closest("tr").remove();
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 404) {
            alert(error.response.data.message);
            thisClicked.innerText = "Delete";
          } else if (error.response.status === 500) {
            alert(error.response.data);
          }
        }
      });
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  var bookingDetails = "";
  bookingDetails = bookings.map((item, index) => (
    <tr key={index}>
      <td>{rooms[item.room_id]}</td>
      <td>{customers[item.customer_id]}</td>
      <td>{item.check_in_date}</td>
      <td>{item.check_out_date}</td>
      <td>{item.total_price}</td>
      <td>{item.payment_status}</td>
      <td>
        <Link to={`/bookings/${item.id}/edit`} className="btn btn-success">Edit</Link>
      </td>
      <td>
         <button type="button" onClick={(event) => deleteBooking(event,item.id)}  className="btn btn-danger">Delete</button>
      </td>
    </tr>
  ));

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4>Bookings List
                <Link to="/bookings/create" className="btn btn-primary float-end">Add Booking</Link>
              </h4>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Room Number</th>
                    <th>Customer</th>
                    <th>Check-In Date</th>
                    <th>Check-Out Date</th>
                    <th>Total Price</th>
                    <th>Payment Status</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingDetails}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookings;
