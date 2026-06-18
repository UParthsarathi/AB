import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Project } from '@/types';
import { Calendar, AlertCircle, CheckCircle2, ListTodo, CheckSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompleteProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CompleteProjectModal({ project, isOpen, onClose, onConfirm }: CompleteProjectModalProps) {
  const startDate = new Date(project.createdAt);
  const latestMilestone = project.milestones.length > 0 
    ? new Date(Math.max(...project.milestones.map(m => new Date(m.dueDate).getTime())))
    : null;

  const plannedEndDate = latestMilestone || startDate;
  const actualEndDate = new Date();
  
  // Only count as delayed if completed after the planned date by more than 1 day
  const diffTime = actualEndDate.getTime() - plannedEndDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const isDelayed = diffDays > 0;

  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter(m => m.status === 'COMPLETED').length;
  const pendingMilestones = totalMilestones - completedMilestones;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Project">
      <div className="flex flex-col gap-6">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm border-b border-gray-200 pb-2 mb-4 font-semibold text-gray-900">Timeline Outline</h3>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> Started</span>
              <span className="font-medium text-gray-900">{startDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> Planned End</span>
              <span className="font-medium text-gray-900">{latestMilestone ? plannedEndDate.toLocaleDateString() : 'No milestones'}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-gray-200">
              <span className="text-gray-900 font-medium">Completion Date</span>
              <span className="font-semibold text-tavron-green-text flex items-center gap-1">
                {actualEndDate.toLocaleDateString()}
              </span>
            </div>
            
            {latestMilestone && (
              <div className="mt-4 p-3 rounded-lg flex items-start gap-3 text-sm bg-white border border-gray-200 shadow-sm">
                {isDelayed ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">Project Delayed</p>
                      <p className="text-amber-700 mt-0.5 leading-relaxed">Completed {diffDays} day{diffDays !== 1 ? 's' : ''} after the final planned milestone.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">On Schedule</p>
                      <p className="text-green-700 mt-0.5 leading-relaxed">Completed efficiently on or ahead of the timeline.</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm border-b border-gray-200 pb-2 mb-4 font-semibold text-gray-900">Milestone Summary</h3>
          
          {totalMilestones > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <ListTodo className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-gray-900">{totalMilestones}</p>
                <p className="text-xs text-gray-500 font-medium uppercase mt-1">Total</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <CheckSquare className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-gray-900">{completedMilestones}</p>
                <p className="text-xs text-gray-500 font-medium uppercase mt-1">Completed</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-gray-900">{pendingMilestones}</p>
                <p className="text-xs text-gray-500 font-medium uppercase mt-1">Pending/Open</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic text-center py-2">No milestones tracked in this project.</p>
          )}

          {pendingMilestones > 0 && (
             <p className="text-xs text-amber-600 mt-4 bg-amber-50 border border-amber-100 p-2.5 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Completing the project will leave {pendingMilestones} milestone(s) permanently open.
             </p>
          )}
        </div>

        {(project.tasks && project.tasks.length > 0) && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm border-b border-gray-200 pb-2 mb-4 font-semibold text-gray-900">Task Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium tracking-wide">Total Tasks</span>
                <span className="text-lg font-semibold text-gray-900">{project.tasks.length}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium tracking-wide">Pending</span>
                <span className={cn("text-lg font-semibold", project.tasks.filter(t => t.status !== 'DONE').length > 0 ? "text-amber-600" : "text-gray-900")}>
                  {project.tasks.filter(t => t.status !== 'DONE').length}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Confirm Completion
          </button>
        </div>
      </div>
    </Modal>
  );
}
