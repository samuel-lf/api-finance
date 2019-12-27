'use strict'

const Card = use('App/Models/Card')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with cards
 */
class CardController {
  /**
   * Show a list of all cards.
   * GET cards
   */
  async index ({ request, response, auth }) {
    const card = await Card.query().where('user_id', auth.user.id).fetch();
    
    return card
  }

  /**
   * Create/save a new card.
   * POST cards
   */
  async store ({ request, response, auth }) {
    const { id } = auth.user

    const data = request.only(["name", "limit_value", "available_value", "due_date"])
    
    const card = Card.create({...data, user_id: id})

    return card
  }

  /**
   * Display a single card.
   * GET cards/:id
   */
  async show ({ params, request, response, auth }) {
    const cards = await Database.select('*')
                                    .from('cards')
                                    .where('user_id', auth.user.id)
                                    .where('id', params.id)
    if(!cards){
      return response.status(404).send({message: 'Nenhum registro encontrado'})
    }

    return cards
  }


  /**
   * Update card details.
   * PUT or PATCH cards/:id
   */
  async update ({ params, request, response, auth }) {
    const { name, limit_value, available_value, due_date } = request.all()

    const card = await Card.query().where('id', params.id).where('user_id', '=', auth.user.id).first();

    if(!card){
      return response.status(404).send({message: 'Nenhum registro encontrado'})
    }

    card.name = name
    card.limit_value= limit_value
    card.available_value= available_value
    card.due_date = due_date
    card.id = params.id

    await card.save()

    return card
  }

  /**
   * Delete a card with id.
   * DELETE cards/:id
   */
  async destroy ({ params, request, response, auth }) {
    const card = await Card.query().where('id', params.id).where('user_id', '=', auth.user.id).first();

    if(!card){
      return response.status(404).send({message: 'Nenhum registro encontrado'})
    }
    await card.delete()
    
    return response.status(200).send({message: 'Registro removido'})
  }
}

module.exports = CardController
