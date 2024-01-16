import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading.js"
function Rooms(){

    const [loading,setLoading] = useState(true);
    const [rooms,setRooms] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/api/rooms').then(res => {
            console.log(res);
            setRooms(res.data.rooms);
            setLoading(false);
        });
    },[])

    const deleteRoom = (event,id) =>{
        event.preventDefault();

        const thisClicked = event.currentTarget;
        thisClicked.innerText = "Deleting...";

        axios.delete(`http://localhost:8000/api/rooms/${id}/delete`)
        .then(res => {
                alert(res.data.message);
                thisClicked.closest("tr").remove();

        })
        .catch(function (error) {
            if(error.response){
                if(error.response.status === 404){
                    alert(error.response.data.message);
                    thisClicked.innerText = "Delete";

                 }else if(error.response.status === 500){
                    alert(error.response.data)
                 }
            }
        });
    }

    if(loading){
        return (
                <Loading />
            )
    }

    var roomDetails = "";
    roomDetails = rooms.map( (item,index) => {
        return (
            <tr key={index}> 
                <td>{item.room_number}</td>
                <td>{item.floor}</td>
                <td>{item.type}</td>
                <td>{item.price_per_night}</td>
                <td>{item.availability_status}</td>
                <td>
                    <Link to={`/rooms/${item.id}/edit`} className="btn btn-success">Edit</Link>
                </td>
                <td>
                    <button type="button" onClick={(event) => deleteRoom(event,item.id)}  className="btn btn-danger">Delete</button>
                </td>
            </tr>
        )
    });

    return(
        <div className="container mt-5">
           <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4>Rooms List
                                <Link to="/rooms/create" className="btn btn-primary float-end">Add Room</Link>
                            </h4>
                        </div>
                        <div className="card-body">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Number</th>
                                        <th>Floor</th>
                                        <th>Type</th>
                                        <th>Price Per Night</th>
                                        <th>Availability Status</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roomDetails}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
           </div>
        </div>
    )
}

export default Rooms;