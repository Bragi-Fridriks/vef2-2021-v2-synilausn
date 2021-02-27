import { readFile } from 'fs/promises';
import faker from 'faker';
import { query, end } from './db.js';
import { createUser } from './users.js';

const schemaFile = './sql/schema.sql';

async function mock(n) {
  for (let i = 0; i < n; i++) {
    const name = faker.name.findName();
    const nationalId = Math.floor(Math.random() * 10000000000);
    const comment = (() => {
      if (faker.random.boolean()) {
        return faker.lorem.sentence();
      }
      return '';
    })();
    const anonymous = faker.random.boolean();
    const signed = faker.date.between('2021-02-13', '2021-02-27');

    const q = `
      INSERT INTO signatures (name, nationalId, comment, anonymous, signed)
      VALUES ($1, $2, $3, $4, $5)`;

    await query(q, [name, nationalId, comment, anonymous, signed]);
  }
}

async function create() {
  const data = await readFile(schemaFile);

  await query(data.toString('utf-8'));

  console.info('Schema created');

  await mock(500);

  await createUser('admin', '123');

  console.info('Mock data created');

  await end();
}

create().catch((err) => {
  console.error('Error creating schema', err);
});
