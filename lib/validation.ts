import { GeneratedTeachingPlan } from './types';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g,' ').trim();

export function validatePlan(plan: GeneratedTeachingPlan) {
  const usedCaps = new Set(plan.lessons.flatMap(l => l.capabilities).map(norm));
  const usedKnowledge = new Set(plan.lessons.flatMap(l => l.knowledge).map(norm));
  const tech = plan.unit.technicalCapabilities || [];
  const knowledge = plan.unit.knowledge || [];

  const capabilityCoverage = tech.length
    ? Math.round((tech.filter(c => [...usedCaps].some(u => u.includes(norm(c)) || norm(c).includes(u))).length / tech.length) * 100)
    : 100;

  const knowledgeCoverage = knowledge.length
    ? Math.round((knowledge.filter(k => [...usedKnowledge].some(u => u.includes(norm(k)) || norm(k).includes(u))).length / knowledge.length) * 100)
    : 100;

  const hoursPlanned = plan.lessons.reduce((s,l)=>s+l.durationHours,0);
  const rowsComplete = plan.lessons.filter(l =>
    l.capabilities.length && l.knowledge.length && l.strategySteps && l.criteria.length && l.instruments.length
  ).length;
  const traceability = plan.lessons.length ? Math.round(rowsComplete / plan.lessons.length * 100) : 0;

  const issues:string[] = [];
  if (hoursPlanned !== plan.totalHours) issues.push(`Carga distribuída: ${hoursPlanned}h de ${plan.totalHours}h.`);
  if (capabilityCoverage < 100) issues.push(`Cobertura aproximada de capacidades: ${capabilityCoverage}%.`);
  if (knowledgeCoverage < 100) issues.push(`Cobertura aproximada de conhecimentos: ${knowledgeCoverage}%.`);
  if (traceability < 100) issues.push(`Rastreabilidade completa em ${traceability}% das aulas.`);

  return { capabilityCoverage, knowledgeCoverage, hoursPlanned, traceability, issues };
}
