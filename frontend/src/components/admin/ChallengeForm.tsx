import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { Label } from '../ui/label';
import type { ChallengeFormData, TestCase, Example, Hint } from './types';

interface ChallengeFormProps {
  onSubmit: (data: ChallengeFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ChallengeFormData>;
  isLoading?: boolean;
}

const ChallengeForm: React.FC<ChallengeFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ChallengeFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    problemStatement: initialData?.problemStatement || '',
    inputFormat: initialData?.inputFormat || '',
    outputFormat: initialData?.outputFormat || '',
    constraints: initialData?.constraints || '',
    examples: initialData?.examples || [],
    testCases: initialData?.testCases || [],
    difficulty: initialData?.difficulty || 'Easy',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    timeLimit: initialData?.timeLimit || 2,
    memoryLimit: initialData?.memoryLimit || 128000,
    allowedLanguages: initialData?.allowedLanguages || [],
    points: initialData?.points || 100,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    hints: initialData?.hints || [],
    flag: initialData?.flag || '',
    buildathonProblem: initialData?.buildathonProblem || {
      description: '',
      requirements: '',
      deliverables: []
    }
  });

  const [tagInput, setTagInput] = useState('');
  const [deliverableInput, setDeliverableInput] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? Number(value) : value
    }));
  };

  const handleBuildathonChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      buildathonProblem: {
        ...prev.buildathonProblem,
        [field]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddDeliverable = () => {
    if (deliverableInput.trim() && !formData.buildathonProblem.deliverables.includes(deliverableInput.trim())) {
      setFormData(prev => ({
        ...prev,
        buildathonProblem: {
          ...prev.buildathonProblem,
          deliverables: [...prev.buildathonProblem.deliverables, deliverableInput.trim()]
        }
      }));
      setDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (deliverableToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      buildathonProblem: {
        ...prev.buildathonProblem,
        deliverables: prev.buildathonProblem.deliverables.filter(d => d !== deliverableToRemove)
      }
    }));
  };

  const handleAddExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  const handleUpdateExample = (index: number, field: keyof Example, value: string) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.map((example, i) =>
        i === index ? { ...example, [field]: value } : example
      )
    }));
  };

  const handleRemoveExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const handleAddTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: false, points: 1 }]
    }));
  };

  const handleUpdateTestCase = (index: number, field: keyof TestCase, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.map((testCase, i) =>
        i === index ? { ...testCase, [field]: value } : testCase
      )
    }));
  };

  const handleRemoveTestCase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  const handleAddHint = () => {
    setFormData(prev => ({
      ...prev,
      hints: [...prev.hints, { content: '', pointsDeduction: 5 }]
    }));
  };

  const handleUpdateHint = (index: number, field: keyof Hint, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      hints: prev.hints.map((hint, i) =>
        i === index ? { ...hint, [field]: value } : hint
      )
    }));
  };

  const handleRemoveHint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Challenge title"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                placeholder="e.g., Array, String, Graph"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                name="points"
                type="number"
                value={formData.points}
                onChange={handleInputChange}
                min="1"
                max="1000"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Brief description of the challenge"
              rows={3}
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="flag">Flag (Answer to algorithmic problem) *</Label>
            <Input
              id="flag"
              name="flag"
              value={formData.flag}
              onChange={handleInputChange}
              required
              placeholder="The correct answer/flag for the algorithmic problem"
            />
          </div>
        </Card>

        {/* Problem Statement */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Algorithmic Problem Statement</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="problemStatement">Problem Statement *</Label>
              <Textarea
                id="problemStatement"
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleInputChange}
                required
                placeholder="Detailed algorithmic problem description"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inputFormat">Input Format *</Label>
                <Textarea
                  id="inputFormat"
                  name="inputFormat"
                  value={formData.inputFormat}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe the input format"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="outputFormat">Output Format *</Label>
                <Textarea
                  id="outputFormat"
                  name="outputFormat"
                  value={formData.outputFormat}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe the output format"
                  rows={3}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="constraints">Constraints *</Label>
              <Textarea
                id="constraints"
                name="constraints"
                value={formData.constraints}
                onChange={handleInputChange}
                required
                placeholder="List the constraints"
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Buildathon Problem */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Buildathon Problem (Unlocked after flag submission)</h3>
          <div className="space-y-4">
            <div>
              <Label>Buildathon Description *</Label>
              <Textarea
                value={formData.buildathonProblem.description}
                onChange={(e) => handleBuildathonChange('description', e.target.value)}
                required
                placeholder="Describe the buildathon task"
                rows={4}
              />
            </div>
            <div>
              <Label>Requirements *</Label>
              <Textarea
                value={formData.buildathonProblem.requirements}
                onChange={(e) => handleBuildathonChange('requirements', e.target.value)}
                required
                placeholder="List the technical requirements"
                rows={3}
              />
            </div>
            <div>
              <Label>Deliverables</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={deliverableInput}
                  onChange={(e) => setDeliverableInput(e.target.value)}
                  placeholder="Add a deliverable"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDeliverable())}
                />
                <Button type="button" onClick={handleAddDeliverable}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.buildathonProblem.deliverables.map((deliverable, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center"
                  >
                    {deliverable}
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(deliverable)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Examples */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Examples</h3>
            <Button type="button" onClick={handleAddExample} variant="outline">
              Add Example
            </Button>
          </div>
          {formData.examples.map((example, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Example {index + 1}</span>
                <Button
                  type="button"
                  onClick={() => handleRemoveExample(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Input</Label>
                  <Textarea
                    value={example.input}
                    onChange={(e) => handleUpdateExample(index, 'input', e.target.value)}
                    placeholder="Sample input"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Output</Label>
                  <Textarea
                    value={example.output}
                    onChange={(e) => handleUpdateExample(index, 'output', e.target.value)}
                    placeholder="Expected output"
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-2">
                <Label>Explanation</Label>
                <Textarea
                  value={example.explanation}
                  onChange={(e) => handleUpdateExample(index, 'explanation', e.target.value)}
                  placeholder="Explanation of the example"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </Card>

        {/* Test Cases */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Test Cases</h3>
            <Button type="button" onClick={handleAddTestCase} variant="outline">
              Add Test Case
            </Button>
          </div>
          {formData.testCases.map((testCase, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Test Case {index + 1}</span>
                <Button
                  type="button"
                  onClick={() => handleRemoveTestCase(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Input</Label>
                  <Textarea
                    value={testCase.input}
                    onChange={(e) => handleUpdateTestCase(index, 'input', e.target.value)}
                    placeholder="Test input"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Expected Output</Label>
                  <Textarea
                    value={testCase.expectedOutput}
                    onChange={(e) => handleUpdateTestCase(index, 'expectedOutput', e.target.value)}
                    placeholder="Expected output"
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={testCase.points}
                    onChange={(e) => handleUpdateTestCase(index, 'points', Number(e.target.value))}
                    min="0"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`hidden-${index}`}
                    checked={testCase.isHidden}
                    onChange={(e) => handleUpdateTestCase(index, 'isHidden', e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor={`hidden-${index}`}>Hidden Test Case</Label>
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Hints */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Hints</h3>
            <Button type="button" onClick={handleAddHint} variant="outline">
              Add Hint
            </Button>
          </div>
          {formData.hints.map((hint, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Hint {index + 1}</span>
                <Button
                  type="button"
                  onClick={() => handleRemoveHint(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label>Content</Label>
                  <Textarea
                    value={hint.content}
                    onChange={(e) => handleUpdateHint(index, 'content', e.target.value)}
                    placeholder="Hint content"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Points Deduction</Label>
                  <Input
                    type="number"
                    value={hint.pointsDeduction}
                    onChange={(e) => handleUpdateHint(index, 'pointsDeduction', Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
              <Input
                id="timeLimit"
                name="timeLimit"
                type="number"
                value={formData.timeLimit}
                onChange={handleInputChange}
                min="0.1"
                max="10"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="memoryLimit">Memory Limit (KB)</Label>
              <Input
                id="memoryLimit"
                name="memoryLimit"
                type="number"
                value={formData.memoryLimit}
                onChange={handleInputChange}
                min="16000"
                max="512000"
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              <Label htmlFor="isActive">Active Challenge</Label>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4">
            <Label>Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Challenge' : 'Create Challenge')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChallengeForm;
