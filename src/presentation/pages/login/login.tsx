import React from 'react'
import Styles from './login-styles.scss'
import { Footer, LoginHeader, Input, FormStatus } from '@/presentation/components'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <form className={Styles.form}>
        <h2>Login</h2>
        <Input type="email" name="email" placeholder="Digite su email" />
        <Input type="password" name="password" placeholder="Digite su password" />
        <button className={Styles.submit} type="submit">Entrar</button>
        <span className={Styles.link}>Crear cuenta</span>
        <FormStatus />
      </form>
      <Footer />
    </div>
  )
}

export default Login
