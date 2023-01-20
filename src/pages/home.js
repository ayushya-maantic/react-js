
import React, {useEffect, useState} from 'react';
import SearchFilter from './searchfilter';
import FormMaker from './formmaker';
const API_HOST = "http://localhost:3002/customers";
const cols = {fields: 
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
function Add() {

    const [items, setItems] = useState([]);
    const [pages, setPages] = useState([]);
    const [total, setTotal] = useState(0);
    const [inputs, setInputs] = useState({});
    const [possvals, setPossvals] = useState([]);
    const [showParams, setshowParams] = useState({})
    const [formstatus, setFormstatus] = useState('');

  
    const handleChange = (event) => {
      var name = event.target.name;
      var value = event.target.value;
      if(event.target.type == "number"){
        event.target.value = 1;
      }
      if(event.target.type == "checkbox"){
        event.target.checked ? event.target.value = '1' : event.target.value = '0' 
      }
      setInputs(values => ({...values, [name]: value}))
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const email_reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const timezone_reg = /^[A-Z]{3}$/;
      const url_reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
      var valid = false;
      email_reg.test(inputs.EmailID) ? timezone_reg.test(inputs.TimeZone) ? valid = true : console.log('Invalid Timezone') : console.log('Invalid Email ID');
      if (valid && url_reg.test(inputs.AppBaseLink)){
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs)
      };
      fetch(`${API_HOST}/update`, requestOptions)
      .then(resp => resp.json())
          .then(response => {setFormstatus(response.m);
            fetchInventory(1);
            fetchCount();})
        // console.log(inputs)
    }
  }




  const doChange = (j) =>{
    for (const [name, value] of Object.entries(j)) {
        setInputs(values => ({...values, [name]: value})) 
      }
  }

    const fetchInventory = (num) => {
        var urlParameters = Object.entries(showParams).map(e => e.join('=')).join('&');
        fetch(`${API_HOST}/${num}?${urlParameters}`)
            .then(res => res.json()
            .then(json => {
                setItems(eval(json.r));
            }))

    }

    const asc = (key) => {
      setshowParams(values => ({...values, 'asc': key}))
      setshowParams(values => { const copy = {...values}; delete copy['desc']; return copy;});
    }
    const desc = (key) => {
      setshowParams(values => ({...values, 'desc': key}))
      setshowParams(values => { const copy = {...values}; delete copy['asc']; return copy;});
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
        fetch(`${API_HOST}/count?${urlParameters}`)
            .then(resp => {resp.json()
                .then((json) => {
                    setTotal(Number(json.c));
                    setPages(Array.from({length: Math.ceil(Number(json.c)/5)}, (_, i) => i + 1));})
            })
    }

    // Calling the function on component mount
    useEffect(() => {
        fetchInventory(1);
        fetchCount();
        
    },[showParams])
    // console.log(data.items)
     return (
        <div className="c" data-testid = "main-table" onChange={() => {}}>
            <h1>TS Org Table</h1><br/><br/>
            
            <SearchFilter cols={cols} showParams = {showParams} setshowParams={setshowParams} possvals = {possvals} setPossvals = {setPossvals} API_HOST = {API_HOST} />
            <button key="all" data-testid='viewall' onClick={() => {showall()}}>View All</button><br /><br />
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
                <tbody data-testid = "table-body">
                {
                        items.map(item => (
                            <tr key={item.ID} accessKey={item.ID} onClick = {() => doChange(item)} role="entry">
                                <td>{item.ID}</td>
                                {cols.fields.map(f => (
                                  <td>{item[f[1]]}</td>
                                ))}
                                <td>{ Number(item.Active) ? 'Y' : 'N'}</td>
                            </tr>
                        ))
                    }
                </tbody>
                    
            </table>
            {
                        pages.map(page => (
                            <button key={page} accessKey = {page} onClick = {(e) =>handleClick(e)}>Page {page}</button>
                        ))
                    }<br></br>
                    {total} entries
                    <br/><br/>
                    <FormMaker formfields = {cols} os = {handleSubmit} oc = {handleChange} ip = {inputs} fs = {formstatus}/>
        </div>
    )
    
}

export default Add;