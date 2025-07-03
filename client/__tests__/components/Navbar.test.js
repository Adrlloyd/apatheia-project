import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../src/components/Navbar';
import { getUserInfo, clearUserSession } from '../../src/utils/storageUtils';

// Mock the storage utils
jest.mock('../../src/utils/storageUtils', () => ({
  getUserInfo: jest.fn(),
  clearUserSession: jest.fn(),
}));

// Mock react-router
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

// Helper function to render component
const renderComponent = (component) => {
  return render(component);
};

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navbar with user name and greeting for first visit', () => {
    getUserInfo.mockReturnValue({ name: 'John', firstVisit: true });
    
    renderComponent(<Navbar />);
    
    expect(screen.getByText('Chaire, John')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  test('renders welcome back message for returning user', () => {
    getUserInfo.mockReturnValue({ name: 'Jane', firstVisit: false });
    
    renderComponent(<Navbar />);
    
    expect(screen.getByText('Welcome back, Jane')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    getUserInfo.mockReturnValue({ name: 'John', firstVisit: false });
    
    renderComponent(<Navbar />);
    
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Archive' })).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('shows dropdown on profile hover', () => {
    getUserInfo.mockReturnValue({ name: 'John', firstVisit: false });
    
    renderComponent(<Navbar />);
    
    const profileMenu = screen.getByText('Profile').closest('.profile-menu');
    
    // Dropdown should not be visible initially
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    
    // Hover over profile menu
    fireEvent.mouseEnter(profileMenu);
    
    // Dropdown should now be visible
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  test('hides dropdown on mouse leave', () => {
    getUserInfo.mockReturnValue({ name: 'John', firstVisit: false });
    
    renderComponent(<Navbar />);
    
    const profileMenu = screen.getByText('Profile').closest('.profile-menu');
    
    // Show dropdown
    fireEvent.mouseEnter(profileMenu);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    
    // Hide dropdown
    fireEvent.mouseLeave(profileMenu);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  test('handles logout correctly', () => {
    getUserInfo.mockReturnValue({ name: 'John', firstVisit: false });
    
    renderComponent(<Navbar />);
    
    const profileMenu = screen.getByText('Profile').closest('.profile-menu');
    fireEvent.mouseEnter(profileMenu);
    
    const logoutButton = screen.getByText('Log Out');
    fireEvent.click(logoutButton);
    
    expect(clearUserSession).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});