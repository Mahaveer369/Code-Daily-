import { LessonContent } from '../../types';
import { SYSTEM_DESIGN_MODULES } from './systemDesign';
import { DBMS_MODULES } from './dbms';
import { OS_MODULES } from './os';
import { DSA_MODULES } from './dsa';
import { NETWORK_MODULES } from './networks';
import { PYTHON_AND_CORE_MODULES } from './pythonAndCore';

export const CURRICULUM_DATA: Record<string, LessonContent> = {
  ...SYSTEM_DESIGN_MODULES,
  ...DBMS_MODULES,
  ...OS_MODULES,
  ...DSA_MODULES,
  ...NETWORK_MODULES,
  ...PYTHON_AND_CORE_MODULES
};

export const getCurriculumLesson = (moduleId: string): LessonContent | null => {
  return CURRICULUM_DATA[moduleId] || null;
};
