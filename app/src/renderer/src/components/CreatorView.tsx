import React, { useState, useRef } from 'react';
import { Drill, DrillLayout, ObjectBallSchema } from '@billiards/shared';
import VirtualTable from './VirtualTable';

type OmitId<T> = Omit<T, 'id'>;

export default function CreatorView() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Drill['category']>('cut_shot');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [successCriteria, setSuccessCriteria] = useState('');
  
  const [layout, setLayout] = useState<DrillLayout>({
    cue_ball: { x: -1, y: -1 }, // -1 means unplaced
    object_balls: []
  });

  const [mode, setMode] = useState<'cue_ball' | 'object_ball'>('cue_ball');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/generate-drill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      if (!res.ok) throw new Error('Failed to generate drill from AI');
      
      const data = await res.json();
      
      // Update form metadata if provided
      if (data.title) setTitle(data.title);
      if (data.category) setCategory(data.category);
      
      // Update layout
      if (data.layout) {
        setLayout(data.layout);
      }
      
      setAiPrompt('');
      setSuccessMsg('AI generated layout successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'AI generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!tableRef.current) return;
    const rect = tableRef.current.getBoundingClientRect();
    
    // Calculate normalized coordinates (0.0 to 1.0)
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;

    // Clamp
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));

    if (mode === 'cue_ball') {
      setLayout(prev => ({
        ...prev,
        cue_ball: { x, y }
      }));
    } else if (mode === 'object_ball') {
      setLayout(prev => {
        const nextNumber = prev.object_balls.length + 1;
        return {
          ...prev,
          object_balls: [
            ...prev.object_balls,
            { id: `ball-${nextNumber}`, number: nextNumber, position: { x, y } }
          ]
        };
      });
    }
  };

  const handleClearCanvas = () => {
    setLayout({
      cue_ball: { x: -1, y: -1 },
      object_balls: []
    });
  };

  const isValid = () => {
    if (!title.trim()) return false;
    if (layout.cue_ball.x === -1) return false; // cue_ball not placed
    if (layout.object_balls.length === 0) return false;
    return true;
  };

  const handleSave = async () => {
    if (!isValid()) return;
    setSaving(true);
    setError('');
    setSuccessMsg('');

    const newDrill: OmitId<Drill> = {
      title,
      category,
      difficulty,
      table_compatibility: ['9ft'],
      layout,
      success_criteria: successCriteria || 'Complete the drill',
      coaching_notes: [],
      version: '1.0',
      author_id: 'system'
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/drills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDrill)
      });

      if (!res.ok) throw new Error('Failed to save drill to database');
      
      setSuccessMsg('Drill saved successfully!');
      
      // Reset form on success
      setTitle('');
      setCategory('cut_shot');
      setDifficulty(1);
      setSuccessCriteria('');
      handleClearCanvas();
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // For rendering VirtualTable safely since cue_ball might be unplaced
  const renderLayout: DrillLayout = {
    cue_ball: layout.cue_ball.x !== -1 ? layout.cue_ball : { x: -100, y: -100 }, // move offscreen if unplaced
    object_balls: layout.object_balls
  };

  return (
    <div>
      <h2>Drill Creator Sandbox</h2>
      <p style={{ color: '#666' }}>Internal Sandbox for generating drill content.</p>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        {/* Left Side: Metadata Form */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          
          <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bbdefb' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✨ AI Copilot
            </h3>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Describe a drill (e.g., 'A long straight stop shot from the head string...')"
              style={{ width: '100%', padding: '8px', minHeight: '80px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #90caf9' }}
            />
            <button
              onClick={handleAiGenerate}
              disabled={generating || !aiPrompt.trim()}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: generating || !aiPrompt.trim() ? '#ccc' : '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: generating || !aiPrompt.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {generating ? 'Generating Layout...' : 'Generate with AI'}
            </button>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Title *</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              style={{ width: '100%', padding: '8px' }} 
              placeholder="e.g. Draw Shot Practice" 
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Category</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value as Drill['category'])}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="cut_shot">Cut Shot</option>
              <option value="position_play">Position Play</option>
              <option value="safety">Safety</option>
              <option value="bank">Bank</option>
              <option value="break">Break</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Difficulty (1-5)</label>
            <input 
              type="number" 
              min="1" max="5" 
              value={difficulty} 
              onChange={e => setDifficulty(parseInt(e.target.value) || 1)}
              style={{ width: '100%', padding: '8px' }} 
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Success Criteria</label>
            <textarea 
              value={successCriteria} 
              onChange={e => setSuccessCriteria(e.target.value)}
              style={{ width: '100%', padding: '8px', minHeight: '80px' }} 
              placeholder="Make the object ball."
            />
          </div>

          <button 
            onClick={handleSave} 
            disabled={!isValid() || saving}
            style={{ 
              padding: '12px 20px', 
              backgroundColor: isValid() ? '#4caf50' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              fontWeight: 'bold',
              cursor: isValid() ? 'pointer' : 'not-allowed',
              width: '100%'
            }}
          >
            {saving ? 'Saving...' : 'Save Drill'}
          </button>
        </div>

        {/* Right Side: Interactive Table */}
        <div style={{ flex: 2 }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>Placement Mode:</label>
            <label>
              <input type="radio" checked={mode === 'cue_ball'} onChange={() => setMode('cue_ball')} />
              ⚪ Cue Ball
            </label>
            <label>
              <input type="radio" checked={mode === 'object_ball'} onChange={() => setMode('object_ball')} />
              🔴 Object Ball
            </label>

            <button 
              onClick={handleClearCanvas}
              style={{ marginLeft: 'auto', padding: '6px 12px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Clear Canvas
            </button>
          </div>

          <p style={{ fontSize: '14px', color: '#666' }}>Click on the table below to place the active ball. Object balls automatically number themselves 1, 2, 3...</p>
          
          <div 
            ref={tableRef}
            onClick={handleCanvasClick}
            style={{ cursor: 'crosshair', display: 'inline-block' }}
          >
            <VirtualTable layout={renderLayout} width={600} height={300} />
          </div>
        </div>
      </div>
    </div>
  );
}
