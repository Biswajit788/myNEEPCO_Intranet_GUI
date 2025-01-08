import { useState, useCallback } from 'react';

const useDownload = (baseUrl: string) => {
  const [error, setError] = useState<string | null>(null);

  const handleDownload = useCallback(
    async (fileUrl?: string, token?: string) => {
      if (!fileUrl) {
        console.error('File URL is not defined');
        setError('File URL is not defined.');
        return;
      }

      const fullUrl = `${baseUrl}${fileUrl}`;

      try {
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch the file', response.statusText);
          setError(`Failed to access file: ${response.statusText}`);
          return;
        }

        // Use the response blob for downloading
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Create an anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileUrl.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error during download request:', error);
        setError('An error occurred while attempting to download the file.');
      }
    },
    [baseUrl]
  );

  return { handleDownload, error };
};

export default useDownload;
