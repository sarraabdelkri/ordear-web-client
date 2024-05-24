import React from 'react';
import { useParams } from 'react-router-dom'; // Si vous utilisez React Router pour gérer les routes

// Importez le composant OrderDetails
import OrderDetails from '../Home/orderDetails';

const OrderDetailsPage = () => {
    return (
        <div>
            <h1>Order Details Page</h1>
            <OrderDetails orderId="660bd1272183abb38ca03ec2" />
        </div>
    );
}

export default OrderDetailsPage;