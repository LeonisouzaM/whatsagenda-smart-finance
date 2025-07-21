import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function PixelTracker() {
  useEffect(() => {
    const loadTrackingPixels = async () => {
      try {
        const { data: settings, error } = await supabase
          .from('settings')
          .select('name, value')
          .in('name', ['facebook_pixel', 'google_analytics', 'tiktok_pixel']);

        if (error) {
          console.error('Error loading tracking pixels:', error);
          return;
        }

        // Inject pixels into the page
        settings?.forEach(setting => {
          if (setting.value && setting.value.trim()) {
            injectScript(setting.name, setting.value);
          }
        });
      } catch (error) {
        console.error('Error loading tracking pixels:', error);
      }
    };

    loadTrackingPixels();
  }, []);

  const injectScript = (name: string, code: string) => {
    // Remove existing script if any
    const existingScript = document.getElementById(name);
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject new script
    const script = document.createElement('script');
    script.id = name;
    
    if (name === 'google_analytics' && code.includes('gtag')) {
      // For Google Analytics, we need to handle both the script tag and the gtag config
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'text/html');
      const scriptTags = doc.querySelectorAll('script');
      
      scriptTags.forEach((scriptTag, index) => {
        const newScript = document.createElement('script');
        newScript.id = `${name}_${index}`;
        
        if (scriptTag.src) {
          newScript.src = scriptTag.src;
          newScript.async = true;
        } else {
          newScript.innerHTML = scriptTag.innerHTML;
        }
        
        document.head.appendChild(newScript);
      });
    } else if (code.trim().startsWith('<script') && code.trim().endsWith('</script>')) {
      // Extract content from script tags
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'text/html');
      const scriptTag = doc.querySelector('script');
      
      if (scriptTag?.src) {
        script.src = scriptTag.src;
        script.async = true;
      } else if (scriptTag?.innerHTML) {
        script.innerHTML = scriptTag.innerHTML;
      }
      
      document.head.appendChild(script);
    } else {
      // Direct script content
      script.innerHTML = code;
      document.head.appendChild(script);
    }
  };

  return null; // This component doesn't render anything
}