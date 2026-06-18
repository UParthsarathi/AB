import { Engineer, Project } from '../types';

export const mockEngineers: Engineer[] = [
  { id: 'eng-1', name: 'Alice Chen', email: 'alice.c@tavron.com', role: 'Lead Engineer' },
  { id: 'eng-2', name: 'Bob Smith', email: 'bob.s@tavron.com', role: 'Systems Engineer' },
  { id: 'eng-3', name: 'Charlie Davis', email: 'charlie.d@tavron.com', role: 'Software Engineer' },
  { id: 'eng-4', name: 'Diana Prince', email: 'diana.p@tavron.com', role: 'QA Engineer' },
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Tavron Core V2',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 21 * 3600000).toISOString(), // ~21 hours ago
    updatedAt: new Date(Date.now() - 21 * 3600000).toISOString(),
    engineers: [mockEngineers[0], mockEngineers[2]],
    milestones: [
      { id: 'm-1', title: 'Architecture Review', dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), status: 'IN_PROGRESS' },
      { id: 'm-2', title: 'Beta Release', dueDate: new Date(Date.now() + 30 * 86400000).toISOString(), status: 'PENDING' }
    ],
    docs: [
      { id: 'd-1', title: 'Architecture Spec', url: 'https://docs.tavron.com/core-v2-spec', type: 'LINK', dateAdded: new Date(Date.now() - 86400000).toISOString() }
    ],
    tasks: [
      { id: 't-1', title: 'Draft API specs', engineerId: 'eng-1', status: 'DONE', createdAt: new Date(Date.now() - 20 * 3600000).toISOString() },
      { id: 't-2', title: 'Setup CI/CD pipeline', engineerId: 'eng-3', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 10 * 3600000).toISOString() }
    ]
  },
  {
    id: 'proj-2',
    name: 'Kemen Systems Integration',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(), // 18 days ago
    updatedAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    engineers: [mockEngineers[1]],
    milestones: [],
    docs: [],
    tasks: []
  },
  {
    id: 'proj-3',
    name: 'Mani Offset Project',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(), // 18 days ago
    updatedAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    engineers: [mockEngineers[3]],
    milestones: [
      { id: 'm-3', title: 'Initial Kickoff', dueDate: new Date(Date.now() - 15 * 86400000).toISOString(), status: 'COMPLETED' }
    ],
    docs: [
      { id: 'd-2', title: 'Client Requirements.pdf', url: '#', type: 'DOCUMENT', dateAdded: new Date(Date.now() - 17 * 86400000).toISOString() }
    ],
    tasks: []
  }
];
