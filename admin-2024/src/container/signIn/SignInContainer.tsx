import React from 'react';

const SignInContainer = ({ children }: { children: React.ReactNode }) => (
  <div className='flex h-full w-full items-center justify-center'>
    {children}
  </div>
);

export default SignInContainer;
