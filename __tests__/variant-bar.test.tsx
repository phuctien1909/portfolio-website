import { render, screen, fireEvent } from '@testing-library/react';
import { VariantBar } from '../components/cv/editor/VariantBar';
import { defaultCV } from '../lib/cv-defaults';
import type { CVVariant } from '../lib/cv-types';

const variants: CVVariant[] = [
  { id: 'a', name: 'Master', updatedAt: '', data: defaultCV },
  { id: 'b', name: 'Backend', updatedAt: '', data: defaultCV },
];

const noop = () => {};

test('lists variants and fires onSelect / onNew', () => {
  const onSelect = jest.fn();
  const onNew = jest.fn();
  render(
    <VariantBar
      variants={variants}
      activeId="a"
      onSelect={onSelect}
      onNew={onNew}
      onDuplicate={noop}
      onRename={noop}
      onDelete={noop}
    />
  );
  fireEvent.change(screen.getByLabelText('CV'), { target: { value: 'b' } });
  expect(onSelect).toHaveBeenCalledWith('b');
  fireEvent.click(screen.getByText('New'));
  expect(onNew).toHaveBeenCalled();
});

test('disables Delete when only one variant remains', () => {
  render(
    <VariantBar
      variants={[variants[0]]}
      activeId="a"
      onSelect={noop}
      onNew={noop}
      onDuplicate={noop}
      onRename={noop}
      onDelete={noop}
    />
  );
  expect(screen.getByText('Delete')).toBeDisabled();
});
