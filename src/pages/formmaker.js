
import React from 'react';

function FormMaker({ formfields, os, oc, ip, fs }) {

  return (
    <>
      <form onSubmit={os} data-testid="add_form">
        {
          formfields.fields.map(i => (

            <>
              {
                i[2] == 'text' || i[2] == 'email' || i[2] == 'number' || i[2] == 'datetime-local' ?
                  <>
                    <label>{i[0]}:{i[3] ? <span>*</span> : <span></span>}
                      <input
                        type={i[2]}
                        name={i[1]}
                        aria-label={i[1]}
                        value={ip[i[1]] || ""}
                        onChange={oc}
                        required={i[3]}
                      />
                    </label><br />
                  </>
                  :
                  i[2] == 'textarea' ?
                    <>
                      <label>{i[0]}:{i[3] ? <span>*</span> : <span></span>}
                        <textarea
                          name={i[1]}
                          aria-label={i[1]}
                          value={ip[i[1]] || ""}
                          onChange={oc}
                          required={i[3]}
                        />
                      </label><br />
                    </>
                    :
                    i[2] == 'select' ?
                      <>
                        <label>{i[0]}:{i[3] ? <span>*</span> : <span></span>}
                          <select
                            name={i[1]}
                            aria-label={i[1]}
                            accessKey={i[1]}
                            value={ip[i[1]] || ""}
                            onChange={oc}
                            required={i[3]}
                          >
                            <option value="-"> </option>
                            {
                              i[4].map(ops => (
                                <option data-testid={i[1] + "option"} value={ops}>{ops}</option>
                              )
                              )
                            }
                          </select>
                        </label><br />
                      </>
                      :
                      <p>The form can not generate for type {i[2]}</p>
              }

            </>
          ))
        }
        <input type="submit" data-testid="submit" />
      </form>
      <p data-testid="Status">{fs}</p>
    </>
  )
}

export default FormMaker;
