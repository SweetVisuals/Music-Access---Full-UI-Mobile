
import React from 'react';
import { MOCK_TALENT, MOCK_PROJECTS } from '../constants';
import { Verified, UserPlus, ChevronRight, Star, Music, Zap } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Project } from '../types';

interface BrowseTalentPageProps {
  currentTrackId: string | null;
  isPlaying: boolean;
  currentProject: Project | null;
  onPlayTrack: (project: Project, trackId: string) => void;
  onTogglePlay: () => void;
}

const BrowseTalentPage: React.FC<BrowseTalentPageProps> = ({
    currentTrackId,
    isPlaying,
    currentProject,
    onPlayTrack,
    onTogglePlay
}) => {
  return (
    <div className="w-full max-w-[1600px] mx-auto pb-32 pt-6 px-6 lg:px-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="mb-10">
            <h1 className="text-3xl font-black text-white mb-2">Browse Talent</h1>
            <p className="text-neutral-500 text-sm">Discover the best emerging producers, vocalists, and engineers.</p>
        </div>

        {/* Featured Talent Section */}
        <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Star size={18} className="text-primary" /> Featured Creators
                </h2>
                <button className="text-xs text-neutral-500 hover:text-white flex items-center gap-1">View All <ChevronRight size={12}/></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_TALENT.map(talent => (
                    <div key={talent.id} className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 hover:border-neutral-600 transition-all group hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={talent.avatar} alt={talent.username} className="w-14 h-14 rounded-full border-2 border-[#0a0a0a] shadow-lg" />
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-1">
                                    {talent.username}
                                    {talent.isVerified && <Verified size={12} className="text-blue-400" />}
                                </h3>
                                <p className="text-[10px] text-neutral-500 font-mono">{talent.handle}</p>
                                <span className="inline-block px-2 py-0.5 mt-1 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-primary uppercase tracking-wide">
                                    {talent.role}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                            {talent.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-1 bg-neutral-900 rounded text-[9px] text-neutral-400 border border-neutral-800">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                            <span className="text-[10px] text-neutral-500 font-mono">
                                <strong className="text-white">{talent.followers}</strong> Followers
                            </span>
                            <button className="text-xs font-bold text-white flex items-center gap-2 bg-primary/10 hover:bg-primary hover:text-black px-3 py-1.5 rounded-lg transition-colors border border-primary/20">
                                <UserPlus size={14} /> Follow
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Trending Beat Tapes */}
        <div className="mb-12">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Music size={18} className="text-primary" /> Trending Beat Tapes
                </h2>
                <button className="text-xs text-neutral-500 hover:text-white flex items-center gap-1">View All <ChevronRight size={12}/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_PROJECTS.slice(0, 4).map(project => (
                    <div key={project.id} className="h-[340px]">
                        <ProjectCard 
                            project={project} 
                            currentTrackId={currentTrackId}
                            isPlaying={currentProject?.id === project.id && isPlaying}
                            onPlayTrack={(trackId) => onPlayTrack(project, trackId)}
                            onTogglePlay={onTogglePlay}
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* New Services Section */}
        <div>
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap size={18} className="text-primary" /> New Services
                </h2>
                <button className="text-xs text-neutral-500 hover:text-white flex items-center gap-1">View All <ChevronRight size={12}/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[1, 2, 3].map(i => (
                     <div key={i} className="bg-neutral-900/50 border border-white/5 p-5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                         <div className="flex justify-between items-start mb-2">
                             <div className="p-2 bg-neutral-800 rounded-lg text-neutral-300">
                                 <Star size={16} />
                             </div>
                             <span className="text-xs font-bold text-white bg-primary/20 px-2 py-1 rounded border border-primary/30 font-mono">$50+</span>
                         </div>
                         <h3 className="text-sm font-bold text-white mb-1">Professional Vocal Tuning</h3>
                         <p className="text-[10px] text-neutral-400 mb-3 line-clamp-2">I will manually tune your vocals using Melodyne for a natural or auto-tune sound.</p>
                         <div className="flex items-center gap-2">
                             <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-5 h-5 rounded-full" />
                             <span className="text-[10px] text-neutral-500">by @producer{i}</span>
                         </div>
                     </div>
                 ))}
            </div>
        </div>

    </div>
  );
};

export default BrowseTalentPage;