'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WalletSchema extends Schema {
  up () {
    this.create('wallets', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id')
      .inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
      table.string('name').notNullable()
      table.float('value').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('wallets')
  }
}

module.exports = WalletSchema
