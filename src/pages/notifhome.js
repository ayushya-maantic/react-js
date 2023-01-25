
import React, { useEffect, useState } from 'react';
import FormMaker from './formmaker';
import SearchFilter from './searchfilter';
import axios from 'axios';
import getCookie from './cookieexport'
const API_HOST = "http://localhost:3002";
const endpoint = "/email_templates"

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

function NotifHome(props) {

  const [items, setItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [total, setTotal] = useState(0);
  const [formstatus, setFormstatus] = useState('');
  const [inputs, setInputs] = useState({});
  const [possvals, setPossvals] = useState([]);
  const [orgids, setOrgids] = useState([]);
  const [showParams, setshowParams] = useState({})

  const cols = {
    fields:
      [
        ['Name', 'Name', 'text', true],
        ['Create Date', 'CreateDate', 'datetime-local', true],
        ['Content', 'Content', 'textarea', false],
        ['Subject', 'Subject', 'text', false],
        ['Notification Type', 'NotificationType', 'select', true, ['Teams', 'Email']],
        ['EventType', 'EventType', 'text', true],
        ['Organization ID', 'OrganizationID', 'select', true, orgids]
      ]
  }


  const handleChange = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    if (event.target.type == "number") {
      event.target.value = 1;
    }
    if (event.target.type == "checkbox") {
      event.target.checked ? event.target.value = '1' : event.target.value = '0'
    }
    setInputs(values => ({ ...values, [name]: value }))
  }

  const settingID = () => {
    axios.get(`${API_HOST}/customers/getPoss?n=ID`)
      .then(response => {
        if (response.data.v == 'Empty') setOrgids([])
        else setOrgids(response.data.v[0].vals.split(','))
      })
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    var valid = false
    inputs.Subject.length <= 500 ? inputs.Content.length <= 2000 ? valid = true : console.log('Content should be less than 2000 chars') : console.log('Subject should be lesser than 500 chars')

    if (valid) {
      axios.post(`${API_HOST}${endpoint}/update`, inputs, { 'headers': { 'Content-Type': 'application/json' } })
        .then(res => { setFormstatus(res.data.m); fetchInventory(1); fetchCount(); })
    }
    console.log(inputs)
  }


  const doChange = (j) => {
    for (const [name, value] of Object.entries(j)) {
      setInputs(values => ({ ...values, [name]: value }))
    }
    console.log(inputs)
  }

  const fetchInventory = (num) => {
    var urlParameters = Object.entries(showParams).map(e => e.join('=')).join('&');
    axios.get(`${API_HOST}${endpoint}/${num}?${urlParameters}`).then(res => setItems(eval(res.data.r)))

  }

  const asc = (key) => {
    setshowParams(values => ({ ...values, 'asc': key }))
    setshowParams(values => { const copy = { ...values }; delete copy['desc']; return copy; });
  }
  const desc = (key) => {
    setshowParams(values => ({ ...values, 'desc': key }))
    setshowParams(values => { const copy = { ...values }; delete copy['asc']; return copy; });
  }

  const showall = () => {
    setshowParams({});
    fetchInventory(1);
    fetchCount();
  }
  const handleClick = (k) => {
    console.log('this is:', k.target.accessKey);
    fetchInventory(Number(k.target.accessKey));
  };

  const fetchCount = () => {
    var urlParameters = Object.entries(showParams).map(e => e.join('=')).join('&');
    axios.get(`${API_HOST}${endpoint}/count?${urlParameters}`)
      .then(res => {
        setTotal(Number(res.data.c));
        setPages(Array.from({ length: Math.ceil(Number(res.data.c) / 5) }, (_, i) => i + 1));
      })
  }

  // Calling the function on component mount
  useEffect(() => {
    fetchInventory(1);
    fetchCount();
    settingID();
  }, [showParams])
  // console.log(data.items)
  return (
    <div className="c" data-testid="main-table" onChange={() => { }}>
      <h1>Notification Table</h1>
      <SearchFilter cols={cols} showParams={showParams} setshowParams={setshowParams} possvals={possvals} setPossvals={setPossvals} API_HOST={`${API_HOST}${endpoint}`} />
      <button key="all" onClick={() => { showall() }}>View All</button><br /><br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">ID<button onClick={() => desc('ID')}>&uarr;</button><button onClick={() => asc('ID')}>&darr;</button> </th>
            {
              cols.fields.map(c => (
                <th scope="col">{c[0]} <button onClick={() => desc(c[1])}>&uarr;</button><button onClick={() => asc(c[1])}>&darr;</button> </th>
              )
              )
            }
            <th scope="col">Active<button onClick={() => desc('Active')}>&uarr;</button><button onClick={() => asc('Active')}>&darr;</button> </th>
          </tr>
        </thead>
        <tbody data-testid="table-body">
          {
            items.map(item => (
              <tr key={item.ID} accessKey={item.ID} onClick={() => doChange(item)} role="entry">
                <td>{item.ID}</td>
                <td>{item.Name}</td>
                <td>{item.CreateDate}</td>
                <td>{item.Content}</td>
                <td>{item.Subject}</td>
                <td>{item.NotificationType}</td>
                <td>{item.EventType}</td>
                <td>{item.OrganizationID}</td>
                <td>{Number(item.Active) ? 'Y' : 'N'}</td>
              </tr>
            ))
          }
        </tbody>

      </table>
      {
        pages.map(page => (
          <button key={page} accessKey={page} onClick={(e) => handleClick(e)}>Page {page}</button>
        ))
      }<br></br>
      {total} entries
      <br /><br />
      <FormMaker formfields={cols} os={handleSubmit} oc={handleChange} ip={inputs} fs={formstatus} />
    </div>
  )

}

export default NotifHome;