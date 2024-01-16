import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

function Customer() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/customers').then(res => {
      console.log(res);
      setCustomers(res.data.customers);
      setLoading(false);
    });
  }, []);

  const deleteCustomer = (event, id) => {
    event.preventDefault();

    const thisClicked = event.currentTarget;
    thisClicked.innerText = "Deleting...";

    axios.delete(`http://localhost:8000/api/customers/${id}`)
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
            alert(error.response.data.message);
          }
        }
      });
  };

  if (loading) {
    return <Loading />;
  }

  var customerDetails = "";
  customerDetails = customers.map((item, index) => (
    <tr key={index}>
      <td>{item.first_name}</td>
      <td>{item.last_name}</td>
      <td>{item.email}</td>
      <td>{item.telephone}</td>
      <td>{item.id_number}</td>
      <td>
        <Link to={`/customers/${item.id}/edit`} className="btn btn-success">Edit</Link>
      </td>
      <td>
        <button type="button" onClick={(event) => deleteCustomer(event, item.id)} className="btn btn-danger">Delete</button>
      </td>
    </tr>
  ));

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4>Customers List
                <Link to="/customers/create" className="btn btn-primary float-end">Add Customer</Link>
              </h4>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Telephone</th>
                    <th>ID Number</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {customerDetails}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customer;
