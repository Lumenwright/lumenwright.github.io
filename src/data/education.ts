export interface EducationEntry {
  institution: string;
  degree: string;
  years: string;
  description: string;
}

const education: EducationEntry[] = [
  {
    institution: 'University of Alberta',
    degree: 'Master of Science, Physics',
    years: '2013–2016',
    description: 'Physics turned out to be excellent preparation for real-time 3D work: the MSc gave me strong foundations in linear algebra, matrix transformations, and the kind of mathematical intuition that makes quaternions less scary. Tyrone Deane Memorial Scholarship recipient. Presented at the Canadian Association of Physicists Annual Congress, 2015.'
  },
  {
    institution: 'Udacity',
    degree: 'VR Developer Nanodegree · Mobile Performance & 360 Media',
    years: '2017–2018',
    description: 'Hands-on Unity development for mobile VR, covering UI, physics, animation, shaders, spatial audio, performance optimization, and VR design best practices.'
  },
];

export default education;
