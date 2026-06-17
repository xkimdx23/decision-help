import React, { useEffect } from 'react';

function AdUnit({ slot, format = 'auto', responsive = 'true', style }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div className="ad-container" style={style}>
      <span className="ad-label">Sponsored</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6057388520703385"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

export default AdUnit;
