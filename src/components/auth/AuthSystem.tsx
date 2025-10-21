import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { User, LogIn, LogOut } from 'lucide-react';
import { User as UserType } from '../../types';

interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('flashfusion-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('flashfusion-user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - replace with real authentication
    const mockUser: UserType = {
      id: '1',
      email,
      username: email.split('@')[0],
      user_metadata: {
        name: 'Demo User',
      },
      role: 'pro',
      stats: {
        level: 5,
        xp: 1250,
        total_xp: 1250,
        current_streak: 3,
      }
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('flashfusion-user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup - replace with real authentication
    const mockUser: UserType = {
      id: '1',
      email,
      username: email.split('@')[0],
      user_metadata: {
        name,
      },
      role: 'free',
      stats: {
        level: 1,
        xp: 0,
        total_xp: 0,
        current_streak: 0,
      }
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('flashfusion-user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('flashfusion-user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthButton() {
  const { user, isAuthenticated, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user.user_metadata?.name || user.username}</p>
            <p className="text-xs text-muted-foreground">Level {user.stats?.level || user.level || 1}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button className="ff-btn-primary">
      <LogIn className="w-4 h-4 mr-2" />
      Sign In
    </Button>
  );
}