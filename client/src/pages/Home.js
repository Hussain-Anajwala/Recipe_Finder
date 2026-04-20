import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-tertiary/5 pointer-events-none" />
        <div className="grain-overlay absolute inset-0" />

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="font-technical text-sm text-primary uppercase tracking-widest mb-6">
            Community Recipe Platform
          </p>
          <h1 className="font-headline text-5xl sm:text-7xl text-on-surface mb-6 leading-tight">
            Cook What<br />
            <em className="text-primary not-italic">You Have</em>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Discover recipes based on the ingredients in your kitchen.
            Now with AI-powered ingredient detection, dietary tagging, and intelligent recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/recipes"
              className="px-8 py-3 bg-primary text-on-primary rounded font-medium hover:bg-primary-container transition-colors text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
              Explore Recipes
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="px-8 py-3 border border-primary text-primary rounded font-medium hover:bg-primary/5 transition-colors text-sm"
              >
                Join the Community
              </Link>
            )}
            {user && (
              <Link
                to="/add"
                className="px-8 py-3 border border-primary text-primary rounded font-medium hover:bg-primary/5 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Share a Recipe
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="font-technical text-xs text-primary uppercase tracking-widest mb-3">Powered by Open-Source AI</p>
          <h2 className="font-headline text-3xl text-on-surface mb-3">Smarter Recipe Discovery</h2>
          <p className="text-on-surface-variant text-sm max-w-lg mx-auto">
            Every AI feature is transparent, explainable, and respects your privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: 'photo_camera',
              title: 'Snap Your Fridge',
              desc: 'Upload a photo of your ingredients. YOLOv8 + CLIP detect what you have — with confidence scores always visible.',
              tag: 'Feature 1',
            },
            {
              icon: 'tune',
              title: 'Match Threshold',
              desc: 'Control how strictly recipes must match your ingredients. See exactly why each recipe appears in results.',
              tag: 'Feature 2',
            },
            {
              icon: 'auto_awesome',
              title: 'Smart Recommendations',
              desc: 'Discover similar recipes based on ingredients and flavor profile. Never based on your personal history.',
              tag: 'Feature 3',
            },
            {
              icon: 'sell',
              title: 'Dietary Tags',
              desc: 'AI auto-tags every recipe for vegan, keto, gluten-free and more — only when confidence exceeds 75%.',
              tag: 'Feature 4',
            },
            {
              icon: 'mic',
              title: 'Voice Search',
              desc: 'Say your ingredients aloud. Processed locally via Whisper — audio never leaves your device.',
              tag: 'Feature 5',
            },
            {
              icon: 'shield',
              title: 'Ethics by Design',
              desc: 'Full transparency: model cards, confidence scores, bias disclosures, and user control over every AI output.',
              tag: 'Ethics',
              link: '/ethics',
            },
          ].map(feature => (
            <div
              key={feature.title}
              className="bg-surface-container-low border border-outline-variant rounded-lg p-6 hover:editorial-shadow transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
                    {feature.icon}
                  </span>
                </div>
                <span className="font-technical text-xs text-on-surface-variant mt-2">{feature.tag}</span>
              </div>
              <h3 className="font-headline text-xl text-on-surface mb-2">{feature.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{feature.desc}</p>
              {feature.link && (
                <a href={feature.link} className="inline-flex items-center gap-1 mt-3 text-primary text-xs font-medium hover:underline">
                  Read our ethics statement
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-primary/5 border-t border-outline-variant py-16">
        <div className="grain-overlay absolute inset-0" />
        <div className="relative max-w-xl mx-auto px-6 text-center">
          <h2 className="font-headline text-3xl text-on-surface mb-4">Ready to cook something new?</h2>
          <p className="text-on-surface-variant text-sm mb-8">
            Search by ingredients, filter by diet, or let AI inspire you with smart suggestions.
          </p>
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded font-medium hover:bg-primary-container transition-colors text-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restaurant</span>
            Start Exploring
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
