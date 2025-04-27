
import { renderHook, act } from '@testing-library/react';
import { useAgentSimulation } from '../useAgentSimulation';

// Mock dos serviços dependentes
jest.mock('@/agents', () => ({
  getAgent: jest.fn(() => ({
    execute: jest.fn(() => Promise.resolve({ success: true, message: 'success' })),
    name: 'Test Agent'
  }))
}));

describe('useAgentSimulation', () => {
  test('deve inicializar com estado correto', () => {
    const { result } = renderHook(() => useAgentSimulation('test-case-id'));
    
    expect(result.current.isProcessing).toEqual({});
  });

  test('deve executar simulação do agente com sucesso', async () => {
    const { result } = renderHook(() => useAgentSimulation('test-case-id'));

    await act(async () => {
      const simulationResult = await result.current.simulateAgent('analista-fatos');
      expect(simulationResult.success).toBe(true);
    });
  });
});
