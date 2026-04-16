import React, { useState, useEffect } from 'react';
import Carousel from '../../components/Carousel/Carousel';
import { useAuth } from '../../context/AuthContext';
import AdminEditorModal from '../../components/AdminEditorModal/AdminEditorModal';
import { transformationService } from '../../services/transformationService';
import { API_BASE_URL } from '../../config/apiConfig';


const resolveImageUrl = (url) => {
  if (!url) return null;

  if (url.startsWith("http")) return url;

  // ensure proper slash
  return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
};
const TransformationCard = ({ item }) => {
  console.log("=== CRITICAL IMAGE DEBUG ===");
  console.log("Item _id:", item._id);
  console.log("Item name:", item.name);
  console.log("Raw beforeImage:", item.beforeImage);
  console.log("Raw afterImage:", item.afterImage);
  console.log("beforeImage === afterImage:", item.beforeImage === item.afterImage);
  
  // CRITICAL: Check if all items have same image reference
  const resolvedBefore = resolveImageUrl(item.beforeImage);
  const resolvedAfter = resolveImageUrl(item.afterImage);
  
  console.log("=== URL RESOLUTION DEBUG ===");
  console.log("Resolved before URL:", resolvedBefore);
  console.log("Resolved after URL:", resolvedAfter);
  console.log("API_BASE_URL:", API_BASE_URL);
  
  // COMPLETELY REMOVE FALLBACK TO ISOLATE DATA ISSUE
  const finalBeforeSrc = resolvedBefore;
  const finalAfterSrc = resolvedAfter;
  
  console.log("=== FINAL RENDER DEBUG ===");
  console.log("Final before src:", finalBeforeSrc);
  console.log("Final after src:", finalAfterSrc);
  console.log("Before src null/undefined:", finalBeforeSrc == null);
  console.log("After src null/undefined:", finalAfterSrc == null);

  return (
    <div className="trans-card">
      <div className="transImageSplit">
        <div className="transImgWrapper">
          <span className="transBadgeDark">Before</span>
          <img
            src={finalBeforeSrc}
            alt={`${item.name} Before`}
            loading="lazy"
            onError={(e) => { 
              console.error("=== BEFORE IMAGE FAILED TO LOAD ===");
              console.error("Failed src:", finalBeforeSrc);
              console.error("Raw beforeImage:", item.beforeImage);
              console.error("Item:", item.name);
              console.error("API_BASE_URL:", API_BASE_URL);
              console.error("Network status:", e.target.naturalWidth === 0 ? 'FAILED' : 'LOADED');
              // TEMPORARILY REMOVE FALLBACK TO ISOLATE ISSUE
              // e.target.src = fallbackBefore; 
            }}
            onLoad={() => {
              console.log("=== BEFORE IMAGE LOADED SUCCESSFULLY ===");
              console.log("Loaded src:", finalBeforeSrc);
              console.log("Item:", item.name);
            }}
          />
        </div>
        <div className="transImgWrapper">
          <span className="transBadgeRed">After</span>
          <img
            src={finalAfterSrc}
            alt={`${item.name} After`}
            loading="lazy"
            onError={(e) => { 
              console.error("=== AFTER IMAGE FAILED TO LOAD ===");
              console.error("Failed src:", finalAfterSrc);
              console.error("Raw afterImage:", item.afterImage);
              console.error("Item:", item.name);
              console.error("API_BASE_URL:", API_BASE_URL);
              console.error("Network status:", e.target.naturalWidth === 0 ? 'FAILED' : 'LOADED');
              // TEMPORARILY REMOVE FALLBACK TO ISOLATE ISSUE
              // e.target.src = fallbackAfter; 
            }}
            onLoad={() => {
              console.log("=== AFTER IMAGE LOADED SUCCESSFULLY ===");
              console.log("Loaded src:", finalAfterSrc);
              console.log("Item:", item.name);
            }}
          />
        </div>
      </div>

      <div className="transCardContent">
        <h3 className="transName">{item.name}</h3>
        <p className="transQuote">&quot;{item.story}&quot;</p>
      </div>
    </div>
  );
};

