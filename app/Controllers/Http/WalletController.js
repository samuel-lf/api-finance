'use strict'
const Wallet = use('App/Models/Wallet')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with wallets
 */
class WalletController {
  /**
   * Show a list of all wallets.
   * GET wallets
   */
  async index ({ request, response, auth }) {
    // const wallet = await Wallet.query().where('user_id', auth.user.id).fetch();
    const wallet = await Database.select('name', 'value').from('wallets').where('user_id', auth.user.id);
    
    return wallet
  }

  /**
   * Create/save a new wallet.
   * POST wallets
   */
  async store ({ request, response, auth }) {
    const { id } = auth.user

    const data = request.only(["name", "value"])

    const wallet = Wallet.create({...data, user_id: id})

    return wallet
  }

  /**
   * Display a single wallet.
   * GET wallets/:id
   */
  async show ({ params, request, response, auth }) {
    const wallet = await Database.select('name', 'value')
                                    .from('wallets')
                                    .where('user_id', auth.user.id)
                                    .where('id', params.id)
    if(!wallet){
      return response.status(404).send({message: 'Nenhum registro encontrado'})
    }

    return wallet
  }

  /**
   * Update wallet details.
   * PUT or PATCH wallets/:id
   */
  async update ({ params, request, response, auth }) {
    const { name, value } = request.all()

    const wallet = await Wallet.query().where('id', params.id).where('user_id', '=', auth.user.id).first();

    if(!wallet){
      return response.status(404).send({message: 'Nenhum registro encontrado'})
    }
    
    wallet.name = name;
    wallet.value = value
    wallet.id = params.id

    await wallet.save()

    return wallet
  }

  /**
   * Delete a wallet with id.
   * DELETE wallets/:id
   */
  async destroy ({ params, request, response, auth }) {
    const wallet = await Wallet.query().where('id', params.id).where('user_id', '=', auth.user.id).first();

    if(!wallet){
      return response.status(404).send({message: 'Nenhum registro encontrado'})
    }

    await wallet.delete()

    return response.status(200).send({message: 'Registro removido'})
  }
}

module.exports = WalletController
