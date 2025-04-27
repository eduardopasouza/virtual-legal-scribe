
import { AnalistaFatosAgent } from '../AnalistaFatosAgent';

describe('AnalistaFatosAgent', () => {
  let agent: AnalistaFatosAgent;

  beforeEach(() => {
    agent = new AnalistaFatosAgent();
  });

  describe('Basic Properties', () => {
    test('should have correct type', () => {
      expect(agent.type).toBe('analista-fatos');
    });

    test('should have correct name', () => {
      expect(agent.name).toBe('Analista de Fatos');
    });

    test('should be available by default', () => {
      expect(agent.isAvailable()).toBe(true);
    });
  });

  describe('execute()', () => {
    test('should return error when no caseId provided', async () => {
      const result = await agent.execute({});
      expect(result.success).toBe(false);
      expect(result.message).toContain('ID do caso não fornecido');
    });

    test('should analyze facts successfully when caseId provided', async () => {
      const result = await agent.execute({ caseId: '123' });
      expect(result.success).toBe(true);
      expect(result.details).toHaveProperty('cronologia');
      expect(result.details).toHaveProperty('partes');
      expect(result.details).toHaveProperty('fatosIncontroversos');
      expect(result.details).toHaveProperty('fatosControversos');
    });

    test('should include chronological events in analysis', async () => {
      const result = await agent.execute({ caseId: '123' });
      expect(result.details.cronologia).toBeInstanceOf(Array);
      expect(result.details.cronologia.length).toBeGreaterThan(0);
      expect(result.details.cronologia[0]).toHaveProperty('data');
      expect(result.details.cronologia[0]).toHaveProperty('descricao');
    });
  });
});
