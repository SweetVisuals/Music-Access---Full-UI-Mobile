
import React, { useState, useEffect } from 'react';
import { MOCK_CONTRACTS } from '../constants';
import { Contract } from '../types';
import { FileText, Plus, Download, Trash2, ExternalLink, Eye, Printer, MoreVertical, PenTool, Save, X, Check, PenLine } from 'lucide-react';

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState(MOCK_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(contracts[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Contract>>({});
  
  // Signature State
  const [isSigning, setIsSigning] = useState(false);
  const [signatureInput, setSignatureInput] = useState('');

  // When selectedContract changes, reset edit/sign mode
  useEffect(() => {
      setIsEditing(false);
      setEditForm({});
      setIsSigning(false);
      setSignatureInput('');
  }, [selectedContract]);

  const handleCreateNew = () => {
      const newContract: Contract = {
          id: `ct${Date.now()}`,
          title: 'Untitled Contract',
          type: 'lease',
          status: 'draft',
          created: new Date().toLocaleDateString(),
          royaltySplit: 50,
          revenueSplit: 50,
          terms: 'Enter your terms and conditions here. This contract serves as a binding agreement between the Producer and the Licensee.',
          notes: '',
          distNotes: 'Worldwide',
          pubNotes: '',
          publisherName: '',
          producerSignature: '',
          clientSignature: ''
      };
      
      setContracts(prev => [newContract, ...prev]);
      setSelectedContract(newContract);
      setEditForm(newContract);
      setIsEditing(true);
  };

  const handleStartEdit = () => {
      if (!selectedContract) return;
      setEditForm({ ...selectedContract });
      setIsEditing(true);
  };

  const handleCancelEdit = () => {
      setIsEditing(false);
      setEditForm({});
  };

  const handleSave = () => {
      if (!selectedContract) return;
      
      const updatedContract = { ...selectedContract, ...editForm } as Contract;
      
      setContracts(contracts.map(c => c.id === selectedContract.id ? updatedContract : c));
      setSelectedContract(updatedContract);
      setIsEditing(false);
  };

  const handleInputChange = (field: keyof Contract, value: any) => {
      setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleStartSign = (e: React.MouseEvent) => {
      e.stopPropagation();
      const currentSignature = isEditing ? editForm.producerSignature : selectedContract?.producerSignature;
      // If signature exists, allow editing it. If not, prompt with default "Mani Rae"
      setSignatureInput(currentSignature || "Mani Rae");
      setIsSigning(true);
  };

  const handleSaveSignature = () => {
      if (isEditing) {
          handleInputChange('producerSignature', signatureInput);
      } else {
          if (selectedContract) {
              const updated = { ...selectedContract, producerSignature: signatureInput };
              setContracts(prev => prev.map(c => c.id === selectedContract.id ? updated : c));
              setSelectedContract(updated);
          }
      }
      setIsSigning(false);
  };

  // Data source to display: Edit form if editing, else selected contract
  const displayData = isEditing ? { ...selectedContract, ...editForm } as Contract : selectedContract;

  return (
    <div className="w-full h-[calc(100vh-6rem)] max-w-[1600px] mx-auto pb-8 pt-6 px-6 lg:px-8 animate-in fade-in duration-500 flex flex-col">
        <div className="flex justify-between items-center mb-6 shrink-0">
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Contracts</h1>
                <p className="text-neutral-500 text-sm">Manage your service and audio contracts</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                    <button className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-800 rounded shadow transition-colors">All Contracts</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-neutral-500 hover:text-white transition-colors">Service</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-neutral-500 hover:text-white transition-colors">Audio</button>
                </div>
            </div>
        </div>

        <div className="flex-1 flex gap-6 lg:gap-8 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-72 lg:w-80 flex flex-col gap-4 overflow-y-auto pr-2 shrink-0 custom-scrollbar">
                <button 
                    onClick={handleCreateNew}
                    className="p-4 rounded-xl border border-dashed border-neutral-800 flex items-center justify-center gap-2 text-neutral-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group bg-white/[0.01]"
                >
                    <Plus size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wide">Create New Contract</span>
                </button>

                {contracts.map(contract => (
                    <div 
                        key={contract.id}
                        onClick={() => setSelectedContract(contract)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5 group ${selectedContract?.id === contract.id ? 'bg-white/5 border-primary/50' : 'bg-[#0a0a0a] border-neutral-800'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded text-neutral-400 group-hover:text-primary transition-colors ${selectedContract?.id === contract.id ? 'text-primary bg-primary/10' : 'bg-neutral-900'}`}>
                                <FileText size={20} />
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-neutral-900 border border-white/10 rounded text-neutral-500 uppercase">{contract.type}</span>
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${contract.status === 'signed' ? 'bg-green-500/10 text-green-500' : 'bg-neutral-800 text-neutral-500'}`}>{contract.status}</span>
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1 truncate">{contract.title}</h3>
                        <p className="text-[10px] text-neutral-500 font-mono">Created {contract.created}</p>
                    </div>
                ))}
            </div>

            {/* Main Area */}
            {selectedContract ? (
                <div className="flex-1 flex flex-col bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                    {/* Toolbar */}
                    <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-neutral-900/30 shrink-0">
                        <div className="flex items-center gap-3">
                             {isEditing ? (
                                 <div className="flex items-center gap-2 text-primary animate-pulse">
                                     <div className="w-2 h-2 bg-primary rounded-full"></div>
                                     <span className="text-xs font-bold uppercase tracking-widest">Editing Mode</span>
                                 </div>
                             ) : (
                                <h2 className="text-sm font-bold text-white truncate flex items-center gap-2">
                                    {selectedContract.title}
                                    {selectedContract.producerSignature && <span className="text-[9px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded border border-green-500/20">SIGNED</span>}
                                </h2>
                             )}
                        </div>
                        <div className="flex items-center gap-3">
                            {isEditing ? (
                                <>
                                    <button onClick={handleCancelEdit} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded text-xs font-bold text-neutral-400 hover:text-white transition-colors">
                                        <X size={14} /> Cancel
                                    </button>
                                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                                        <Save size={14} /> Save Changes
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleStartEdit} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-bold text-white transition-colors">
                                    <PenTool size={12} />
                                    <span>Edit Contract</span>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-1 flex overflow-hidden">
                        {/* Info Panel / Editor Form */}
                        <div className="w-72 lg:w-80 border-r border-white/5 p-6 space-y-6 bg-neutral-950 overflow-y-auto custom-scrollbar shrink-0">
                            <div className="space-y-6">
                                {/* General */}
                                <div>
                                    <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                        General Information
                                    </h3>
                                    <div className="space-y-4">
                                        <InputGroup label="Title" value={displayData?.title} onChange={(v) => handleInputChange('title', v)} isEditing={isEditing} />
                                        <InputGroup label="Client Name" value={displayData?.clientName || ''} onChange={(v) => handleInputChange('clientName', v)} isEditing={isEditing} placeholder="N/A" />
                                        
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-neutral-500 font-mono block">Type</label>
                                            {isEditing ? (
                                                <select 
                                                    value={displayData?.type}
                                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-xs text-white focus:border-primary/50 focus:outline-none"
                                                >
                                                    <option value="exclusive">Exclusive</option>
                                                    <option value="lease">Lease</option>
                                                    <option value="audio">Audio</option>
                                                    <option value="service">Service</option>
                                                </select>
                                            ) : (
                                                <span className="inline-block px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-neutral-300 uppercase">{displayData?.type}</span>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-1">
                                             <label className="text-[10px] text-neutral-500 font-mono block">Created At</label>
                                             <div className="text-xs text-neutral-300 font-medium">{displayData?.created}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5"></div>

                                {/* Splits */}
                                <div>
                                    <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Splits</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-2">
                                            <InputGroup label="Royalty %" value={displayData?.royaltySplit} onChange={(v) => handleInputChange('royaltySplit', parseInt(v) || 0)} isEditing={isEditing} type="number" />
                                            <InputGroup label="Revenue %" value={displayData?.revenueSplit} onChange={(v) => handleInputChange('revenueSplit', parseInt(v) || 0)} isEditing={isEditing} type="number" />
                                        </div>
                                        <InputGroup label="Notes" value={displayData?.notes} onChange={(v) => handleInputChange('notes', v)} isEditing={isEditing} multiline placeholder="Notes for splits..." />
                                    </div>
                                </div>

                                <div className="h-px bg-white/5"></div>

                                {/* Terms */}
                                <div>
                                    <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Terms & Conditions</h3>
                                    <InputGroup label="Content" value={displayData?.terms} onChange={(v) => handleInputChange('terms', v)} isEditing={isEditing} multiline rows={6} placeholder="Enter detailed terms..." />
                                </div>

                                <div className="h-px bg-white/5"></div>

                                {/* Distribution */}
                                <div>
                                    <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Distribution</h3>
                                    <InputGroup label="Territories" value={displayData?.distNotes} onChange={(v) => handleInputChange('distNotes', v)} isEditing={isEditing} placeholder="Worldwide" />
                                </div>

                                {/* Publishing */}
                                <div>
                                    <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Publishing</h3>
                                    <InputGroup label="Publisher Name" value={displayData?.publisherName} onChange={(v) => handleInputChange('publisherName', v)} isEditing={isEditing} placeholder="N/A" />
                                    <InputGroup label="Notes" value={displayData?.pubNotes} onChange={(v) => handleInputChange('pubNotes', v)} isEditing={isEditing} placeholder="None" />
                                </div>
                            </div>
                        </div>

                        {/* PDF Simulation Area */}
                        <div className="flex-1 bg-[#111] overflow-y-auto custom-scrollbar relative flex flex-col items-center">
                            
                             {/* PDF Controls */}
                             <div className="sticky top-4 z-20 flex gap-2 mb-4">
                                 <button className="p-2 bg-neutral-800/90 backdrop-blur rounded-lg hover:bg-neutral-700 text-white shadow-lg border border-white/10 transition-transform hover:scale-105" title="Download PDF"><Download size={16} /></button>
                                 <button className="p-2 bg-neutral-800/90 backdrop-blur rounded-lg hover:bg-neutral-700 text-white shadow-lg border border-white/10 transition-transform hover:scale-105" title="Print"><Printer size={16} /></button>
                             </div>

                             {/* Paper Container */}
                             <div className="pb-20 px-8">
                                 {/* 
                                    Paper Dimensions: 
                                    Scaled down to ~480px width for better visibility on smaller screens.
                                 */}
                                 <div className="w-[480px] min-h-[680px] bg-white text-black p-10 shadow-2xl flex flex-col text-[9px] leading-relaxed font-serif relative transition-all">
                                     {/* Header */}
                                     <div className="border-b-2 border-black pb-6 mb-6 flex flex-col items-center justify-center text-center relative">
                                         <div className="absolute top-0 right-0 text-right">
                                             <p className="font-bold text-[7px] text-gray-400">ID: {displayData?.id}</p>
                                         </div>
                                         <h1 className="text-2xl font-bold font-serif uppercase tracking-widest mb-2 mt-2">Contract of Agreement</h1>
                                         <p className="text-[8px] text-gray-500 font-sans uppercase tracking-[0.2em]">MusicAccess • Official Document</p>
                                     </div>
                                     
                                     {/* Content Generated from Data */}
                                     <div className="space-y-6 flex-1">
                                         <section>
                                             <h2 className="font-bold text-[10px] mb-2 uppercase border-b border-gray-200 pb-1 font-sans tracking-wider">GENERAL INFORMATION</h2>
                                             <div className="grid grid-cols-1 gap-1">
                                                <p><strong className="font-sans">Title:</strong> {displayData?.title}</p>
                                                <p><strong className="font-sans">Type:</strong> {displayData?.type?.toUpperCase()}</p>
                                                <p><strong className="font-sans">Status:</strong> {displayData?.status}</p>
                                                <p><strong className="font-sans">Created At:</strong> {displayData?.created}</p>
                                             </div>
                                         </section>

                                         <section>
                                             <h2 className="font-bold text-[10px] mb-2 uppercase border-b border-gray-200 pb-1 font-sans tracking-wider">SPLITS</h2>
                                             <p><strong className="font-sans">Royalty Split:</strong> {displayData?.royaltySplit}%</p>
                                             <p><strong className="font-sans">Revenue Split:</strong> {displayData?.revenueSplit}%</p>
                                             {displayData?.notes && <p className="mt-1 text-gray-600 italic"><strong className="font-sans">Notes:</strong> {displayData?.notes}</p>}
                                         </section>

                                         <section>
                                             <h2 className="font-bold text-[10px] mb-2 uppercase border-b border-gray-200 pb-1 font-sans tracking-wider">TERMS AND CONDITIONS</h2>
                                             <p className="whitespace-pre-wrap text-justify">{displayData?.terms || 'No terms specified.'}</p>
                                         </section>

                                         <section>
                                             <h2 className="font-bold text-[10px] mb-2 uppercase border-b border-gray-200 pb-1 font-sans tracking-wider">DISTRIBUTION</h2>
                                             <p><strong className="font-sans">Platforms:</strong> All</p>
                                             <p><strong className="font-sans">Territories:</strong> {displayData?.distNotes || 'Worldwide'}</p>
                                             <p><strong className="font-sans">Notes:</strong> {displayData?.distNotes}</p>
                                         </section>

                                         <section>
                                             <h2 className="font-bold text-[10px] mb-2 uppercase border-b border-gray-200 pb-1 font-sans tracking-wider">PUBLISHING</h2>
                                             <p><strong className="font-sans">Publisher Name:</strong> {displayData?.publisherName || 'N/A'}</p>
                                             <p><strong className="font-sans">Notes:</strong> {displayData?.pubNotes || 'N/A'}</p>
                                         </section>
                                     </div>
                                     
                                     {/* Signatures */}
                                     <div className="mt-8 pt-8 border-t-2 border-black flex justify-between gap-8 bg-gray-50/50 p-4 -mx-4 -mb-4">
                                         <div className="flex-1 z-10 relative">
                                             <div 
                                                className="h-20 flex items-end justify-center border-b border-black pb-2 mb-2 relative cursor-pointer hover:bg-black/5 transition-colors group" 
                                                onClick={handleStartSign}
                                                title="Click to sign"
                                             >
                                                 {isSigning ? (
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={signatureInput}
                                                        onChange={(e) => setSignatureInput(e.target.value)}
                                                        onBlur={handleSaveSignature}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleSaveSignature();
                                                            }
                                                            if (e.key === 'Escape') setIsSigning(false);
                                                        }}
                                                        className="w-full h-full text-center font-signature text-3xl text-black bg-transparent border-none focus:outline-none transform -rotate-2 p-0 m-0 placeholder-gray-300"
                                                        placeholder="Sign Here"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                 ) : (
                                                     displayData?.producerSignature ? (
                                                         <span className="font-signature text-3xl text-black transform -rotate-2 select-none">{displayData.producerSignature}</span>
                                                     ) : (
                                                         <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-black transition-colors">
                                                             <PenLine size={16} className="mb-1" />
                                                             <span className="text-[8px] italic font-sans">Click to e-sign</span>
                                                         </div>
                                                     )
                                                 )}
                                             </div>
                                             <div className="text-center font-bold uppercase text-[8px] font-sans tracking-widest">Producer Signature</div>
                                         </div>
                                         <div className="flex-1">
                                              <div className="h-20 flex items-end justify-center border-b border-black pb-2 mb-2">
                                                  {displayData?.clientSignature ? (
                                                      <span className="font-signature text-3xl text-black transform -rotate-2">{displayData.clientSignature}</span>
                                                  ) : (
                                                    <span className="text-[8px] text-gray-300 italic self-center">Waiting for client...</span>
                                                  )}
                                              </div>
                                             <div className="text-center font-bold uppercase text-[8px] font-sans tracking-widest">Client Signature</div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            ) : (
                 <div className="flex-1 flex items-center justify-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl bg-[#0a0a0a]">
                    <div className="text-center">
                        <FileText size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Select a contract or create a new one</p>
                    </div>
                 </div>
            )}
        </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, isEditing, multiline, rows, type = "text", placeholder }: any) => (
    <div className="space-y-1">
        <label className="text-[10px] text-neutral-500 font-mono block">{label}</label>
        {isEditing ? (
            multiline ? (
                <textarea 
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows || 3}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:border-primary/50 focus:outline-none resize-none placeholder-neutral-700"
                    placeholder={placeholder}
                />
            ) : (
                <input 
                    type={type}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:border-primary/50 focus:outline-none placeholder-neutral-700"
                    placeholder={placeholder}
                />
            )
        ) : (
            <div className="text-xs text-neutral-300 font-medium min-h-[1.5em] whitespace-pre-wrap break-words">
                {value || <span className="text-neutral-600 italic">{placeholder || 'N/A'}</span>}
            </div>
        )}
    </div>
);

export default ContractsPage;
