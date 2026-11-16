export type ReviewStatus = 'draft' | 'expert_reviewed';
export interface LegalSource { id: string; title: string; url: string; versionDate?: string; verified: boolean; }
export interface ScenarioOverview {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  estimatedMinutes: number;
  difficulty: 'Початковий' | 'Середній' | 'Складний';
  audience: string[];
  conflict: { leftLabel: string; left: string; rightLabel: string; right: string };
  legalSources: LegalSource[];
  reviewStatus: ReviewStatus;
  aiAssisted: boolean;
  available: boolean;
}
