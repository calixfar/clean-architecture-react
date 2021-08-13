import React from 'react'
import faker from 'faker'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}
type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(<Login validation={validationStub} authentication={authenticationSpy} />)
  return {
    sut,
    authenticationSpy
  }
}

const simulateValidateSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.random.words()): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const submitButton = sut.getByTestId('submit')
  fireEvent.click(submitButton)
}
const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}
const populatePasswordField = (sut: RenderResult, password = faker.random.words()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}
const simulateStatusFormField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const emailStatus = sut.getByTestId(`${fieldName}-status`)
  expect(emailStatus.title).toBe(validationError || 'Todo correcto!')
  expect(emailStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    const spinner = sut.getByTestId('error-wrap')
    expect(spinner.childElementCount).toBe(0)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
    simulateStatusFormField(sut, 'email', validationError)
    simulateStatusFormField(sut, 'password', validationError)
  })
  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populateEmailField(sut)
    simulateStatusFormField(sut, 'email', validationError)
  })
  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populatePasswordField(sut)
    simulateStatusFormField(sut, 'password', validationError)
  })
  test('Should show valid email state if Validation succeds', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    simulateStatusFormField(sut, 'email')
  })
  test('Should show valid password state if Validation succeds', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    simulateStatusFormField(sut, 'password')
  })
  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })
  test('Should show spinner on submit', () => {
    const { sut } = makeSut()
    simulateValidateSubmit(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })
  test('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.random.words()
    simulateValidateSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
  test('Should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidateSubmit(sut)
    simulateValidateSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })
  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    populateEmailField(sut)
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })
})
