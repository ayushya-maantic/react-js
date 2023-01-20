
import React from 'react';

function SearchFilter({cols, showParams, setshowParams, possvals, setPossvals, API_HOST}) {
    const changeValue = (e) => {
        fetch(`${API_HOST}/getPoss?n=${e.target.value}`)
        .then(resp => resp.json())
        .then(response => {
          if(response.v == 'Empty') setPossvals([])
          else setPossvals(response.v[0].vals.split(','))})
      }
    
      const changeFilter = (e) => {
        var temp = document.querySelector('#header').value
        if(e.target.value == 'CLEAR' || e.target.value == ' '){
          setshowParams(values => {
            const copy = {...values};
            delete copy[temp];
            return copy;
            });
        }
        else{
          console.log(showParams)
          setshowParams(values => ({...values, [temp]: e.target.value}))
        }
      }

      const activity = (e) => {
        if(e.target.checked) setshowParams(values => ({...values, 'active': '1'}))
        else setshowParams(values => ({...values, 'active': '0'}))
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
                <option key = {val} accessKey = {val} value={val} aria-label = "pval">{val}</option>
              ))}
            </select>
            <p>
              {
                cols.fields.map(c => (
                    c[2] == 'text' ?
                  <>{c[1]} : {(showParams.hasOwnProperty(c[1])) ? showParams[c[1]] : '-' } <br /></>
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