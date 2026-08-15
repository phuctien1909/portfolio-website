import { render, screen, fireEvent } from '@testing-library/react';
import { SkillsForm } from '../components/cv/editor/SkillsForm';
import type { SkillGroup } from '../lib/cv-types';

const groups: SkillGroup[] = [
  { id: 'g1', category: 'Languages', items: ['Java', 'Python'] },
];

const twoGroups: SkillGroup[] = [
  { id: 'g1', category: 'Languages', items: ['Java', 'SQL'] },
  { id: 'g2', category: 'Databases', items: [] },
];

test('the category dropdown moves a skill to another group', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={twoGroups} onChange={onChange} />);
  fireEvent.change(screen.getByLabelText('Category for SQL'), { target: { value: 'g2' } });
  expect(onChange).toHaveBeenCalledWith([
    { id: 'g1', category: 'Languages', items: ['Java'] },
    { id: 'g2', category: 'Databases', items: ['SQL'] },
  ]);
});

test('the dropdown shows for a single group so you can start categorizing', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={groups} onChange={onChange} />);
  // dropdown must be present even with one group (this was the regression)
  expect(screen.getByLabelText('Category for Java')).toBeInTheDocument();
});

test('editing a skill input changes that skill in place', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={groups} onChange={onChange} />);
  fireEvent.change(screen.getByDisplayValue('Java'), { target: { value: 'TypeScript' } });
  expect(onChange).toHaveBeenCalledWith([
    { id: 'g1', category: 'Languages', items: ['TypeScript', 'Python'] },
  ]);
});

test('the down arrow reorders skills within a category', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={groups} onChange={onChange} />);
  fireEvent.click(screen.getByLabelText('Move Java down'));
  expect(onChange).toHaveBeenCalledWith([
    { id: 'g1', category: 'Languages', items: ['Python', 'Java'] },
  ]);
});

test('the up arrow reorders whole categories', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={twoGroups} onChange={onChange} />);
  fireEvent.click(screen.getByLabelText('Move Databases up'));
  expect(onChange).toHaveBeenCalledWith([
    { id: 'g2', category: 'Databases', items: [] },
    { id: 'g1', category: 'Languages', items: ['Java', 'SQL'] },
  ]);
});

test('"+ New category" moves the skill into a freshly created group', () => {
  const onChange = jest.fn();
  const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('Databases');
  render(<SkillsForm value={groups} onChange={onChange} />);
  fireEvent.change(screen.getByLabelText('Category for Python'), { target: { value: '__new__' } });
  const arg = onChange.mock.calls[0][0];
  expect(arg[0]).toEqual({ id: 'g1', category: 'Languages', items: ['Java'] });
  expect(arg[1]).toMatchObject({ category: 'Databases', items: ['Python'] });
  promptSpy.mockRestore();
});

test('adding a skill via Enter appends to the group', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={groups} onChange={onChange} />);
  const input = screen.getByPlaceholderText('Add a skill, press Enter');
  fireEvent.change(input, { target: { value: 'Go' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onChange).toHaveBeenCalledWith([
    { id: 'g1', category: 'Languages', items: ['Java', 'Python', 'Go'] },
  ]);
});

test('remove button removes a skill from the group', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={groups} onChange={onChange} />);
  fireEvent.click(screen.getByLabelText('Remove Python'));
  expect(onChange).toHaveBeenCalledWith([
    { id: 'g1', category: 'Languages', items: ['Java'] },
  ]);
});

test('editing the category name updates the group', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={groups} onChange={onChange} />);
  fireEvent.change(screen.getByPlaceholderText('Category (e.g. Languages)'), { target: { value: 'Core Languages' } });
  expect(onChange).toHaveBeenCalledWith([
    { id: 'g1', category: 'Core Languages', items: ['Java', 'Python'] },
  ]);
});

test('Add category appends an empty group', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={groups} onChange={onChange} />);
  fireEvent.click(screen.getByText('+ Add category'));
  const arg = onChange.mock.calls[0][0];
  expect(arg).toHaveLength(2);
  expect(arg[1]).toMatchObject({ category: '', items: [] });
});

test('Remove deletes the whole group', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={groups} onChange={onChange} />);
  fireEvent.click(screen.getByLabelText('Remove Languages'));
  expect(onChange).toHaveBeenCalledWith([]);
});

test('duplicate skill in the same group is ignored', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={groups} onChange={onChange} />);
  const input = screen.getByPlaceholderText('Add a skill, press Enter');
  fireEvent.change(input, { target: { value: 'Java' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onChange).not.toHaveBeenCalled();
});
