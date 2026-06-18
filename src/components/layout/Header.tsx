import { Folder, Moon, LogOut } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-gray-900 text-white p-1.5 rounded-md">
          <Folder className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Projects</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-gray-700 transition-colors">
          <Moon className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-500 font-medium">parthu3915@gmail.com</span>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
