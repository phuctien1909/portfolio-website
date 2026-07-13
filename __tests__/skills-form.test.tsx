import { render, screen, fireEvent } from '@testing-library/react';
import { SkillsForm } from '../components/cv/editor/SkillsForm';

const skills = ['Java', 'Python', 'Go'];

test('dragging a chip onto another reorders the array', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={skills} onChange={onChange} />);
  fireEvent.dragStart(screen.getByText('Java'));
  fireEvent.dragOver(screen.getByText('Go'));
  fireEvent.drop(screen.getByText('Go'));
  expect(onChange).toHaveBeenCalledWith(['Python', 'Go', 'Java']);
});

test('dropping a chip onto itself does not call onChange', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={skills} onChange={onChange} />);
  fireEvent.dragStart(screen.getByText('Python'));
  fireEvent.drop(screen.getByText('Python'));
  expect(onChange).not.toHaveBeenCalled();
});

test('remove button still removes the skill', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={skills} onChange={onChange} />);
  fireEvent.click(screen.getByLabelText('Remove Python'));
  expect(onChange).toHaveBeenCalledWith(['Java', 'Go']);
});

test('adding a skill via Enter still works', () => {
  const onChange = jest.fn();
  render(<SkillsForm value={skills} onChange={onChange} />);
  const input = screen.getByPlaceholderText('Type a skill and press Enter or comma');
  fireEvent.change(input, { target: { value: 'Rust' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onChange).toHaveBeenCalledWith(['Java', 'Python', 'Go', 'Rust']);
});
