import 'reflect-metadata';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SaveSequenceDto, StartPlaybackDto } from './sequence.dto';

function validateBody(body: object) {
  const instance = plainToInstance(SaveSequenceDto, body);
  return validateSync(instance, { whitelist: true, forbidNonWhitelisted: true });
}

function validatePlay(body: object) {
  const instance = plainToInstance(StartPlaybackDto, body);
  return validateSync(instance, { whitelist: true, forbidNonWhitelisted: true });
}

describe('SaveSequenceDto', () => {
  it('accepts origin with category and blocks_neutro', () => {
    const errors = validateBody({
      sequence: {
        name: 'saludo',
        description: 'Saludo con el brazo derecho',
        category: 'brazo_derecho',
        arduino_id: 0,
        blocks: [[0, 0, 0.0, 2, 850, 5, 'P0_S0']],
        blocks_neutro: [[0, 0, 0.0, 2, 500, 5, 'P0_S0']],
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
        category: 'brazo_derecho',
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
        blocks_neutro: [
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

  it('rejects origin without category', () => {
    const errors = validateBody({
      sequence: {
        name: 'saludo',
        blocks: [[0, 0, 0.0, 2, 0, 1, 'P0_S0']],
        blocks_neutro: [[0, 0, 0.0, 2, 0, 1, 'P0_S0']],
      },
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects empty blocks', () => {
    const errors = validateBody({
      sequence: {
        name: 'x',
        category: 'cara',
        blocks: [],
        blocks_neutro: [[0, 0, 0.0, 2, 0, 1, 'P0_S0']],
      },
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('StartPlaybackDto', () => {
  it('accepts play by name and mode', () => {
    expect(validatePlay({ name: 'saludo', mode: 'neutro', source: 'panel' })).toEqual([]);
  });

  it('rejects play without name or blocks', () => {
    expect(validatePlay({ mode: 'normal' }).length).toBeGreaterThan(0);
  });
});
