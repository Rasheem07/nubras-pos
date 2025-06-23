import { useCallback, useState } from 'react'
import { toast } from 'sonner'  // or your favorite notification lib



export function useReportSharer() {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const share = useCallback(async (filters: any) => {
    setIsSharing(true);
    setError(null);

    try {
      const res = await fetch(`https://api.alnubras.co/api/v1/reports/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { id } = await res.json();
      const url = `${window.location.origin}/reports/share?id=${id}`;
      setShareUrl(url);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to share');
    } finally {
      setIsSharing(false);
    }
  }, []);

  return { shareUrl, isSharing, error, share };
}
