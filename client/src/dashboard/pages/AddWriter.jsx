import React, { useContext, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { base_url } from '../../config/config'
import storeContext from '../../context/storeContext'


const AddWriter = () => {

  const navigate = useNavigate()
  const { store } = useContext(storeContext)

  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    category: ""
  })

  const [showPassword, setShowPassword] = useState(false)

  const inputHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }
  const [loader, setLoader] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoader(true)
      const { data } = await axios.post(`${base_url}/api/news/writer/add`, state, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      })
      setLoader(false)
      toast.success(data.message)
      navigate('/dashboard/writers')
    } catch (error) {
      setLoader(false)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className='bg-white rounded-md'>
      <div className='flex justify-between p-4'>
        <h2 className='text-xl font-medium'>Add writers</h2>
        <Link className='px-3 py-[6px] bg-[#0047A0] rounded-sm text-white hover:bg-[#002F6C]' to='/dashboard/writers'>Writers</Link>
      </div>
      <div className='p-4'>
        <form onSubmit={submit}>
          <div className='grid grid-cols-2 gap-x-8 mb-3'>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="name">Name</label>
              <input onChange={inputHandler} value={state.name} required type="text" placeholder='name' name='name' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-[#C72D38] h-10' id='name' />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="category">Category</label>
              <select onChange={inputHandler} value={state.category} required name='category' id='category' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-[#C72D38] h-10' >
                <option value="">---select category---</option>
                <option value="Korean Politics">Korean Politics</option>
                <option value="International Relations">International Relations</option>
                <option value="K-Culture & Entertainment">K-Culture & Entertainment</option>
                <option value="Sports & Esports Korea">Sports & Esports Korea</option>
                <option value="Technology & Innovation Korea">Technology & Innovation Korea</option>
                <option value="Health & Society Korea">Health & Society Korea</option>
              </select>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-x-8 mb-3'>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="email">Email</label>
              <input onChange={inputHandler} value={state.email} required type="email" placeholder='email' name='email' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-[#C72D38] h-10' id='email' />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="password">Password</label>
              <div className='relative'>
                <input
                  onChange={inputHandler}
                  value={state.password}
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder='password'
                  name='password'
                  id='password'
                  className='px-3 pr-10 py-2 rounded-md outline-0 border border-gray-300 focus:border-[#C72D38] h-10 w-full'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <button disabled={loader} className='px-3 py-[6px] bg-[#0047A0] rounded-sm text-white hover:bg-[#002F6C]' >{loader ? 'Loading...' : 'Add Writer'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddWriter