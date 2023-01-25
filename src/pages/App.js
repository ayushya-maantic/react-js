
import React, { useState } from 'react';
import FormMaker from './formmaker';
import axios from 'axios';
import getCookie from './cookieexport'
const API_HOST = "http://localhost:3002/customers";

axios.interceptors.request.use(function (config) {
  var token = getCookie('accesskey');
  if (token.length > 1) {
    config.headers.accesskey = token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});

function App() {
  const [inputs, setInputs] = useState({});
  const [formstatus, setFormstatus] = useState('');

  const handleChange = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    if (event.target.type == "number") {
      event.target.value = 1;
    }
    setInputs(values => ({ ...values, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const email_reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const timezone_reg = /^[A-Z]{3}$/;
    const url_reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
    var valid = false;
    email_reg.test(inputs.EmailID) ? timezone_reg.test(inputs.TimeZone) ? valid = true : console.log('Invalid Timezone') : console.log('Invalid Email ID');
    if (valid && url_reg.test(inputs.AppBaseLink)) {
      axios.post(`${API_HOST}`, inputs, { 'headers': { 'Content-Type': 'application/json' } })
        .then(res => { setFormstatus(res.data.m) })
    }
  }

  return (
    <FormMaker formfields={
      {
        fields:
          [
            ['Client Name', 'ClientName', 'text', true],
            ['Email ID', 'EmailID', 'email', true],
            ['App Base Link', 'AppBaseLink', 'text', true],
            ['Logo Image', 'LogoImage', 'text', false],
            ['Time Zone', 'TimeZone', 'text', true],
            ['Cntr Rplc MMnth', 'CntrRplcMMnth', 'number', false],
            ['Hrs Per Day', 'HrsPerDay', 'number', true],
            ['No Of Wrk Day', 'NoOfWrkDay', 'number', true],
            ['Rplc Budget Allowed', 'RplcBudgetAllowed', 'number', true],
            ['First Asmnt Months', 'FirstAsmntMonths', 'number', true],
            ['Assess Reminder Due Day', 'AssessReminderDueDay', 'number', true],
          ]
      }
    } os={handleSubmit} oc={handleChange} ip={inputs} fs={formstatus}
    />
  )
}

export default App;
