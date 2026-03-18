import { COLORS } from '@/theme/theme';

export interface Degree {
    id: string;
    title: string;
    courses: number;
    duration: string;
    difficulty: string;
    icon: string;
    color: string;
    description: string;
}

export const DEGREES: Degree[] = [
    {
        id: '1',
        title: 'Full Stack Web Developer',
        courses: 12,
        duration: '6 Months',
        difficulty: 'Intermediate',
        icon: 'code-braces',
        color: '#3B82F6',
        description: 'Master both frontend and backend technologies to build complete web applications.',
    },
    {
        id: '2',
        title: 'AI & Machine Learning Specialist',
        courses: 15,
        duration: '9 Months',
        difficulty: 'Advanced',
        icon: 'brain',
        color: '#8B5CF6',
        description: 'Dive deep into neural networks, data science, and the future of agentic AI.',
    },
    {
        id: '3',
        title: 'Blockchain Engineer',
        courses: 8,
        duration: '4 Months',
        difficulty: 'Advanced',
        icon: 'link-variant',
        color: '#10B981',
        description: 'Learn to build decentralized applications and smart contracts on EduChain.',
    },
    {
        id: '4',
        title: 'UI/UX Design Master',
        courses: 10,
        duration: '5 Months',
        difficulty: 'Beginner',
        icon: 'palette',
        color: '#F59E0B',
        description: 'Create stunning user interfaces and research-backed user experiences.',
    },
];
