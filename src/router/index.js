import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home.js'
import Customers from '../pages/HotelCustomers/Customers.js'
import CustomerCreate from '../pages/HotelCustomers/CustomerCreate.js'
import CustomerEdit from '../pages/HotelCustomers/CustomerEdit.js'
import Rooms from '../pages/HotelRooms/Rooms.js'
import RoomCreate from '../pages/HotelRooms/RoomCreate.js'
import RoomEdit from '../pages/HotelRooms/RoomEdit.js'

import Bookings from '../pages/ΗotelBookings/Bookings.js'
import BookingEdit from '../pages/ΗotelBookings/BookingEdit.js'
import BookingCreate from '../pages/ΗotelBookings/BookingCreate.js'


function MyRouter(){
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
           
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/create" element= {<RoomCreate />} />
            <Route path="/rooms/:id/edit" element= {<RoomEdit />} />
            
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/create" element= {<CustomerCreate />} />
            <Route path="/customers/:id/edit" element= {<CustomerEdit />} />

            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/create" element= {<BookingCreate />} />
            <Route path="/bookings/:id/edit" element= {<BookingEdit />} />
            
        </Routes>
    )

}

export default MyRouter;