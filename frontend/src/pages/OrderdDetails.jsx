import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { fetchOrderDetails } from '../redux/Slices/orderSlice';

const OrderdDetails = () => {
    const { id } = useParams();
    // const [orderDetials, setOrderDetails] = useState(null);
    const dispatch = useDispatch();
    const { orderDetials, loading, error } = useSelector((state) => state.orders)

    useEffect(() => {
        dispatch(fetchOrderDetails(id))
    },[dispatch, id])

    if (loading) {
        return <div className='text-center p-6'>Loading...</div>;
    }

    if (error) {
        return <div className='text-center p-6 text-red-500'>Error: {error}</div>;
    }

    // useEffect(() => {
    //     const mockOrderDetails = {
    //         _id: id,
    //         createdAt: new Date(),
    //         isPaid: true,
    //         isDelivered: false,
    //         paymentMethod: "PayPal",
    //         shippingMethod: "Standard Shipping",
    //         shippingAdress: { city: "New York", country: "USA" },
    //         orderItems: [
    //             {
    //                 productId: "1",
    //                 name: "Stylish Jacket",
    //                 size: "M",
    //                 color: "Black",
    //                 price: 120,
    //                 quantity: 2,
    //                 images: "https://picsum.photos/500/500?random=99",
    //             },
    //             {
    //                 productId: "2",
    //                 name: "Casual Sneakers",
    //                 size: 42,
    //                 color: "White",
    //                 price: 88,
    //                 quantity: 1,
    //                 images: "https://picsum.photos/500/500?random=26",
    //             },
    //         ],
    //     };
    //     setOrderDetails(mockOrderDetails);
    // }, [id])

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
            {!orderDetials ? (
                <p>No Order details found</p>
            ) : (
                <div className='p-4 sm:p-6 rounded-lg border ' >
                    {/* order info  */}
                    <div className="flex flex-col sm:flex-row justify-between mb-8">
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold">
                                Order ID:#{orderDetials._id}
                            </h3>
                            <p className="text-gray-600">
                                {new Date(orderDetials.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                            <span className={`${orderDetials.isPaid
                                ? "bg-green-100 text-green-700"
                                : "bg-green-100 text-red-700 "
                                } px-3 py-1 rounded-full text-sm font-medium mb-2`} >
                                {orderDetials.isPaid ? "Approved" : "Pending"}
                            </span>
                            <span className={`${orderDetials.isDelivered
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700 "
                                } px-3 py-1 rounded-full text-sm font-medium mb-2`} >
                                {orderDetials.isPaid ? "Deliverd" : "Pending Delivery"}
                            </span>
                        </div>
                    </div>
                    {/* customer , payment , shipping info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
                            <p className="text-gray-600">Payment Method: {orderDetials.paymentMethod}</p>
                            <p className="text-gray-600">Status: {orderDetials.isPaid ? "Paid" : "Not Paid"}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
                            <p className="text-gray-600">Shipping Method: {orderDetials.shippingMethod}</p>
                            <p className="text-gray-600">Address : {`${orderDetials.shippingAddress.city},${orderDetials.shippingAddress.country}`}</p>
                        </div>
                    </div>
                    {/* product list  */}
                    <div className="overflow-x-auto">
                        <h4 className="text-lg font-semibold mb-4">Products</h4>
                        <table className="min-w-full text-gray-600 mb-4">
                            <thead className="bg-gray-100 text-left ">
                                <tr>
                                    <th className="py-2 px-4">Name</th>
                                    <th className="py-2 px-4">Unit Price</th>
                                    <th className="py-2 px-4">Quantity</th>
                                    <th className="py-2 px-4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetials.orderItems.map((item) => (
                                    <tr key={item.productId} className=' border-b' >
                                        <td className="py-2 px-4 flex items-center">
                                            <img src={item.images} alt={item.name} className="w-12 h-12 object-cover rounded-lg mr-4" />
                                            <Link to={`/product/${item.productId}`} className="text-blue-500 hover:underline">
                                                {item.name}
                                            </Link>
                                        </td>
                                        <td className="px-2 py-4">${item.price}</td>
                                        <td className="px-2 py-4">{item.quantity}</td>
                                        <td className="px-2 py-4">${item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Back to orders linik  */}
                    <Link to="/my-orders" className='text-blue-500 hover:underline' >
                        Back to my Orders
                    </Link>
                </div>
            )}
        </div>
    )
}

export default OrderdDetails
