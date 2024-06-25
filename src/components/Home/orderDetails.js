import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Footer from "../Footer/Footer";
import Navs from "../Navs/Navs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faUtensils, faBuilding, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';

const OrderDetails = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [userFullName, setUserFullName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { userId, orderId } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userIdFromStorage = localStorage.getItem("userId");
                if (!userIdFromStorage) {
                    throw new Error("User ID not found in localStorage");
                }
    
                const url = `${process.env.REACT_APP_BACKEND_URL}/user/getById/${userIdFromStorage}`;
                const response = await fetch(url, {
                    credentials: "include",
                });
    
                const userData = await response.json();
                console.log("UserData:", userData);
    
                if (response.ok && userData) {
                    setUserFullName(`${userData.firstName} ${userData.lastName}`);
                } else {
                    throw new Error("Invalid user data");
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            }
        };
    
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/order/getOrderByUserId/${userId}/${orderId}`,
                    { withCredentials: true }
                );
    
                if (response.data) {
                    setOrderDetails(response.data);
                } else {
                    throw new Error('No order details found.');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError(error.message || 'Error fetching order details');
            }
        };
    
        const fetchData = async () => {
            try {
                await fetchUserData();
                await fetchOrderDetails();
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Set isLoading to false after both fetches are done
            }
        };
    
        fetchData();
    }, [userId, orderId]);
    

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!orderDetails) return <p>No order details found.</p>;

    const getStatusProgress = (status) => {
        switch (status.toLowerCase()) {
            case 'waiting': return '10%';
            case 'preparing': return '30%';
            case 'ready': return '60%';
            case 'completed': return '100%';
            case 'cancelled':
            case 'refused': return '0%';
            default: return '0%';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'waiting': return '#FFA500'; // Orange
            case 'preparing': return '#008000'; 
            case 'cancelled': return '#FF0000'; // Red
            default: return '#f0f0f0'; // Default light grey for undefined statuses
        }
    };

    const progress = getStatusProgress(orderDetails.statusOrder);
    const color = getStatusColor(orderDetails.statusOrder);

    return (
        <>
            <Navs />
            <div className="container my-5">
                <div className="row">
                    <div className="col-md-7">
                        <div className="card">
                            <div className="card-header px-4 py-5">
                                <h5 className="text-muted mb-0">
                                    Thanks for your Order, <span style={{ color: '#f7a4a4' }}>{userFullName}</span>!
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <p className="lead fw-normal mb-0" style={{ color: '#a8729a' }}>Receipt</p>
                                    <p className="small text-muted mb-0">Table Number: {orderDetails.tableNb}</p>
                                </div>
                                <div className="card shadow-0 border mb-4">
                                    <div className="card-body">
                                        {orderDetails.cartOrderFK && orderDetails.cartOrderFK[0] && orderDetails.cartOrderFK[0].productFK ? (
                                            orderDetails.cartOrderFK[0].productFK.map((product, index) => (
                                                <div key={product._id}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginBottom: '20px',
                                                        padding: '10px',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                    }}>
                                                        <img src={product.photo} alt={product.name} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
                                                        <div>
                                                            <h3 style={{ marginBottom: '5px' }}>{product.name}</h3>
                                                            <p style={{ margin: '5px 0' }}>Quantity: {orderDetails.cartOrderFK[0].quantityProduct[index]}</p>
                                                            <p style={{ margin: '5px 0' }}>Price: ${product.price}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No product details available</p>
                                        )}
                                        <hr className="mb-4" style={{ backgroundColor: '#e0e0e0', opacity: 1 }} />
                                        <div className="col-md-10">
                                            <div className="progress" style={{ height: '20px', backgroundColor: '#ddd' }}>
                                                <div className="progress-bar" style={{ width: progress, backgroundColor: color }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <p>Order Status: {orderDetails.statusOrder.charAt(0).toUpperCase() + orderDetails.statusOrder.slice(1)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between pt-2">
                                    <p className="fw-bold mb-0">Order Details</p>
                                    <p className="text-muted mb-0">
                                        <span className="fw-bold me-4"><FontAwesomeIcon icon={faMoneyBillAlt} /></span>
                                        {orderDetails.payMethod}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between pt-2">
                                    <p className="text-muted mb-0">Order Number : {orderDetails.orderNb}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="text-muted mb-0">{new Date(orderDetails.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="card-footer border-0 px-4 py-5"
                                style={{ backgroundColor: '#f7a4a4', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
                                <h5 className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">Total: <span className="h5 mb-0 ms-2">${orderDetails.totalPrice}</span></h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="card" style={{ borderRadius: '10px' }}>
                            <div className="card-header px-4 py-5">
                                <h5 className="text-muted mb-0">The Information About Restaurant</h5>
                            </div>
                            <div className="card-body p-4">
                                <p><FontAwesomeIcon icon={faBuilding} style={{ marginRight: "30px" }} /> {orderDetails.restaurantFK?.nameRes}</p>
                                <p><FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: "30px" }} /> {orderDetails.restaurantFK?.address}</p>
                                <p><FontAwesomeIcon icon={faUtensils} style={{ marginRight: "30px" }} /> {orderDetails.restaurantFK?.cuisineType}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderDetails;
