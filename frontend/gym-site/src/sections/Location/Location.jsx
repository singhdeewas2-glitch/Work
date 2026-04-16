import React from 'react';
import { WhatsAppButton, CallButton } from '../../components/UI/ContactButtons';
import { useConfig } from '../../context/ConfigContext';
import './Location.css';

const getEmbedUrl = (input) => {
  if (!input) return null;
  const trimmed = input.trim();

  // 1. If user pastes an iframe, extract the src
  const iframeMatch = trimmed.match(/<iframe.*?src=["'](.*?)["']/);
  if (iframeMatch) return iframeMatch[1];

  // 2. Already an embed URL
  if (trimmed.includes('maps/embed') || trimmed.includes('output=embed')) {
    return trimmed;
  }
  
  // 3. Extract precise CID (Place ID) from complex Google Maps URLs
  // The !1s sequence holds perfectly isolated entity identities
  const dataCidMatch = trimmed.match(/!1s(?:0x[0-9a-f]+:)?(0x[0-9a-f]+)/i);
  if (dataCidMatch) {
     try {
       // Convert hexadecimal Google Place CID to strict Decimal format for the embed payload!
       const cid = BigInt(dataCidMatch[1]).toString();
       return `https://maps.google.com/maps?cid=${cid}&z=15&output=embed`;
     } catch (e) {
       console.error("CID conversion failed", e);
     }
  }

  // 4. Extract Place Name from long Google Maps URLs
  const placeMatch = trimmed.match(/\/maps\/(?:place|search|dir)\/([^/@?]+)/);
  if (placeMatch) {
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`;
  }

  // 5. Coordinates explicitly via @lat,lng in a long URL
  const coordMatch = trimmed.match(/@([-\d.]+),([-\d.]+)/);
  if (coordMatch && trimmed.startsWith('http')) {
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=15&output=embed`;
  }

  // 6. Final fallback: Shortlinks, custom Google links, or raw Address search texts
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&z=15&output=embed`;
};

/* Address, hours, map embed */
const Location = () => {
  const { config } = useConfig();
  const address = config?.address || '';
  const mapLink = config?.mapsLink || '';
  const embedUrl = getEmbedUrl(mapLink);

  return (
    <section className="location-block" id="contact">
      <div className="container">
        <h2 className="section-title">Visit or <span>Contact Us</span></h2>
        <p className="location-intro">We&apos;re here to help you start your fitness journey.</p>

        <div className="location-card">
          <div className="location-card-body">
            <div className="location-cta-row">
              <WhatsAppButton message="Hello, I want to visit your gym. Please share details." />
              <CallButton children="Call Us Now" />
            </div>

            <div className="location-details">
              <div className="location-detail-block">
                <h4>Address</h4>
                <p>{address}</p>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-maps-link"
                >
                  Open in Google Maps
                </a>
              </div>
              <div className="location-detail-block">
                <h4>Business Hours</h4>
                <p>Mon - Sat: 6:00 AM - 10:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="location-map-frame">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Gym Location Maps"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
