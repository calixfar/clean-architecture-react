export class UnexpectedError extends Error {
  constructor () {
    super('Algo salío mal. Intenta nuevamente')
    this.name = 'UnexpectedError'
  }
}
