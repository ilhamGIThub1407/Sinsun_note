import React, { useContext, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { base_url } from '../../config/config'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import storeContext from '../../context/storeContext'

const Login = () => {

  const navigate = useNavigate()
  const { dispatch } = useContext(storeContext)
  const [loader, setLoader] = useState(false)

  const [state, setState] = useState({
    email: "",
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)


  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoader(true)
      const { data } = await axios.post(`${base_url}/api/login`, state)
      setLoader(false)
      localStorage.setItem('newsToken', data.token)
      toast.success(data.message)
      dispatch({
        type: "login_success",
        payload: {
          token: data.token
        }
      })
      navigate('/dashboard')
    } catch (error) {
      setLoader(false)
      toast.error(error?.response?.data?.message || error.message || 'Login failed')
    }
  }



  return (
    <div className='min-w-screen min-h-screen bg-slate-200 flex justify-center items-center'>
      <div className='w-[340px] text-slate-600 shadow-md'>
        <div className='bg-white h-full px-7 py-8 rounded-md'>
          <div className='w-full justify-center items-center flex'>
            <img className='w-[200px] object-contain rounded-md' src="/wings_note.png" alt="wings note logo" />
          </div>
          <form onSubmit={submit} className='mt-8'>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="email">Email</label>
              <input value={state.email} required onChange={inputHandle} type="email" placeholder='email' name='email' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-[#C72D38] h-10' id='email' />
            </div>

            <div className='flex flex-col gap-y-2 mt-3'>
              <label className='text-md font-medium text-gray-600' htmlFor="password">Password</label>
              <div className='relative flex items-center'>
                <input
                  onChange={inputHandle}
                  required
                  value={state.password}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='password'
                  name='password'
                  className='px-3 pr-10 py-2 rounded-md outline-0 border border-gray-300 focus:border-[#C72D38] h-10 w-full'
                  id='password'
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
            <div className='mt-4'>
              <button disabled={loader} className='px-3 py-[6px] w-full bg-[#0047A0] rounded-sm text-white hover:bg-[#002F6C]' >{loader ? "loading..." : 'Login'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login