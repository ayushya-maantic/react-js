
import React, {useState, useEffect} from 'react';
import FormMaker from './formmaker';
const API_HOST = "http://localhost:3002";
const endpoint = "/email_templates"
function NotifAdd() {
    const [inputs, setInputs] = useState({});
    const [formstatus, setFormstatus] = useState('');
    const [possvals, setPossvals] = useState([]);
    
    
    const settingID = () => {
      fetch(`${API_HOST}/customers/getPoss?n=ID`)
      .then(resp => resp.json())
      .then(response => {
      if(response.v == 'Empty') setPossvals([])
      else setPossvals(response.v[0].vals.split(','))})
    }
    
    const handleChange = (event) => {
      var name = event.target.name;
      var value = event.target.value;
      if(event.target.type == "number"){
        event.target.value = 1;
      }
      setInputs(values => ({...values, [name]: value}))
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
      var valid = false
      inputs.Subject.length <= 500 ? inputs.Content.length <= 2000 ? valid = true : console.log('Content should be less than 2000 chars') : console.log('Subject should be lesser than 500 chars') 
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs)
      };
      if(valid){
        fetch(`${API_HOST}${endpoint}`, requestOptions)
          .then(response => response.json().then(json => setFormstatus(json.m)))
      }
        console.log(inputs)
  }

  useEffect(() => {
    settingID();
  },[])
  
  return (
    <FormMaker formfields = {
      {fields: 
        [
          ['Name', 'Name', 'text', true],
          ['Create Date', 'CreateDate', 'datetime-local', true],
          ['Content', 'Content', 'textarea', false],
          ['Subject', 'Subject', 'text', false],
          ['Notification Type', 'NotificationType', 'select', true, ['Teams','Email']],
          ['EventType', 'EventType', 'text', true],
          ['Organization ID', 'OrganizationID', 'select', true, possvals]
        ]
      }
    } os = {handleSubmit} oc = {handleChange} ip = {inputs} fs = {formstatus}
      />
  )
}

export default NotifAdd;
