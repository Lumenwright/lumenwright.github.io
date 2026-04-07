export interface TechWritingEntry {
  title: string;
  url?: string;
  description: string;
}

const technicalWriting: TechWritingEntry[] = [
  {
    title: 'A Programmer\'s Guide to Quaternions — in progress',
    description:
      'A practical guide to quaternions for programmers who want to understand the math, not just copy the Unity calls. Covers the axis/angle model, how to read and combine quaternions, and the interpolation techniques that make Euler angles break down. Coming soon.',
  },
];

export default technicalWriting;
