import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'
import 'jest-localstorage-mock'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}
type SutParams = {
  validationError: string
}
const history = createMemoryHistory({ initialEntries: ['/login'] })
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  )
  return {
    sut,
    authenticationSpy
  }
}

const simulateValidateSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.random.words()): Promise<void> => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}
const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}
const populatePasswordField = (sut: RenderResult, password = faker.random.words()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}
const testStatusFormField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const emailStatus = sut.getByTestId(`${fieldName}-status`)
  expect(emailStatus.title).toBe(validationError || 'Todo correcto!')
  expect(emailStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}
const testErrorWrapperChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}
const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const ErrorWrapper = sut.getByTestId(fieldName)
  expect(ErrorWrapper).toBeTruthy()
}
const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
  const el = sut.getByTestId(fieldName)
  expect(el.textContent).toBe(text)
}
const testButonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login Component', () => {
  afterEach(cleanup)
  beforeEach(() => {
    localStorage.clear()
  })
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    testErrorWrapperChildCount(sut, 0)
    testButonIsDisabled(sut, 'submit', true)
    testStatusFormField(sut, 'email', validationError)
    testStatusFormField(sut, 'password', validationError)
  })
  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populateEmailField(sut)
    testStatusFormField(sut, 'email', validationError)
  })
  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populatePasswordField(sut)
    testStatusFormField(sut, 'password', validationError)
  })
  test('Should show valid email state if Validation succeds', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    testStatusFormField(sut, 'email')
  })
  test('Should show valid password state if Validation succeds', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    testStatusFormField(sut, 'password')
  })
  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    testButonIsDisabled(sut, 'submit', false)
  })
  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidateSubmit(sut)
    testElementExists(sut, 'spinner')
  })
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.random.words()
    await simulateValidateSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })
  test('Should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidateSubmit(sut)
    await simulateValidateSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })
  test('Should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    await simulateValidateSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })
  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValue(Promise.reject(error))
    await simulateValidateSubmit(sut)
    testElementText(sut, 'main-error', error.message)
    testErrorWrapperChildCount(sut, 1)
  })
  test('Should add accessToken to localsorage on success', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidateSubmit(sut)
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })
  test('Should go to signup page', () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
