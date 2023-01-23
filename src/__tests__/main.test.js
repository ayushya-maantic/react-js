import App from "../pages/App";
import Add from "../pages/home";

import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'

test('LOAD ADD PAGE', () =>{
    render(<App />)
    const form = screen.getByTestId('add_form')
    expect(form).toBeInTheDocument();
    expect(form).toContainElement(screen.getByTestId('submit'))
})

test('CREATE', async () => {
    const m = render(<App />)
    const form = m.getByTestId('add_form')
    expect(form).toBeInTheDocument();
    fireEvent.change(m.getByLabelText('ClientName'),{target: {value: 'Iamclient'}})
    fireEvent.change(m.getByLabelText('EmailID'),{target: {value: 'iamclient@gmail.com'}})
    fireEvent.change(m.getByLabelText('AppBaseLink'),{target: {value: 'https://www.client.app'}})
    fireEvent.change(m.getByLabelText('LogoImage'),{target: {value: 'Imagee'}})
    fireEvent.change(m.getByLabelText('TimeZone'),{target: {value: 'IST'}})
    fireEvent.change(m.getByLabelText('CntrRplcMMnth'),{target: {value: '4'}})
    fireEvent.change(m.getByLabelText('HrsPerDay'),{target: {value: '8'}})
    fireEvent.change(m.getByLabelText('NoOfWrkDay'),{target: {value: '5'}})
    fireEvent.change(m.getByLabelText('RplcBudgetAllowed'),{target: {value: '9'}})
    fireEvent.change(m.getByLabelText('FirstAsmntMonths'),{target: {value: '7'}})
    fireEvent.change(m.getByLabelText('AssessReminderDueDay'),{target: {value: '6'}})
    fireEvent.submit(form)
    await waitFor(() => expect(['ER_DUP_ENTRY','Added']).toContain(m.getByTestId('Status').textContent))
})

test('LOAD HOME PAGE', () => {
    const m = render(<Add />)
    const maindiv = m.getByTestId('main-table')
    expect(maindiv).toBeInTheDocument()
})

test('BASIC READ', async () => {
    const m = render(<Add />)
    await waitFor(() => expect(m.getAllByRole("entry").length).toBeGreaterThanOrEqual(1))
})

test('SEARCHBAR', async () => {
    const m = render(<Add />)
    const maindiv = m.getByTestId('main-table')
    expect(maindiv).toBeInTheDocument()
    expect(m.getByLabelText('search')).toBeInTheDocument()
    expect(m.getByLabelText('searchval')).toBeInTheDocument()
    fireEvent.change(m.getByLabelText('search'),{target: {value: 'ClientName'}})
    await waitFor(() => expect(m.getAllByLabelText('pval')))
    fireEvent.change(m.getByLabelText('searchval'),{target: {value: 'Iamclient'}})
    await waitFor(() => expect(m.getAllByRole("entry").length).toBe(1))
})

test('UPDATE' ,async() => {
    // const alertMock = jest.spyOn(window,'alert').mockImplementation();
    
    
    var m = render(<Add />)
    var maindiv = m.getByTestId('main-table')
    expect(maindiv).toBeInTheDocument()
    expect(m.getByLabelText('search')).toBeInTheDocument()
    expect(m.getByLabelText('searchval')).toBeInTheDocument()
    fireEvent.change(m.getByLabelText('search'),{target: {value: 'ClientName'}})
    await waitFor(() => expect(m.getAllByLabelText('pval')))
    fireEvent.change(m.getByLabelText('searchval'),{target: {value: 'Iamclient'}})
    await waitFor(() => expect(m.getAllByRole("entry").length).toBe(1))


    fireEvent.click(m.getByRole("entry"))
    await waitFor(() => expect(m.getByLabelText('ClientName')).toHaveValue('Iamclient'))
    var timezone = ''
    if(m.getByLabelText('TimeZone').value == 'IST') timezone = 'GMT'
    else timezone = 'IST'
    fireEvent.change(m.getByLabelText('TimeZone'),{target: {value: timezone}})
    const submit = m.getByTestId('submit')
    fireEvent.click(submit)
    await waitFor(() => expect(['Updated']).toContain(m.getByTestId('Status').textContent))
    // fireEvent.click(m.getByTestId('viewall'))


    // fireEvent.change(m.getByLabelText('search'),{target: {value: 'ClientName'}})
    // await waitFor(() => expect(m.getAllByLabelText('pval')))
    // fireEvent.change(m.getByLabelText('searchval'),{target: {value: 'Iamclient'}})
    expect(maindiv).toBeInTheDocument()
    expect(m.getByLabelText('search')).toBeInTheDocument()
    expect(m.getByLabelText('searchval')).toBeInTheDocument()
    fireEvent.change(m.getByLabelText('search'),{target: {value: 'ClientName'}})
    await waitFor(() => expect(m.getAllByLabelText('pval')))
    fireEvent.change(m.getByLabelText('searchval'),{target: {value: 'CLEAR'}})
    fireEvent.change(m.getByLabelText('searchval'),{target: {value: 'Iamclient'}})
    await waitFor(() => expect(m.getAllByRole("entry").length).toBe(1))

    await waitFor(() => expect(m.getByRole('entry').textContent).toContain(timezone))

})

