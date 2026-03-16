import { render } from '@testing-library/react-native';
import React from 'react';

import MealCard from '@/components/card/MealCard';

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('MealCard', () => {
  it('renders the cat name capitalized', () => {
    const { getByText } = render(<MealCard catName="luna" time="10:00" amount={80} />);
    expect(getByText('Luna')).toBeTruthy();
  });

  it('renders next meal info when time and amount are provided', () => {
    const { getByText } = render(<MealCard catName="Pookie" time="10:00" amount={80} />);
    expect(getByText('Next meal · 10:00 · 80g')).toBeTruthy();
  });

  it('renders fallback text when no schedule is set', () => {
    const { getByText } = render(<MealCard catName="Pookie" />);
    expect(getByText('No meals scheduled yet')).toBeTruthy();
  });

  it('renders fallback text when time is the placeholder dash', () => {
    const { getByText } = render(<MealCard catName="Pookie" time="—" amount={0} />);
    expect(getByText('No meals scheduled yet')).toBeTruthy();
  });

  it('renders correctly with an all-uppercase cat name', () => {
    const { getByText } = render(<MealCard catName="WHISKERS" time="08:30" amount={50} />);
    expect(getByText('WHISKERS')).toBeTruthy();
  });
});
