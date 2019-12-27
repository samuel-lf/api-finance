'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardSchema extends Schema {
  up () {
    this.create('cards', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id')
      .inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
      table.string('name').notNullable()
      table.float('limit_value').notNullable()
      table.float('available_value').notNullable()
      table.date('due_date')
      table.timestamps()
    })
  }

  down () {
    this.drop('cards')
  }
}

module.exports = CardSchema
