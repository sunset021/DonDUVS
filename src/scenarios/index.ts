import friend from './friend.json';
import supervisor from './supervisor.json';

export const scenarios: any[] = [
  friend,
  supervisor,
];

export function findScenario(id: string): any {
  return scenarios.find((s) => s.id === id);
}