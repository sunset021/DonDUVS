import friend from './friend.json';
import supervisor from './supervisor.json';
import type { ScenarioOverview } from '../types/scenario';
export const scenarios: ScenarioOverview[] = [friend, supervisor] as ScenarioOverview[];
export function findScenario(id: string): ScenarioOverview | undefined { return scenarios.find((scenario) => scenario.id === id); }
