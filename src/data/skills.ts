export interface SkillCategory {
  category: string;
  skills: string[];
}

const skills: SkillCategory[] = [
  { category: '3D Engines',   skills: ['Unity', 'Unity Addressables', 'Unreal Engine 4', 'Three.js'] },
  { category: 'Languages',    skills: ['C#', 'Asynchronous C#', 'Python', 'JavaScript', 'TypeScript'] },
  { category: 'Platforms',    skills: ['Oculus / Meta XR', 'Hololens', 'Android', 'iOS', 'WebGL'] },
  { category: 'Frameworks',   skills: ['React', 'Flask', 'Node.js', 'Express'] },
  { category: '3D Modeling',  skills: ['Blender'] },
  { category: 'Automation',   skills: ['Git', 'GitHub', 'Azure DevOps', 'Jenkins'] },
  { category: 'One Day These Will Come In Handy, You Never Know', skills: ['Intel RealSense', 'Azure Kinect', 'OpenCV', 'PyTorch', 'Synthetic Data', 'ROS 2'] },
];

export default skills;
