export interface SkillCategory {
  category: string;
  skills: string[];
}

const skills: SkillCategory[] = [
  { category: '3D Engines',   skills: ['Unity', 'Unreal Engine 4', 'Three.js'] },
  { category: 'Languages',    skills: ['C#', 'Python', 'JavaScript', 'TypeScript'] },
  { category: 'Platforms',    skills: ['Oculus / Meta XR', 'Hololens', 'Android', 'iOS', 'WebGL'] },
  { category: 'Frameworks',   skills: ['React', 'Flask', 'Node.js', 'Express'] },
  { category: '3D Modeling',  skills: ['Blender'] },
  { category: 'Automation',   skills: ['Git', 'GitHub', 'Azure DevOps', 'Jenkins'] },
];

export default skills;
