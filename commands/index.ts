import fsp from 'fs/promises';
import { Collection } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import ICommand from './command.interface/command.interface.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dirname = path.join(__dirname, 'utils');

const getCollection = async () => {
  const collecion = new Collection();

  try {
    const commandFiles: string[] = await fsp.readdir(dirname, 'utf-8');
    await Promise.all(commandFiles.map(async (filepath) => {
      const command: { default: ICommand } = await import(path.join('file://', dirname, filepath));
      // console.log({ command.default.data.toJSON(), command.default.execute });
      collecion.set(command.default.data.name, command.default);
    }));
  } catch (error) {
    throw new Error('Не удалось прочитать директорию');
  }

  return collecion;
}

export default getCollection;
