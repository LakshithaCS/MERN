import React,{useState} from 'react';
import Template from './template';
import Logo from './logo';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  
  const logo = <Logo /> //logo of the page
  const form = <Form /> //registration form

  //return template --> left side = logo , right side = registration form 
  return (
    <div>
      <Template left={logo} right={form} />
    </div>
  );
}


function Form() {

  //states
   const [data, setData] = useState({

    name : "",
    email : "" ,
    password : "",
    cpassword : ""

   });

   //update changes
   const handleChange = e => {
            const { name, value } = e.target;
            setData(prevState => ({
                ...prevState,
                [name]: value
            }));
        };

  //submit - post
  const handleSubmit = (evt) => {
    evt.preventDefault();
    axios.post('http://localhost:5000/api/auth/register',data)
  
    .then(function (response) {
      console.log(response);
    })
  
    .catch(function (error) {
    console.log(error);
    });
  }

  return (

      <form onSubmit={handleSubmit}>
        <div className="text-center">
          <h1>Register</h1>
        </div>
        
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input type="Name" className="form-control" id="fullName"
          name="name" onChange={handleChange}></input>
        </div>

        <div className="mb-3">
          <label htmlFor="Email1" className="form-label">Email</label>
          <input type="email" className="form-control" id="Email1" aria-describedby="emailHelp"
          name="email" onChange={handleChange}></input>
        </div>
  
        <div className="mb-3">
          <label htmlFor="Password1" className="form-label">Password</label>
          <input type="password" className="form-control" id="Password1"
          name="password" onChange={handleChange}></input>
        </div>

        <div className="mb-3">
          <label htmlFor="Password2" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="Password2"
          name="cpassword" onChange={handleChange}></input>
        </div>

        <label className="custom-file-label" htmlFor="validatedCustomFile">Confirmation Letter</label>
        <div className="mb-3">
          <input type="file" className="custom-file-input" id="validatedCustomFile" required></input>
          <div className="invalid-feedback">Choose Correct Format</div>
        </div>
 
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-block btn-primary">Register</button>
        </div>

        <div>
          <small>Already have an account? <Link to='/Login'>Login</Link></small>
        </div>
      </form>
  );
}