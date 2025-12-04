import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { auth } from '../services/api'

const Profile = () => {
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [profileData, setProfileData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        const fetchProfile = async () => {
            try {
                const data = await auth.getProfile()
                setProfileData(data)
            } catch (error) {
                console.error('Failed to load profile:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [isAuthenticated, navigate])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-white">
            <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-serif font-bold text-primary mb-8">My Profile</h1>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-surface px-6 py-8 border-b border-gray-200 flex items-center gap-6">
                            <div className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-serif">
                                {profileData?.name?.charAt(0) || user?.first_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-primary">{profileData?.name || user?.first_name}</h2>
                                <p className="text-gray-500">{profileData?.email || user?.email}</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                    <p className="text-lg text-primary font-medium">{profileData?.name || user?.first_name || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                    <p className="text-lg text-primary font-medium">{profileData?.email || user?.email || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                    <p className="text-lg text-primary font-medium">{profileData?.phone || user?.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                                    <p className="text-lg text-primary font-medium">{profileData?.dob || user?.dob || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-primary mb-4">Account Actions</h3>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={handleLogout}
                                        className="btn-outline text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
