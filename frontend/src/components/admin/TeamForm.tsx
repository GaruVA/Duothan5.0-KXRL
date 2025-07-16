import React, { useState, useEffect } from 'react';
import type { Team, TeamMember } from './team-types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select } from '../ui/select';

interface TeamFormProps {
  team?: Team;
  onSubmit: (teamData: Omit<Team, '_id' | 'createdAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({
  team,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    teamName: team?.teamName || '',
    email: team?.email || '',
    password: '',
    members: team?.members || [{ name: '', email: '' }],
    isActive: team?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (team) {
      setFormData({
        teamName: team.teamName,
        email: team.email,
        password: '',
        members: team.members.length > 0 ? team.members : [{ name: '', email: '' }],
        isActive: team.isActive,
      });
    }
  }, [team]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    } else if (formData.teamName.length < 3) {
      newErrors.teamName = 'Team name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!team && !formData.password) {
      newErrors.password = 'Password is required for new teams';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate members
    formData.members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`member_${index}_name`] = 'Member name is required';
      }
      if (!member.email.trim()) {
        newErrors[`member_${index}_email`] = 'Member email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        newErrors[`member_${index}_email`] = 'Please enter a valid email address';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        members: formData.members.filter(member => member.name.trim() && member.email.trim()),
      };
      
      // Don't include password if it's empty (for updates)
      if (!submitData.password) {
        delete (submitData as any).password;
      }
      
      onSubmit(submitData);
    }
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, members: newMembers });
  };

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: '', email: '' }],
    });
  };

  const removeMember = (index: number) => {
    if (formData.members.length > 1) {
      const newMembers = formData.members.filter((_, i) => i !== index);
      setFormData({ ...formData, members: newMembers });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {team ? 'Edit Team' : 'Create New Team'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                type="text"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="Enter team name"
                className={errors.teamName ? 'border-red-500' : ''}
              />
              {errors.teamName && (
                <p className="text-red-500 text-sm">{errors.teamName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter team email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {team && '(leave empty to keep current password)'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={team ? 'Enter new password (optional)' : 'Enter password'}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.isActive.toString()}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Team Members</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMember}
              >
                Add Member
              </Button>
            </div>

            {formData.members.map((member, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <Label htmlFor={`member_${index}_name`}>Name</Label>
                  <Input
                    id={`member_${index}_name`}
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    placeholder="Member name"
                    className={errors[`member_${index}_name`] ? 'border-red-500' : ''}
                  />
                  {errors[`member_${index}_name`] && (
                    <p className="text-red-500 text-sm">{errors[`member_${index}_name`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`member_${index}_email`}>Email</Label>
                    {formData.members.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMember(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <Input
                    id={`member_${index}_email`}
                    type="email"
                    value={member.email}
                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                    placeholder="member@example.com"
                    className={errors[`member_${index}_email`] ? 'border-red-500' : ''}
                  />
                  {errors[`member_${index}_email`] && (
                    <p className="text-red-500 text-sm">{errors[`member_${index}_email`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (team ? 'Update Team' : 'Create Team')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
