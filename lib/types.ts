export type CurriculumUnit = {
  name: string; workload?: number; objective?: string; functionText?: string;
  subfunctions?: string[]; performanceStandards?: string[]; technicalCapabilities: string[];
  basicCapabilities?: string[]; socioemotionalCapabilities: string[]; knowledge: string[];
  environments?: string[]; resources?: string[]; notes?: string[];
};
export type ExtractedPlan = { courseName:string; sourceFileName:string; generalCompetency?:string; methodologyNotes?:string[]; evaluationRules?:string[]; units:CurriculumUnit[]; rawText?:string; };
export type Lesson = { id:string; number:number; durationHours:number; capabilities:string[]; socioemotional:string[]; knowledge:string[]; strategyType:string; strategySteps:string; resources:string[]; criteria:string[]; instruments:string[]; };
export type LearningSituation = { strategy:'Situação-Problema'|'Estudo de Caso'|'Projeto'|'Pesquisa Aplicada'; context:string; scenario:string; challenge:string; expectedResults:string[]; evidences:string[]; };
export type GeneratedTeachingPlan = { unit:CurriculumUnit; totalHours:number; lessonHours:number; lessonCount:number; learningSituation:LearningSituation; lessons:Lesson[]; warnings:string[]; };
