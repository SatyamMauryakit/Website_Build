'use client';
import { ActionContext } from '@/context/ActionContext';
import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react';
import React, { useContext, useEffect, useRef } from 'react';

const SandPackPreviewClient = () => {
  const previewRef = useRef();
  const { sandpack } = useSandpack();
  const { action } = useContext(ActionContext);

  useEffect(() => {
    if (!sandpack || !action?.actionType) return;

    const timer = setTimeout(() => {
      GetSandpackClient();
    }, 100); // Wait for previewRef to become available

    return () => clearTimeout(timer);
  }, [sandpack, action]);

  const GetSandpackClient = async () => {
    const client = previewRef.current?.getClient();

    if (!client) return;

    try {
      const result = await client.getCodeSandboxURL();
      

      if (action?.actionType === 'deploy' && result?.sandboxId) {
        // Use full deploy URL with correct pattern
        const deployUrl = 'https://'+result?.sandboxId+'.csb.app/';
        window.open(deployUrl);
      } else if (action?.actionType === 'export' && result?.editorUrl) {
        window.open(result.editorUrl, '_blank');
      }
    } catch (err) {
      console.error('Failed to get sandbox URL:', err);
    }
  };

  return (
    <div className="w-full h-screen">
      <SandpackPreview
        ref={previewRef}
        style={{ width: '100%', height: '100%' }}
        showNavigator={true}
        showOpenInCodeSandbox={false}
      />
    </div>
  );
};

export default SandPackPreviewClient;
