import { FieldValidationSpy } from '../test/mock-field-validation'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  sut
  fieldvalidationsSpy
}

const makeSut = (): SutTypes => {
  const fieldvalidationsSpy = [
    new FieldValidationSpy('any_field'),
    new FieldValidationSpy('any_field')
  ]
  const sut = new ValidationComposite(fieldvalidationsSpy)

  return {
    sut,
    fieldvalidationsSpy
  }
}

describe('ValidationComposite', () => {
  test('Should returns error if any validation fails', () => {
    const { sut, fieldvalidationsSpy } = makeSut()
    fieldvalidationsSpy[0].error = new Error('first_error_message')
    fieldvalidationsSpy[1].error = new Error('second_error_message')

    const error = sut.validate('any_field', 'any_value')
    expect(error).toBe('first_error_message')
  })
})
