import { readFile } from 'fs/promises';
import { query, end } from './db.js';
import faker from 'faker';

const schemaFile = './sql/schema.sql';

async function mock(n) {
  for (let i = 0; i < n; i++) {
    const name = faker.name.findName();
    const nationalId = Math.floor(Math.random()*10000000000);
    const comment = faker.lorem.sentence();
    const anonymous = faker.random.boolean();

    const q = `
      INSERT INTO signatures (name, nationalId, comment, anonymous)
      VALUES ($1, $2, $3, $4)`;

    await query(q, [name, nationalId, comment, anonymous]);
  }
}

async function create() {
  const data = await readFile(schemaFile);

  await query(data.toString('utf-8'));

  console.info('Schema created');

  await mock(500);

  console.info('Mock data created');

  await end();
}

create().catch((err) => {
  console.error('Error creating schema', err);
});
