import React from 'react';
import { cn } from '@/lib/utils';
import { Project } from '@/types';
import { formatTimeAgo } from '@/lib/utils';
import { motion } from 'motion/react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "bg-white border md:min-h-[140px] border-gray-200 rounded-2xl p-6 cursor-pointer",
        "hover:shadow-lg hover:shadow-gray-100 hover:border-gray-300 transition-all duration-200 flex flex-col justify-between"
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-semibold text-lg text-gray-900">{project.name}</h3>
        {project.status === 'ACTIVE' && (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-tavron-green text-tavron-green-text rounded-full">
            ACTIVE
          </span>
        )}
        {project.status === 'COMPLETED' && (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 rounded-full">
            COMPLETED
          </span>
        )}
        {project.status === 'ON_HOLD' && (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 rounded-full">
            ON HOLD
          </span>
        )}
      </div>

      <div className="flex justify-between items-end text-sm text-gray-500">
        <span className="font-medium">
          {project.engineers.length} {project.engineers.length === 1 ? 'member' : 'members'}
        </span>
        <span>{formatTimeAgo(project.updatedAt)}</span>
      </div>
    </motion.div>
  );
}
