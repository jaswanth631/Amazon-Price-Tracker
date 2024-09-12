import { FC, ReactNode } from 'react';
import { Button } from './ui/button';

interface GoogleSignInButtonProps {
  children: ReactNode;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {

  return (
    <Button className="w-full">
      <a href="http://localhost:3000/auth/google">Sign in with Google</a>
    
    </Button>
  );
};

export default GoogleSignInButton;
