import { RequiredFieldError } from '@/validation/errors'
import { RequireFieldValidation } from './required-field-validation'

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const sut = new RequireFieldValidation('email')
    const error = sut.validate('')
    expect(error).toEqual(new RequiredFieldError())
  })
})