const Transformations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const { user, dbUser } = useAuth();

  const groups = user?.signInUserSession?.accessToken?.payload?.["cognito:groups"];
  const token = user?.signInUserSession?.accessToken?.jwtToken;

  console.log("TOKEN:", token);
  console.log("Transformations groups:", groups);

  const isAdmin = groups?.includes("admins") || dbUser?.role === 'admin';

  const schema = [
    { key: 'name', label: 'Member Name', type: 'text', required: true },
    { key: 'story', label: 'Transformation Story', type: 'textarea', required: true },
    { key: 'beforeImage', label: 'Before Image', type: 'image', required: true },
    { key: 'afterImage', label: 'After Image', type: 'image', required: false },
  ];

  useEffect(() => {
    fetchTransformations();
  }, []);

  const fetchTransformations = async () => {
    try {
      console.log("=== FETCH TRANSFORMATIONS DEBUG ===");
      const response = await transformationService.getTransformations();
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      if (response.ok) {
        const transData = await response.json();
        console.log("=== FULL API RESPONSE ===");
        console.log("Raw API response:", transData);
        console.log("Response type:", typeof transData);
        console.log("Is array:", Array.isArray(transData));
        
        // CRITICAL: Check if all items have same image URLs
        if (Array.isArray(transData)) {
          console.log("=== FULL RESPONSE ANALYSIS ===");
          transData.forEach((item, index) => {
            console.log(`ITEM ${index}:`, {
              id: item._id,
              name: item.name,
              beforeImage: item.beforeImage,
              afterImage: item.afterImage
            });
          });
          
          // Check for duplicates
          const beforeImageUrls = transData.map(item => item.beforeImage);
          const afterImageUrls = transData.map(item => item.afterImage);
          
          const uniqueBeforeUrls = [...new Set(beforeImageUrls)];
          const uniqueAfterUrls = [...new Set(afterImageUrls)];
          
          console.log("=== DUPLICATE ANALYSIS ===");
          console.log("All before URLs:", beforeImageUrls);
          console.log("Unique before URLs:", uniqueBeforeUrls);
          console.log("All after URLs:", afterImageUrls);
          console.log("Unique after URLs:", uniqueAfterUrls);
          
          // CRITICAL: Answer the key question
          if (uniqueBeforeUrls.length === 1 && beforeImageUrls.length > 1) {
            console.error(" BACKEND ISSUE: All items have SAME beforeImage URL!");
            console.error(" This means backend is overwriting files or storing same path");
          }
          
          if (uniqueAfterUrls.length === 1 && afterImageUrls.length > 1) {
            console.error(" BACKEND ISSUE: All items have SAME afterImage URL!");
            console.error(" This means backend is overwriting files or storing same path");
          }
          
          if (uniqueBeforeUrls.length > 1) {
            console.log(" BACKEND OK: beforeImage URLs are different");
            console.log(" If UI still shows same images, problem is FRONTEND");
          }
          
          if (uniqueAfterUrls.length > 1) {
            console.log(" BACKEND OK: afterImage URLs are different");
            console.log(" If UI still shows same images, problem is FRONTEND");
          }
          
          console.log("=== END ANALYSIS ===");
        }

        // IMPORTANT FIX
        const finalData = Array.isArray(transData) ? transData : transData.data || [];
        console.log("Final data to set:", finalData);
        setData(finalData);
      } else {
        console.log("Response not OK:", response.status, response.statusText);
      }
    } catch (err) {
      console.error("Fetch transformations error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSave = async (payload, id) => {
    if (!token) {
      throw new Error("No token found. Login again.");
    }

    let res;

    if (id) {
      res = await transformationService.updateTransformation(id, payload, token);
    } else {
      res = await transformationService.createTransformation(payload, token);
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save transformation');
    }

    await fetchTransformations();
  };

  const handleAdminDelete = async (id) => {
    if (!token) {
      throw new Error("No token found. Login again.");
    }

    const res = await transformationService.deleteTransformation(id, token);

    if (!res.ok) {
      throw new Error('Failed to delete transformation');
    }

    await fetchTransformations();
  };

  return (
    <section className="transformationsSection" id="transformations">
      <div className="container">

        <div className="admin-toolbar admin-toolbar--flush">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="btn btn-outline btn-compact"
            >
              Edit
            </button>
          )}
        </div>

        <h2 className="transSectionTitle">
          REAL RESULTS FROM <span className="textRed">REAL MEMBERS</span>
        </h2>

        {loading ? (
          <p className="page-hint">Loading transformations...</p>
        ) : data.length === 0 ? (
          <p className="page-hint">No transformations available right now.</p>
        ) : (
          <Carousel 
             items={data}
             renderItem={(item) => (
               <div style={{ padding: '0 15px' }}>
                 <TransformationCard key={item._id || item.name} item={item} />
               </div>
             )}
             dots={true}
             loop={true}
             autoplay={true}
          />
        )}
      </div>

      <AdminEditorModal
        title="Transformations"
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        items={data}
        schema={schema}
        onSave={handleAdminSave}
        onDelete={handleAdminDelete}
      />
    </section>
  );
};

export default Transformations;