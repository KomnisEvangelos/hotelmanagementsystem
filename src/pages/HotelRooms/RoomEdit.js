import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading.js";



function RoomEdit(){

    let {id} = useParams();



    const[loading,setLoading] = useState(true)
    const[inputErrorList,setInputErrorList] = useState({})
    const [type, setRoomType] = useState('single');
    const [availability_status, setAvailabilityStatus] = useState('available');
    const [room, setRoom] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/rooms/${id}/edit`).then(res => {
            console.log(res);
            const roomData = res.data.room; 
            setRoom(roomData);
            setLoading(false);
        }).catch(function (error) {
            if(error.response){
                if(error.response.status === 404){
                    alert(error.response.data.message);
                    setLoading(false);

                 }else if(error.response.status === 500){
                    alert(error.response.data)
                    setLoading(false);
                 }
            }
        });
    }, [id]);
    

      
      const handleInput = (event) => {
        const { name, value } = event.target;
        setRoom({ ...room, [name]: value });
      };
      
      const handleRoomTypeChange = (event) => {
        const { name, value } = event.target;
        setRoomType(value);
        setRoom({ ...room, [name]: value, type: value });
      };
      
      const handleAvailabilityChange = (event) => {
        const { name, value } = event.target;
        setAvailabilityStatus(value);
        setRoom({ ...room, [name]: value, availability_status: value });
      };
      
  
  if(loading){
    return (
            <Loading />
        )
}



  const updateRoom = (event) => {
        event.preventDefault();

        setLoading(true);

        const data = {
            room_number:room.room_number,
            floor:room.floor,
            type: room.type,
            price_per_night:room.price_per_night,
            availability_status:room.availability_status
        };

        axios.put(`http://localhost:8000/api/rooms/${id}/edit`,data)
        .then(res => {
                alert(res.data.message);
                setLoading(false);
        })
        .catch(function (error) {
            if(error.response){
                if(error.response.status === 422){
                        setInputErrorList(error.response.data.errors)
                        setLoading(false);

                }else if(error.response.status === 404){
                    alert(error.response.data.message);
                    setLoading(false);

                 }else if(error.response.status === 500){
                    alert(error.response.data)
                    setLoading(false);
                 }
            }
        });
  }

  if(Object.keys(room).length === 0){
    return (
        <div className="container">
            <h4>No such Room Id Found</h4>
        </div>
    )
    }
    
    return (
        <div>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12">
                     <div className="card">
                        <div className="card-header">
                            <h4>Edit Existing Room
                                <Link to="/rooms" className="btn btn-danger float-end">Back</Link>
                            </h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={updateRoom}>
                                <div className="md-3">
                                    <label>Room Number</label>
                                    <input type="text" name="room_number" className="form-control" value={room.room_number} onChange={handleInput} /> 
                                    <span className="text-danger">{inputErrorList.room_number}</span>
                                </div>
                                <div className="md-3">
                                    <label>Floor</label>
                                    <input type="text" name="floor" className="form-control" value={room.floor} onChange={handleInput} /> 
                                    <span className="text-danger">{inputErrorList.floor}</span>
                                </div>
                                <div className="md-3">
                                     <label>Type</label>
                                    <select
                                        name="type"
                                        value={room.type}
                                        onChange={handleRoomTypeChange}
                                        className="form-control">
                                        <option value="single">Single</option>
                                        <option value="double">Double</option>
                                        <option value="suite">Suite</option>
                                    </select>
                                    <span className="text-danger">{inputErrorList.type}</span>
                                </div>

                                <div className="md-3">
                                    <label>Price Per Night</label>
                                    <input type="text" name="price_per_night" className="form-control" value={room.price_per_night} onChange={handleInput} /> 
                                    <span className="text-danger">{inputErrorList.price_per_night}</span>
                                </div>

                                <div className="md-3">
                                        <label>Availability Status</label>
                                        <select
                                            name="availability_status"
                                            value={room.availability_status}
                                            onChange={handleAvailabilityChange}
                                            className="form-control">
                                            <option value="available">Available</option>
                                            <option value="reserved">Reserved</option>
                                        </select>
                                        <span className="text-danger">{inputErrorList.availability_status}</span>
                                </div>

                                <div className="mb-3 mt-3" >
                                    <button type="submit"  className="btn btn-primary">Update Room</button>
                                </div>
                            </form>
                        </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>

    )
}

export default RoomEdit;