import { useState, useEffect } from "react";

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // This is the intentional pattern for hydration detection.
    // We need setState in useEffect to detect when client-side hydration completes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  return hydrated;
}
