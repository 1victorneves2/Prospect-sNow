import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const opportunities = sqliteTable(
  'opportunities',
  {
    id: text('id').primaryKey(),
    ownerId: text('owner_id').notNull(),
    placeId: text('place_id').notNull(),
    label: text('label').notNull().default(''),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [uniqueIndex('opportunities_owner_place').on(table.ownerId, table.placeId)],
)

export const searchLimits = sqliteTable('search_limits', {
  ownerId: text('owner_id').primaryKey(),
  windowStart: integer('window_start').notNull(),
  lastSearch: integer('last_search').notNull(),
  count: integer('count').notNull(),
})
