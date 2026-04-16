import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import Carousel from '../../components/Carousel/Carousel';
import { useAuth } from '../../context/AuthContext';
import AdminEditorModal from '../../components/AdminEditorModal/AdminEditorModal';
import { pricingService } from '../../services/pricingService';
import { JoinPlanButton } from '../../components/UI/ContactButtons';
import './Pricing.css';

const getPlanType = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('monthly')) return 'monthly';
  if (titleLower.includes('quarterly')) return 'quarterly';
  if (titleLower.includes('personal')) return 'personal';
  return 'monthly'; // default
};

/* Single plan card inside the carousel */
const PricingCard = ({ plan }) => {
  return (
    <div className={`pricing-card${plan.isPopular ? ' pricing-card--popular' : ''}`}>
      {plan.isPopular && <div className="plan-popular-badge">Most Popular</div>}

      <div className="plan-card-header">
        <h3>{plan.title}</h3>
        <div className="plan-price-row">
          <span className="plan-price-amount">{plan.price}</span>
          <span className="plan-price-duration">{plan.duration}</span>
        </div>
      </div>

      <ul className="plan-features-list">
        {plan.features?.map((feature, i) => (
          <li key={i}><FaCheck className="plan-feature-icon" /> {feature}</li>
        ))}
      </ul>

      <JoinPlanButton 
        planType={getPlanType(plan.title)}
        planTitle={plan.title}
        className={plan.isPopular ? 'plan-join-button--primary' : 'plan-join-button--outline'}
      />
    </div>
  );
};

/* Plans section + optional admin editor */
const Pricing = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { user, dbUser } = useAuth();
  const groups = user?.signInUserSession?.accessToken?.payload?.["cognito:groups"];
  console.log("Pricing groups:", groups);
  const isAdmin = groups?.includes("admins") || dbUser?.role === 'admin';

  const schema = [
    { key: 'title', label: 'Plan Title', type: 'text', required: true },
    { key: 'price', label: 'Price (e.g. $50)', type: 'text', required: true },
    { key: 'duration', label: 'Duration (e.g. /month)', type: 'text', default: '/month' },
    { key: 'features', label: 'Features', type: 'array' },
    { key: 'isPopular', label: 'Mark as Most Popular', type: 'boolean' },
  ];

  useEffect(() => {
    fetchPrices();
  }, []);
console.log("FETCH START");
 const fetchPrices = async () => {
  try {
    const response = await pricingService.getPlans();

    if (response.ok) {
      const data = await response.json();
      setPricingData(data);
    }
  } catch (err) {
  } finally {
    setLoading(false);
  }
};

  const handleAdminSave = async (payload, id, token) => {
    let res;
    if (id) {
      res = await pricingService.updatePlan(id, payload, token);
    } else {
      res = await pricingService.createPlan(payload, token);
    }

    if (!res.ok) throw new Error('Failed to save plan');
    await fetchPrices();
  };

  const handleAdminDelete = async (id, token) => {
    const res = await pricingService.deletePlan(id, token);
    if (!res.ok) throw new Error('Failed to delete plan');
    await fetchPrices();
  };

  return (
    <section className="pricing-section" id="plans">
      <div className="container">

        <h2 className="pricing-section-title">Choose Your <span>Plan</span></h2>

        {isAdmin && (
          <div className="admin-toolbar">
            <button type="button" onClick={() => setIsEditorOpen(true)} className="btn btn-outline btn-compact">
              Edit
            </button>
          </div>
        )}

        {loading ? (
          <p className="page-hint">Loading plans...</p>
        ) : pricingData.length === 0 ? (
          <p className="page-hint">No plans available right now.</p>
        ) : (
          <Carousel
            items={pricingData}
            renderItem={(plan) => (
              <PricingCard
                key={plan._id || Math.random()}
                plan={plan}
              />
            )}
          />
        )}
      </div>

      <AdminEditorModal
        title="Pricing Plans"
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        items={pricingData}
        schema={schema}
        onSave={handleAdminSave}
        onDelete={handleAdminDelete}
      />
    </section>
  );
};

export default Pricing;
