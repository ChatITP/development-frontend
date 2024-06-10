import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert'; 

interface Prompt {
  _id: number;
  filename: string;
  type: string;
  system_prompt: string;
  main_prompt: string;
  created_at: Date;
}

const PromptsPage: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filename, setFilename] = useState<string>('');
  const [promptType, setPromptType] = useState<string>('itp_collective_consciousness_model');
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      setError('Failed to fetch prompts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const savePrompt = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        body: JSON.stringify({
          filename,
          type: promptType,
          system_prompt: systemPrompt,
          main_prompt: userPrompt,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to save the prompt');
      }
      setSuccess('Prompt saved successfully!');
      fetchPrompts();
    } catch (error) {
      setError('Failed to save prompt. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPrompt = (prompt: Prompt) => {
    setFilename(prompt.filename);
    setPromptType(prompt.type);
    setSystemPrompt(prompt.system_prompt);
    setUserPrompt(prompt.main_prompt);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prompts Management</h1>
      </header>

      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-1/3 lg:pr-4 mb-6 lg:mb-0">
          <h2 className="text-xl font-semibold mb-4">Available Prompts</h2>
          <div className="space-y-2">
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              prompts.map((prompt) => (
                <div
                  key={prompt._id}
                  onClick={() => loadPrompt(prompt)}
                  className="p-3 bg-white rounded shadow cursor-pointer hover:bg-gray-100 transition"
                >
                  <h3 className="font-bold">{prompt.filename}</h3>
                  <p className="text-sm text-gray-500">{prompt.type}</p>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Prompt Editor */}
        <main className="w-full lg:w-2/3 bg-white p-6 rounded-lg border border-neutral-200">
          <h2 className="text-xl font-semibold mb-4">Edit Prompt</h2>
          <div className="mb-4">
            <Input
              type="text"
              id="filename"
              name="filename"
              placeholder="Prompt title"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Select onValueChange={setPromptType} value={promptType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select prompt type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="itp_collective_consciousness_model">ITP Collective Consciousness Model</SelectItem>
                <SelectItem value="itp_creative_exploration_17">ITP Creative Exploration 17</SelectItem>
                <SelectItem value="itp_artistic_expression_prompt">ITP Artistic Expression Prompt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">System Prompt</label>
            <Textarea
              id="system-prompt-editor"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={5}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">User Prompt</label>
            <Textarea
              id="main-prompt-editor"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              rows={5}
              className="w-full"
            />
          </div>
        </main>
      </div>

      <footer className="mt-8 flex justify-end">
        <Button onClick={savePrompt} disabled={isLoading} className="px-6 py-2">
          Save Prompt
        </Button>
      </footer>

      {error && (
        <Alert className="mt-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert className="mt-4">
          {success}
        </Alert>
      )}
    </div>
  );
};

export default PromptsPage;