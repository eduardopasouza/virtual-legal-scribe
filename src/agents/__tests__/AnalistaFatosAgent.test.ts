
import { AnalistaFatosAgent } from '../AnalistaFatosAgent';

describe('AnalistaFatosAgent', () => {
  let agent: AnalistaFatosAgent;

  beforeEach(() => {
    agent = new AnalistaFatosAgent();
  });

  test('deve ter as propriedades básicas corretas', () => {
    expect(agent.type).toBe('analista-fatos');
    expect(agent.name).toBe('Analista de Fatos');
    expect(agent.isAvailable()).toBe(true);
  });

  test('deve retornar erro quando não fornecido ID do caso', async () => {
    const result = await agent.execute({});
    expect(result.success).toBe(false);
    expect(result.message).toContain('ID do caso não fornecido');
  });

  test('deve analisar fatos com sucesso quando fornecido ID do caso', async () => {
    const result = await agent.execute({ caseId: '123' });
    expect(result.success).toBe(true);
    expect(result.details).toHaveProperty('cronologia');
    expect(result.details).toHaveProperty('partes');
    expect(result.details).toHaveProperty('fatosIncontroversos');
    expect(result.details).toHaveProperty('fatosControversos');
  });
});
