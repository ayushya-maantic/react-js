
import React from 'react';
import axios from 'axios';
import getCookie from './cookieexport';

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

function SearchFilter({ cols, showParams, setshowParams, possvals, setPossvals, API_HOST }) {
  const changeValue = (e) => {
    axios.get(`${API_HOST}/getPoss?n=${e.target.value}`)
      .then(response => {
        if (response.data.v == 'Empty') setPossvals([])
        else setPossvals(response.data.v[0].vals.split(','))
      })
  }


  const changeFilter = (e) => {
    var temp = document.querySelector('#header').value
    if (e.target.value == 'CLEAR' || e.target.value == ' ') {
      setshowParams(values => {
        const copy = { ...values };
        delete copy[temp];
        return copy;
      });
    }
    else {
      console.log(showParams)
      setshowParams(values => ({ ...values, [temp]: e.target.value }))
    }
  }

  const activity = (e) => {
    if (e.target.checked) setshowParams(values => ({ ...values, 'active': '1' }))
    else setshowParams(values => ({ ...values, 'active': '0' }))
  }
  return (
    <>
      <select name="header" id="header" aria-label='search' onChange={(e) => changeValue(e)}>
        <option value=" "> </option>
        {
          cols.fields.map(c => (
            c[2] == 'text' ? <option value={c[1]}>{c[1]}</option> : true
          ))
        }
      </select>
      <select name="val" id="val" aria-label='searchval' onChange={(e) => changeFilter(e)}>
        <option value=" "> </option>
        <option value="CLEAR">CLEAR</option>
        {possvals.map(val => (
          <option key={val} accessKey={val} value={val} aria-label="pval">{val}</option>
        ))}
      </select>
      <p>
        {
          cols.fields.map(c => (
            c[2] == 'text' ?
              <>{c[1]} : {(showParams.hasOwnProperty(c[1])) ? showParams[c[1]] : '-'} <br /></>
              :
              true
          ))
        }


      </p>
      <input type="checkbox" id="active" name="active" value="active" onChange={(e) => activity(e)} />
      <label>Active</label><br /><br />
    </>
  )
}

export default SearchFilter;