export class RequiredFieldError extends Error {
  constructor () {
    super('Campo obligatorio')
    this.name = 'RequiredFieldError'
  }
}
