import NotifHome from "../pages/notifhome";
import NotifAdd from "../pages/notifadd";
import {render, screen, fireEvent, waitFor, getAllByLabelText, getAllByTestId} from '@testing-library/react'
import '@testing-library/jest-dom'

test('LOAD ADD PAGE', () =>{
    render(<NotifAdd />)
    const form = screen.getByTestId('add_form')
    expect(form).toBeInTheDocument();
    expect(form).toContainElement(screen.getByTestId('submit'))
})

test('CREATE', async () => {
    const m = render(<NotifAdd />)
    
    const form = m.getByTestId('add_form')
    expect(form).toBeInTheDocument();
    fireEvent.change(m.getByLabelText('Name'),{target: {value: 'Iamnotif'}})
    fireEvent.change(m.getByLabelText('CreateDate'),{target: {value: '2023-01-16T11:05'}})
    fireEvent.change(m.getByLabelText('Content'),{target: {value: 'Test Content'}})
    fireEvent.change(m.getByLabelText('Subject'),{target: {value: 'Test Subject'}})
    fireEvent.change(m.getByLabelText('NotificationType'),{target: {value: 'Teams'}})
    fireEvent.change(m.getByLabelText('EventType'),{target: {value: 'CREATEPOS'}})
    await waitFor(() => expect(m.getAllByTestId('OrganizationIDoption').length).toBeGreaterThanOrEqual(1)) 
    let options = m.getAllByTestId('OrganizationIDoption')
    fireEvent.change(m.getByLabelText('OrganizationID'),{target: {value: options[0].value}})
    fireEvent.submit(form)
    await waitFor(() => expect(['ER_DUP_ENTRY','Added']).toContain(m.getByTestId('Status').textContent))
})

test('LOAD HOME PAGE', () => {
    const m = render(<NotifHome />)
    const maindiv = m.getByTestId('main-table')
    expect(maindiv).toBeInTheDocument()
})

test('BASIC READ', async () => {
    const m = render(<NotifHome />)
    await waitFor(() => expect(m.getAllByRole("entry").length).toBeGreaterThanOrEqual(1))
})


test('SEARCHBAR', async () => {
    const m = render(<NotifHome />)
    const maindiv = m.getByTestId('main-table')
    expect(maindiv).toBeInTheDocument()
    expect(m.getByLabelText('search')).toBeInTheDocument()
    expect(m.getByLabelText('searchval')).toBeInTheDocument()
    fireEvent.change(m.getByLabelText('search'),{target: {value: 'Name'}})
    await waitFor(() => expect(m.getAllByLabelText('pval')))
    fireEvent.change(m.getByLabelText('searchval'),{target: {value: 'Iamnotif'}})
    await waitFor(() => expect(m.getAllByRole("entry").length).toBe(1))
})

test('UPDATE' ,async() => {
    
    var m = render(<NotifHome />)
    var maindiv = m.getByTestId('main-table')
    expect(maindiv).toBeInTheDocument()
    expect(m.getByLabelText('search')).toBeInTheDocument()
    expect(m.getByLabelText('searchval')).toBeInTheDocument()
    fireEvent.change(m.getByLabelText('search'),{target: {value: 'Name'}})
    await waitFor(() => expect(m.getAllByLabelText('pval')))
    fireEvent.change(m.getByLabelText('searchval'),{target: {value: 'Iamnotif'}})
    await waitFor(() => expect(m.getAllByRole("entry").length).toBe(1))


    fireEvent.click(m.getByRole("entry"))
    await waitFor(() => expect(m.getByLabelText('Name')).toHaveValue('Iamnotif'))
    var timezone = ''
    if(m.getByLabelText('EventType').value == 'CREATEPOS') timezone = 'UPDATEPOS'
    else timezone = 'CREATEPOS'
    fireEvent.change(m.getByLabelText('EventType'),{target: {value: timezone}})
    const submit = m.getByTestId('submit')
    fireEvent.click(submit)
    await waitFor(() => expect(['Updated']).toContain(m.getByTestId('Status').textContent))

    expect(maindiv).toBeInTheDocument()
    expect(m.getByLabelText('search')).toBeInTheDocument()
    expect(m.getByLabelText('searchval')).toBeInTheDocument()
    fireEvent.change(m.getByLabelText('search'),{target: {value: 'Name'}})
    await waitFor(() => expect(m.getAllByLabelText('pval')))
    fireEvent.change(m.getByLabelText('searchval'),{target: {value: 'CLEAR'}})
    fireEvent.change(m.getByLabelText('searchval'),{target: {value: 'Iamnotif'}})
    await waitFor(() => expect(m.getAllByRole("entry").length).toBe(1))

    await waitFor(() => expect(m.getByRole('entry').textContent).toContain(timezone))

})

