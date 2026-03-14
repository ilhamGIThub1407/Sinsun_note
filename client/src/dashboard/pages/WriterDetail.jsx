import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { base_url } from '../../config/config'
import storeContext from '../../context/storeContext'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa'

const WriterDetail = () => {
    const { writer_id } = useParams()
    const navigate = useNavigate()
    const { store } = useContext(storeContext)
    
    const [writer, setWriter] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const get_writer = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get(`${base_url}/api/news/writer/${writer_id}`, {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                })
                setWriter(data.writer)
            } catch (error) {
                console.log(error)
                toast.error('Failed to load writer data')
                navigate('/dashboard/writers')
            } finally {
                setLoading(false)
            }
        }
        
        get_writer()
    }, [writer_id])

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success('Copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className='bg-white rounded-md p-6 flex justify-center items-center h-64'>
                <p className='text-gray-500'>Loading...</p>
            </div>
        )
    }

    if (!writer) {
        return (
            <div className='bg-white rounded-md p-6'>
                <p className='text-red-500'>Writer not found</p>
            </div>
        )
    }

    return (
        <div className='bg-white rounded-md p-6'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6 pb-4 border-b'>
                <button 
                    onClick={() => navigate('/dashboard/writers')}
                    className='p-2 hover:bg-gray-100 rounded-md transition'
                >
                    <FaArrowLeft className='text-gray-600' />
                </button>
                <h2 className='text-2xl font-bold'>Writer Profile</h2>
            </div>

            {/* Profile Content */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Avatar Section */}
                <div className='flex flex-col items-center justify-center'>
                    <div className='w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-4'>
                        {writer.image ? (
                            <img 
                                src={writer.image} 
                                alt={writer.name} 
                                className='w-full h-full rounded-full object-cover'
                            />
                        ) : (
                            <span className='text-5xl text-white font-bold'>
                                {writer.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <h3 className='text-xl font-bold text-gray-800 text-center'>{writer.name}</h3>
                    <p className='text-sm text-gray-500 capitalize mt-1'>{writer.role}</p>
                </div>

                {/* Details Section */}
                <div className='md:col-span-2 space-y-4'>
                    {/* Email */}
                    <div className='border rounded-md p-4 bg-gray-50'>
                        <label className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Email</label>
                        <div className='flex items-center justify-between mt-2'>
                            <p className='text-gray-800 font-medium break-all'>{writer.email}</p>
                            <button 
                                onClick={() => copyToClipboard(writer.email)}
                                className='ml-2 p-2 hover:bg-gray-200 rounded transition'
                                title='Copy email'
                            >
                                <FaCopy className='text-gray-600' />
                            </button>
                        </div>
                    </div>

                    {/* Password */}
                    <div className='border rounded-md p-4 bg-gray-50'>
                        <label className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Password</label>
                        <div className='flex items-center justify-between mt-2'>
                            <p className='text-gray-800 font-medium font-mono tracking-wider'>
                                {showPassword ? writer.plainPassword : '•'.repeat(writer.plainPassword.length)}
                            </p>
                            <div className='flex gap-2 ml-2'>
                                <button 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='p-2 hover:bg-gray-200 rounded transition'
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className='text-gray-600' />
                                    ) : (
                                        <FaEye className='text-gray-600' />
                                    )}
                                </button>
                                <button 
                                    onClick={() => copyToClipboard(writer.plainPassword)}
                                    className='p-2 hover:bg-gray-200 rounded transition'
                                    title='Copy password'
                                >
                                    <FaCopy className='text-gray-600' />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className='border rounded-md p-4 bg-gray-50'>
                        <label className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Category</label>
                        <p className='text-gray-800 font-medium mt-2'>{writer.category}</p>
                    </div>

                    {/* Member Since */}
                    <div className='border rounded-md p-4 bg-gray-50'>
                        <label className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Member Since</label>
                        <p className='text-gray-800 font-medium mt-2'>
                            {new Date(writer.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md'>
                <p className='text-sm text-blue-800'>
                    <strong>Note:</strong> This page displays sensitive information including the writer's password. 
                    Please handle this information securely and do not share it unnecessarily.
                </p>
            </div>
        </div>
    )
}

export default WriterDetail
