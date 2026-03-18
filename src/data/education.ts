export interface EducationEntry {
  institution: string;
  degree: string;
  years: string;
}

const education: EducationEntry[] = [
  {
    institution: 'University of Alberta',
    degree: 'Master of Science, Physics',
    years: '2013–2016',
  },
  {
    institution: 'Udacity',
    degree: 'VR Developer Nanodegree · Mobile Performance & 360 Media',
    years: '2017–2018',
  },
];

export default education;
