import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMediaUrl } from '../utils/image'
import { orders as ordersApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        const fetchOrders = async () => {
            try {
                const data = await ordersApi.getAll()
                setOrders(data)
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [isAuthenticated, navigate])

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="container-custom">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                        <h2 className="text-xl font-medium mb-4">No orders yet</h2>
                        <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
                        <Link to="/collections" className="btn-primary inline-block">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                                        <div>
                                            <p className="text-sm text-gray-500">Order Placed</p>
                                            <p className="font-medium text-primary">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-medium text-primary">₹{order.total_amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Order #</p>
                                            <p className="font-medium text-primary">{order.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            } capitalize`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-6">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex gap-6">
                                                <div className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                                    <img
                                                        src={getMediaUrl(item.product.images?.[0])}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-primary">{item.product.name}</h3>
                                                    <p className="text-gray-500 text-sm mt-1">
                                                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                                                    </p>
                                                    <p className="text-primary font-medium mt-2">₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders
