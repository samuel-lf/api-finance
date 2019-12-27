'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')
class UserController {
  async create({ request, response }) {
    try {
      const errorMessage = {
        'name.required': 'Esse campo é obrigatório',
        'name.min': 'o username deve ter mais que 3 caracteres',
        'username.required': 'Esse campo é obrigatório',
        'username.unique': 'Esse usuário já existe',
        'username.min': 'o username deve ter mais que 5 caracteres',
        'email.required': 'Esse campo é obrigatório',
        'email.unique': 'Esse email já foi registrado',
        'email.email': 'email inválido',
        'password.required': 'Esse campo é obrigatório',
        'password.min': 'o password deve ter mais que 5 caracteres',
      }

      const validation = await validateAll(request.all(),{
        name: 'required|min:3',
        username: 'required|min:5|unique:users',
        email: 'required|email|unique:users',
        password: 'required|min:5'
      }, errorMessage)

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const data = request.only(["name","username", "email", "password"]);
      const user = await User.create(data)

      return user
      
    } catch (error) {
      return response.status(500).send({error: `Error: ${error.message}`})
    }
  }

  async login({ request, response, auth }) {
    try {

      const { email, password } = request.all();

      const validaToken = await auth.attempt(email, password)

      return validaToken
      
    } catch (error) {
      return response.status(500).send({error: `Error: ${error.message}`})
    }

  }
}

module.exports = UserController
