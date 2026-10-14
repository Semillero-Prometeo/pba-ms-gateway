import 'reflect-metadata';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SaveSequenceDto } from './sequence.dto';

function validateBody(body: object) {
  const instance = plainToInstance(SaveSequenceDto, body);
  return validateSync(instance, { whitelist: true, forbidNonWhitelisted: true });
}

describe('SaveSequenceDto', () => {
  it('accepts origin 7-tuples with description', () => {
    const errors = validateBody({
      sequence: {
        name: 'saludo',
        description: 'Saludo con el brazo derecho',
        arduino_id: 0,
        blocks: [[0, 0, 0.0, 2, 0, 1, 'P0_S0']],
      },
      overwrite: false,
    });
    expect(errors).toEqual([]);
  });

  it('accepts canonical blocks with id', () => {
    const errors = validateBody({
      sequence: {
        version: 1,
        id: 4,
        name: 'saludo',
        description: '',
        blocks: [
          {
            arduino_id: 0,
            pca: 0,
            servo: 0,
            inicio: 0,
            dur: 2,
            pos: 0,
            vel: 1,
            nombre: 'P0_S0',
          },
        ],
      },
      overwrite: true,
    });
    expect(errors).toEqual([]);
  });

  it('rejects empty blocks', () => {
    const errors = validateBody({
      sequence: { name: 'x', blocks: [] },
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});
