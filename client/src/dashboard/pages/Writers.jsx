import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaEye, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { base_url } from '../../config/config'
import storeContext from '../../context/storeContext'
import toast from 'react-hot-toast'


const Writers = () => {

  const { store } = useContext(storeContext)
  const [writers, setWriters] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    writer_id: null,
    writer_name: ''
  })

  const get_writers = async () => {
    try {

      const { data } = await axios.get(`${base_url}/api/news/writers`, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      })
      setWriters(data.writers)
    } catch (error) {
      console.log(error)
    }
  }

  const delete_writer = async () => {
    try {
      setLoading(true)
      const { data } = await axios.delete(`${base_url}/api/news/writer/delete/${deleteModal.writer_id}`, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      })
      setLoading(false)
      toast.success(data.message)
      setDeleteModal({
        show: false,
        writer_id: null,
        writer_name: ''
      })
      get_writers()
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to delete writer')
    }
  }

  useEffect(() => {
    get_writers()
  }, [])
  return (
    <div className='bg-white rounded-md'>
      <div className='flex justify-between p-4'>
        <h2 className='text-xl font-medium'>Writers</h2>
        <Link className='px-3 py-[6px] bg-[#0047A0] rounded-sm text-white hover:bg-[#002F6C]' to='/dashboard/writer/add'>Add Writer</Link>
      </div>
      <div className='relative overflow-x-auto p-4'>
        <table className='w-full text-sm text-left text-slate-600'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th className='px-7 py-3'>No</th>
              <th className='px-7 py-3'>Name</th>
              <th className='px-7 py-3'>Category</th>
              <th className='px-7 py-3'>Role</th>
              <th className='px-7 py-3'>Image</th>
              <th className='px-7 py-3'>Email</th>
              <th className='px-7 py-3'>Active</th>
            </tr>
          </thead>
          <tbody>
            {
              writers.map((r, i) => <tr key={i} className='bg-white border-b' >
                <td className='px-6 py-4'>{i + 1}</td>
                <td className='px-6 py-4'>{r.name}</td>
                <td className='px-6 py-4'>{r.category}</td>
                <td className='px-6 py-4'>{r.role}</td>
                <td className='px-6 py-4'>
                  <img className='w-[40px] h-[40px]' src="https://res.cloudinary.com/dpj4vsqbo/image/upload/v1696952625/news/g7ihrhbxqdg5luzxtd9y.webp" alt="" />
                </td>
                <td className='px-6 py-4'>{r.email}</td>
                <td className='px-6 py-4'>
                  <div className='flex justify-start items-center gap-x-4 text-white'>
                    <Link to={`/dashboard/writer/${r._id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>
                    <button 
                      onClick={() => setDeleteModal({
                        show: true,
                        writer_id: r._id,
                        writer_name: r.name
                      })}
                      className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>)
            }
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4'>
            <h3 className='text-lg font-bold text-gray-800 mb-2'>Delete Writer</h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete <span className='font-semibold text-red-600'>{deleteModal.writer_name}</span>? 
              <br/>
              <span className='text-sm text-gray-500 mt-2 block'>This action cannot be undone.</span>
            </p>
            <div className='flex gap-3 justify-end'>
              <button 
                onClick={() => setDeleteModal({
                  show: false,
                  writer_id: null,
                  writer_name: ''
                })}
                disabled={loading}
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50'
              >
                Cancel
              </button>
              <button 
                onClick={delete_writer}
                disabled={loading}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50'
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Writers