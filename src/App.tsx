import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectDetails } from '@/components/projects/ProjectDetails';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { Undo2, X } from 'lucide-react';

export default function App() {
  const { 
    projects, 
    lastAction,
    undo,
    addProject, 
    updateProject,
    deleteProject,
    addEngineerToProject, 
    removeEngineerFromProject,
    addMilestone, 
    addDocument,
    deleteDocument,
    updateMilestoneStatus,
    deleteMilestone,
    addTask,
    updateTaskStatus,
    deleteTask,
    addTaskComment
  } = useProjects();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId) 
    : null;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 transition-colors duration-200">
      <Header />
      
      <main className="w-full relative pb-20">
        {selectedProject ? (
          <ProjectDetails 
            project={selectedProject} 
            onBack={() => setSelectedProjectId(null)}
            onUpdateProject={updateProject}
            onDeleteProject={() => {
              deleteProject(selectedProject.id);
              setSelectedProjectId(null);
            }}
            onAddEngineer={addEngineerToProject}
            onRemoveEngineer={removeEngineerFromProject}
            onAddMilestone={addMilestone}
            onUpdateMilestoneStatus={updateMilestoneStatus}
            onDeleteMilestone={deleteMilestone}
            onAddDoc={addDocument}
            onDeleteDoc={deleteDocument}
            onAddTask={addTask}
            onUpdateTaskStatus={updateTaskStatus}
            onDeleteTask={deleteTask}
            onAddTaskComment={addTaskComment}
          />
        ) : (
          <ProjectList 
            projects={projects}
            onSelectProject={(p) => setSelectedProjectId(p.id)}
            onNewProject={() => setIsCreateModalOpen(true)}
          />
        )}
      </main>

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(newProject) => {
          addProject(newProject);
          setSelectedProjectId(newProject.id); // optionally go straight to the new project
        }}
      />

      <AnimatePresence>
        {lastAction && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-4 z-50"
          >
            <span className="text-sm font-medium">{lastAction.label}</span>
            <div className="w-px h-4 bg-gray-700" />
            <button 
              onClick={undo}
              className="flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
