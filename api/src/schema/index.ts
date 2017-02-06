import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';

function promisify(fn) {
  return (...args) => new Promise((resolve, reject) =>
    fn(...args, (err, data) => err ? reject(err) : resolve(data))
  );
}

interface IFind { (pattern: string): Promise<string[]> }
interface IRead { (path: string): Promise<string> }
const find: IFind = promisify(glob);
const read: IRead = promisify(fs.readFile);

const pattern = path.join(__dirname,  '**/*.gql');

export function readSchema() {
  return (
    find(pattern)
    .then((matches) => Promise.all(matches.map((match) => read(match))))
    .then((contents) => contents.join('\n'))
  );
}
