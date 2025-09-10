import React from 'react';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
}

// FIX: This component violates the API key handling guidelines by prompting the user for an API key.
// The application must not ask the user for the key under any circumstances.
// Its implementation is removed to prevent accidental use, and it now renders nothing.
const ApiKeyModal: React.FC<ApiKeyModalProps> = () => {
  return null;
};

export default ApiKeyModal;
