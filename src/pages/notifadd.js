
import React, { useState, useEffect } from 'react';
import FormMaker from './formmaker';
import axios from 'axios';
import getCookie from './cookieexport'
const API_HOST = "http://localhost:3002";
const endpoint = "/email_templates";

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

function NotifAdd() {
  const [inputs, setInputs] = useState({});
  const [formstatus, setFormstatus] = useState('');
  const [possvals, setPossvals] = useState([]);


  const settingID = () => {
    axios.get(`${API_HOST}/customers/getPoss?n=ID`)
      .then(response => {
        if (response.data.v == 'Empty') setPossvals([])
        else setPossvals(response.data.v[0].vals.split(','))
      })
  }

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
    var valid = false
    inputs.Subject.length <= 500 ? inputs.Content.length <= 2000 ? valid = true : console.log('Content should be less than 2000 chars') : console.log('Subject should be lesser than 500 chars')
    if (valid) {
      axios.post(`${API_HOST}${endpoint}`, inputs, { 'headers': { 'Content-Type': 'application/json' } })
        .then(res => { setFormstatus(res.data.m) })
    }
    console.log(inputs)
  }

  useEffect(() => {
    settingID();
  }, [])

  return (
    <FormMaker formfields={
      {
        fields:
          [
            ['Name', 'Name', 'text', true],
            ['Create Date', 'CreateDate', 'datetime-local', true],
            ['Content', 'Content', 'textarea', false],
            ['Subject', 'Subject', 'text', false],
            ['Notification Type', 'NotificationType', 'select', true, ['Teams', 'Email']],
            ['EventType', 'EventType', 'text', true],
            ['Organization ID', 'OrganizationID', 'select', true, possvals]
          ]
      }
    } os={handleSubmit} oc={handleChange} ip={inputs} fs={formstatus}
    />
  )
}

export default NotifAdd;
