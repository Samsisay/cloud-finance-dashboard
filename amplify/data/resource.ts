
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Transaction: a.model({
    description: a.string().required(),
    amount: a.float().required(),
    category: a.string().required(),
    transactionType: a.enum(['INCOME', 'EXPENSE']),
    date: a.date().required(),
  })
  .authorization((allow) => [
    allow.owner(),
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
