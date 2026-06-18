import React from 'react';
import { Plus } from 'lucide-react';
import { Project } from '@/types';
import { ProjectCard } from './ProjectCard';
import { motion } from 'motion/react';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
}

export function ProjectList({ projects, onSelectProject, onNewProject }: ProjectListProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">All Projects</h2>
        <button 
          onClick={onNewProject}
          className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <ProjectCard 
              project={project} 
              onClick={() => onSelectProject(project)} 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
