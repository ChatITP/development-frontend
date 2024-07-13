import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2Icon } from 'lucide-react';
import { request } from '@/lib/request';
interface Prompt {
  _id: string;
  title: string;
  type: string;
  system_prompt: string;
  main_prompt: string;
  created_at: Date;
}

const PromptsPage: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentPromptId, setCurrentPromptId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [promptType, setPromptType] = useState<string>(
    'itp_collective_consciousness_model',
  );
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await request('GET', 'http://localhost:3001/db/prompts');
      const data = response.data;
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
      currentPromptId
        ? await request(
            'PUT',
            `http://localhost:3001/db/prompts/${currentPromptId}`,
            {
              title,
              type: promptType,
              system_prompt: systemPrompt,
              main_prompt: userPrompt,
            },
          )
        : await request('POST', 'http://localhost:3001/db/prompts', {
            title,
            type: promptType,
            system_prompt: systemPrompt,
            main_prompt: userPrompt,
          });
      setSuccess(
        currentPromptId
          ? 'Prompt updated successfully!'
          : 'Prompt saved successfully!',
      );
      fetchPrompts();
      setCurrentPromptId(null); // Reset current prompt ID after save
    } catch (error) {
      setError(
        currentPromptId
          ? 'Failed to update prompt. Please try again later.'
          : 'Failed to save prompt. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeletePrompt = (prompt: Prompt) => {
    setPromptToDelete(prompt);
  };

  const deletePrompt = async () => {
    if (!promptToDelete) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await request(
        'DELETE',
        `http://localhost:3001/db/prompts/${promptToDelete._id}`,
      );
      setSuccess('Prompt deleted successfully!');
      fetchPrompts();
      setPromptToDelete(null); // Reset the prompt to delete after deletion
    } catch (error) {
      setError('Failed to delete prompt. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPrompt = (prompt: Prompt) => {
    setCurrentPromptId(prompt._id);
    setTitle(prompt.title);
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
                  className="p-3 bg-white rounded-lg border border-neutral-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition"
                >
                  <div onClick={() => loadPrompt(prompt)}>
                    <h3 className="font-bold">{prompt.title}</h3>
                    <p className="text-sm text-gray-500">{prompt.type}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => confirmDeletePrompt(prompt)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the prompt.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setPromptToDelete(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={deletePrompt}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            )}
          </div>
        </aside>
        <main className="w-full lg:w-2/3 bg-white p-6 rounded-lg border border-neutral-200">
          <h2 className="text-xl font-semibold mb-4">Edit Prompt</h2>
          <div className="mb-4">
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Prompt title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Select onValueChange={setPromptType} value={promptType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select prompt type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="itp_collective_consciousness_model">
                  ITP Collective Consciousness Model
                </SelectItem>
                <SelectItem value="itp_creative_exploration_17">
                  ITP Creative Exploration 17
                </SelectItem>
                <SelectItem value="itp_artistic_expression_prompt">
                  ITP Artistic Expression Prompt
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">System Prompt</label>
            <Textarea
              id="system-prompt-editor"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={25}
              className="w-full"
            />
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-700 mb-2">User Prompt</label>
            <Textarea
              id="main-prompt-editor"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              rows={5}
              className="w-full"
            />
          </div> */}
          <Button
            onClick={savePrompt}
            disabled={isLoading}
            className="px-6 py-2 w-full"
          >
            Save Prompt
          </Button>
        </main>
      </div>

      <footer className="mt-8 flex justify-end"></footer>
    </div>
  );
};

export default PromptsPage;
