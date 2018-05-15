import React from "react";
import {validateAll} from './validation';

const InputItem = () => {
  const registrations = [
    {
      name: 'Login',
      placeholder: 'Login',
      type: 'text',
      id: 'login',
      requ: 'true',
      minL: '4',
      maxL: '20'
    },
    {
      name: 'Email',
      placeholder: 'Email',
      type: 'email',
      id: 'email',
      requ: 'true',
      minL: '5',
      maxL: '30'
    },
    {
      name: 'Password',
      placeholder: 'Password',
      type: 'password',
      id: 'password',
      requ: 'true',
      minL: '6',
      maxL: '35'
    },
    {
      name: 'Confirm password',
      placeholder: 'Re-enter password',
      type: 'password',
      id: 'confirmPassword',
      requ: 'true',
      minL: '6',
      maxL: '35'
    },
    {
      name: 'Full name',
      placeholder: 'Your name',
      type: 'text',
      id: 'firstName',
      minL: '2',
      maxL: '20'
    },
    {
      name: 'Age',
      placeholder: 'Age',
      type: 'number',
      id: 'age',
      min: '1',
      max: '99'
    }
  ];
  return registrations.map(registration => (
    <div className="form-group" key={registration.name}>
      <label className="sr-only" htmlFor={registration.id}>{registration.name}</label>
      <input className="form-control"
             type={registration.type}
             id={registration.id}
             placeholder={registration.placeholder}
             required={registration.requ}
             minLength={registration.minL}
             maxLength={registration.maxL}
             min={registration.min}
             max={registration.max}
             onChange={validateAll}
      />
    </div>))
};
export default InputItem;