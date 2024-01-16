import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

function CustomerCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [inputErrorList, setInputErrorList] = useState({});
  const [customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    telephone: "",
    id_number: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setCustomer({ ...customer, [name]: value });
  };

  const saveCustomer = (event) => {
    event.preventDefault();

    setLoading(true);

    const data = {
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      telephone: customer.telephone,
      id_number: customer.id_number,
    };

    axios.post('http://localhost:8000/api/customers', data)
      .then(res => {
        alert(res.data.message);
        navigate('/customers');
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
                <h4>Add new Customer
                  <Link to="/customers" className="btn btn-danger float-end">Back</Link>
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={saveCustomer}>
                  <div className="mb-3">
                    <label>First Name</label>
                    <input type="text" name="first_name" className="form-control" value={customer.first_name} onChange={handleInput} />
                    <span className="text-danger">{inputErrorList.first_name}</span>
                  </div>
                  <div className="mb-3">
                    <label>Last Name</label>
                    <input type="text" name="last_name" className="form-control" value={customer.last_name} onChange={handleInput} />
                    <span className="text-danger">{inputErrorList.last_name}</span>
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" value={customer.email} onChange={handleInput} />
                    <span className="text-danger">{inputErrorList.email}</span>
                  </div>
                  <div className="mb-3">
                    <label>Telephone</label>
                    <input type="text" name="telephone" className="form-control" value={customer.telephone} onChange={handleInput} />
                    <span className="text-danger">{inputErrorList.telephone}</span>
                  </div>
                  <div className="mb-3">
                    <label>ID Number</label>
                    <input type="text" name="id_number" className="form-control" value={customer.id_number} onChange={handleInput} />
                    <span className="text-danger">{inputErrorList.id_number}</span>
                  </div>
                  <div className="mb-3 mt-3" >
                    <button type="submit" className="btn btn-primary">Add Customer</button>
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

export default CustomerCreate;
