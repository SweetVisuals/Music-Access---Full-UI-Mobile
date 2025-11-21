import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import FilterBar from './components/FilterBar';
import ProjectCard from './components/ProjectCard';
import MusicPlayer from './components/MusicPlayer';
import ProfilePage from './components/ProfilePage';
import UploadPage from './components/UploadPage';
import DashboardPage from './components/DashboardPage';
import MessagesPage from './components/MessagesPage';
import ManageServicesPage from './components/ManageServicesPage';
import ContractsPage from './components/ContractsPage';
import PostServicePage from './components/PostServicePage';
import NotesPage from './components/NotesPage';
import BrowseTalentPage from './components/BrowseTalentPage';
import CollaboratePage from './components/CollaboratePage';
import LibraryPage from './components/LibraryPage';
import CheckoutPage from './components/CheckoutPage';
import SettingsPage from './components/SettingsPage';
import GetHelpPage from './components/GetHelpPage';
import AuthModal from './components/AuthModal';
import { TermsPage, PrivacyPage } from './components/LegalPages';
import { MOCK_PROJECTS, MOCK_USER_PROFILE } from './constants';
import { getProjects } from './services/supabaseService';
import { Project, FilterState, View, UserProfile } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // User State
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [gemsClaimedToday, setGemsClaimedToday] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    genre: "All Genres",
    key: "All Keys",
    minBpm: 0,
    maxBpm: 300,
    minPrice: 0,
    maxPrice: 1000,
    searchQuery: ""
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Could not connect to database. Displaying sample data.");
        setProjects(MOCK_PROJECTS); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
        const matchesGenre = filters.genre === "All Genres" || p.genre === filters.genre;
        const matchesKey = filters.key === "All Keys" || p.key === filters.key;
        
        const query = filters.searchQuery.toLowerCase().trim();
        if (!query) return matchesGenre && matchesKey;

        const searchableContent = `${p.title} ${p.producer} ${p.genre} ${p.key} ${p.tags.join(' ')}`.toLowerCase();
        
        const searchTerms = query.split(/\s+/).filter(t => t.length > 0);
        const matchesSearch = searchTerms.every(term => searchableContent.includes(term));
        
        return matchesGenre && matchesKey && matchesSearch;
    });
  }, [projects, filters]);

  // Plays a specific track from a project
  const handlePlayTrack = (project: Project, trackId: string) => {
    if (currentProject?.id === project.id && currentTrackId === trackId) {
        setIsPlaying(!isPlaying);
    } else {
        setCurrentProject(project);
        setCurrentTrackId(trackId);
        setIsPlaying(true);
    }
  };

  // Toggles play/pause for the currently active track/project
  const handleTogglePlay = () => {
    if (currentProject && currentTrackId) {
        setIsPlaying(!isPlaying);
    }
  };

  const handleSearch = (query: string) => {
      setFilters(prev => ({ ...prev, searchQuery: query }));
      if (currentView !== 'home') setCurrentView('home');
  };

  const handleLogin = () => {
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setCurrentView('home'); // Redirect to home on logout
  };

  const handleClaimDailyGems = () => {
      if (!gemsClaimedToday) {
          setUserProfile(prev => ({ ...prev, gems: prev.gems + 10 }));
          setGemsClaimedToday(true);
      }
  };

  const handleNavigate = (view: View) => {
      setCurrentView(view);
      setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen w-full flex overflow-hidden selection:bg-primary/30 selection:text-primary transition-colors duration-500">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin}
      />

      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        isLoggedIn={isLoggedIn}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Main Layout Container - Adjusted padding for mobile */}
      <div className="flex-1 flex flex-col lg:pl-64 relative w-full">
        <TopBar 
            projects={projects}
            currentView={currentView}
            onSearch={handleSearch} 
            onNavigate={handleNavigate} 
            isLoggedIn={isLoggedIn}
            userProfile={userProfile}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onClaimGems={handleClaimDailyGems}
            gemsClaimedToday={gemsClaimedToday}
            onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto pt-24 lg:pt-32 pb-32 scroll-smooth">
          
          {currentView === 'home' && (
             <div className="max-w-[1600px] mx-auto px-4 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {isLoggedIn && !gemsClaimedToday && (
                    <div className="mb-6 mt-4 lg:mt-0 p-4 bg-gradient-to-r from-primary/20 to-transparent border border-primary/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Daily Reward Available!</h3>
                                <p className="text-xs text-neutral-300 hidden sm:block">Claim your 10 free Gems for today.</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleClaimDailyGems}
                            className="px-4 py-2 bg-primary text-black font-bold rounded-lg text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                        >
                            Claim 10 Gems
                        </button>
                    </div>
                )}

                <FilterBar filters={filters} onFilterChange={setFilters} />
                
                {error && (
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs rounded-lg font-mono text-center">
                    {error}
                  </div>
                )}

                {loading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <div className="text-center">
                            <div className="relative w-16 h-16 mx-auto mb-6">
                                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-r-2 border-primary/50 rounded-full animate-spin animation-delay-150"></div>
                                <div className="absolute inset-4 border-b-2 border-primary/20 rounded-full animate-spin animation-delay-300"></div>
                            </div>
                            <p className="text-primary font-mono text-xs tracking-[0.2em] animate-pulse">CONNECTING_TO_DATABASE...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 pb-20">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map(project => (
                                <div key={project.id} className="h-[340px]">
                                    <ProjectCard 
                                        project={project} 
                                        currentTrackId={currentTrackId}
                                        isPlaying={currentProject?.id === project.id && isPlaying}
                                        onPlayTrack={(trackId) => handlePlayTrack(project, trackId)}
                                        onTogglePlay={handleTogglePlay}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center border border-dashed border-neutral-800 rounded-xl bg-white/5">
                                <p className="text-neutral-500 font-mono mb-4">No data found matching query parameters.</p>
                                <button 
                                    onClick={() => setFilters({ ...filters, genre: "All Genres", key: "All Keys", searchQuery: "" })}
                                    className="px-4 py-2 bg-primary/10 text-primary border border-primary/50 rounded hover:bg-primary hover:text-black transition-colors font-mono text-xs uppercase tracking-wider"
                                >
                                    Reset Search Query
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
          )}

          {currentView === 'profile' && (
             <ProfilePage 
                profile={userProfile}
                currentProject={currentProject}
                currentTrackId={currentTrackId}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onTogglePlay={handleTogglePlay}
             />
          )}

          {currentView === 'browse-talent' && (
             <BrowseTalentPage 
                currentProject={currentProject}
                currentTrackId={currentTrackId}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onTogglePlay={handleTogglePlay}
             />
          )}

          {currentView === 'collaborate' && (
             <CollaboratePage />
          )}

          {currentView === 'library' && isLoggedIn && (
             <LibraryPage 
                currentProject={currentProject}
                currentTrackId={currentTrackId}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onTogglePlay={handleTogglePlay}
             />
          )}

          {currentView === 'upload' && (
             <UploadPage 
                currentProject={currentProject}
                currentTrackId={currentTrackId}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onTogglePlay={handleTogglePlay}
             />
          )}

          {currentView === 'contracts' && isLoggedIn && (
             <ContractsPage />
          )}
          
          {currentView === 'post-service' && isLoggedIn && (
             <PostServicePage />
          )}

          {currentView === 'notes' && isLoggedIn && (
             <NotesPage />
          )}

          {currentView === 'checkout' && isLoggedIn && (
             <CheckoutPage />
          )}

          {currentView === 'dashboard-messages' && isLoggedIn && (
              <MessagesPage />
          )}

          {currentView === 'dashboard-manage' && isLoggedIn && (
              <ManageServicesPage />
          )}

          {/* Settings & Help Views */}
          {(currentView === 'settings' || currentView === 'dashboard-settings') && (
              <SettingsPage />
          )}

          {(currentView === 'help' || currentView === 'dashboard-help') && (
              <GetHelpPage onNavigate={setCurrentView} />
          )}

          {currentView === 'terms' && (
              <TermsPage onBack={() => setCurrentView('help')} />
          )}

          {currentView === 'privacy' && (
              <PrivacyPage onBack={() => setCurrentView('help')} />
          )}

          {/* Handle remaining Dashboard sub-views via DashboardPage or specifically if needed */}
          {(currentView.startsWith('dashboard') && 
            currentView !== 'dashboard-messages' && 
            currentView !== 'dashboard-manage' && 
            currentView !== 'dashboard-settings' &&
            currentView !== 'dashboard-help' &&
            isLoggedIn) && (
             <DashboardPage 
                view={currentView} 
                projects={projects}
                setProjects={setProjects}
                currentTrackId={currentTrackId}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onTogglePlay={handleTogglePlay}
                userProfile={userProfile}
             />
          )}

        </main>
      </div>

      <MusicPlayer 
        currentProject={currentProject} 
        currentTrackId={currentTrackId}
        isPlaying={isPlaying} 
        togglePlay={handleTogglePlay} 
        currentView={currentView}
      />
    </div>
  );
};

export default App;