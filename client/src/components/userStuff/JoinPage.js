/* eslint-disable no-undef */
import 'bulma/bulma.sass'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { loginPopUp } from '../../helpers/popUps.js'


//import { getTokenFromLocalStorage } from '../helpers/authHelp'



const JoinPage = () => {
  // pass in props wether user clicked on the login or the register 
  // use conditional return to check each form. 
  //data is the same so . but is it worth it ? yes 
  // simple button will switch the condition to true or false if user has account or not 
  // easy 

  // eslint-disable-next-line no-unused-vars
  const [ wasLoginSuccess, setWasLoginSuccess ] = useState(null)
  console.log('🐝 ~ file: JoinPage.js ~ line 20 ~ wasLoginSuccess', wasLoginSuccess)
  const [isUserLoggedIn, setIsUserLoggedIn]  = useState(false)
  console.log('🐝 ~ file: JoinPage.js ~ line 14 ~ isUserLoggedIn', isUserLoggedIn)
  
  useEffect(() => {
    const token = window.localStorage.getItem('token')
    // const token = getTokenFromLocalStorage()
    console.log('🐝 ~ file: JoinPage.js ~ line 19 ~ token', token)
    setIsUserLoggedIn(!!token)
  },[isUserLoggedIn])


  const history = useHistory()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })
  
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })
  console.log(errors, setErrors)
  
  const handleChange = (event) => {
    console.log('LOGGING')
    const newFormData = { ...formData, [event.target.name]: event.target.value }
    setFormData(newFormData)
  }
  

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const dataToSend = formData
      console.log('🤖 ~ formData', formData)
      const response =  await axios.post('api/join', dataToSend)
      console.log('🟢 ~ file: JoinPage.js ~ line 44 ~ response', response)
      console.log('signup 🥳')
      if (response){
        //const formToSendToLogin = { }
        const username  =  formData.username 
        console.log('🐝 ~ file: JoinPage.js ~ line 66 ~ username', username)
        const password = formData.password
        const loginData = { usernameOrEmail: username, password: password }
        console.log('🐝 ~ file: JoinPage.js ~ line 69 ~ password', password)
        console.log('🐝 ~ file: JoinPage.js ~ line 67 ~ loginData', loginData)
        const loginResponse = await axios.post('api/login',loginData )
        console.log('🐝 ~ file: Login.js ~ line 26 ~ response', loginResponse.data.message)
        loginPopUp(true)
        window.localStorage.setItem('token',loginResponse.data.token)
      }
      history.push('/doodle') 
      //history.push('/login') //!change back to /
    } catch (err) {
      setErrors(err.response)
      console.log('🔴 ~ file: JoinPage.js ~ line 44 ~ response',err.response)
      //setWasLoginSuccess(false)
      loginPopUp(false)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('token')
    history.push('/login')
    // eslint-disable-next-line no-undef
    setIsUserLoggedIn(false)
  }

  return (
    <>
      { // check if user is logged in or not   
        isUserLoggedIn ? 
          <div className="box has-text-centered"> 
            <h1>you are logged in in already </h1>
            <button className='button is-danger' onClick={handleLogout} >Logout</button>
          </div>
          : //? conditional render 
          <div className="container has-text-centered">
            <div className="column is-4 is-offset-4">
              <div className="box">
                <p className="subtitle is-4">Please signup or login to proceed.</p>
                <br />
                <form className='signup-form' onSubmit={handleSubmit}>
                  <div className="field">
                    <p className="control has-icons-left has-icons-right">
                      <input className="input is-medium" 
                        name="username" 
                        placeholder="Username" 
                        value={formData.username}
                        onChange={handleChange}
                      />
                      <span className="icon is-medium is-left">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <span className="icon is-medium is-right">
                        <i className="fas fa-check"></i>
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <p className="control has-icons-left has-icons-right">
                      <input className="input is-medium" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <span className="icon is-medium is-left">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <span className="icon is-medium is-right">
                        <i className="fas fa-check"></i>
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <p className="control has-icons-left">
                      <input className="input is-medium" 
                      //type="password" 
                        name='password'
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleChange}
                        type='password'
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <p className="control has-icons-left">
                      <input className="input is-medium" 
                        name="passwordConfirmation" 
                        placeholder="Confirm Password" 
                        value={formData.passwordConfirmation}
                        onChange={handleChange}
                        type='password'
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                      </span>
                    </p>
                  </div>
              
                  <button className="button is-block is-info is-large is-fullwidth">Sign Up</button><br />
                
                </form>
              </div>
            

            </div>
          </div>
      }
    </>
  )
}

export default JoinPage
