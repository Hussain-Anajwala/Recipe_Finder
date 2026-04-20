import React from 'react';
import { Link } from 'react-router-dom';

const EthicsStatement = () => {
  const sections = [
    {
      id: 'overview',
      icon: 'shield',
      title: 'AI Ethics Statement',
      content: (
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Savour uses AI to enhance your cooking experience. We believe AI should be transparent, explainable, and controllable by the people using it.
          This document explains exactly how our AI features work, their limits, and how we protect your privacy.
        </p>
      ),
    },
    {
      id: 'feature1',
      icon: 'photo_camera',
      title: 'Feature 1: Image-Based Ingredient Detection',
      content: (
        <div className="space-y-3 text-sm text-on-surface-variant leading-relaxed">
          <p><strong className="text-on-surface">Model:</strong> YOLOv8n (COCO-trained) + CLIP ViT-B/32</p>
          <p><strong className="text-on-surface">What it does:</strong> Detects food items in your uploaded photo and suggests them as ingredients to search with.</p>
          <p><strong className="text-on-surface">Limitations & Known Bias:</strong> YOLOv8n was trained on the COCO dataset, which includes only ~80 categories.
          Many specific ingredients (spices, sauces, specific cuts) may not be detected. Results may vary by lighting, angle, and packaging.
          CLIP zero-shot classification adds coverage but may misidentify similar-looking items.</p>
          <p><strong className="text-on-surface">What we show you:</strong> Every detected ingredient is shown with its confidence percentage. You can remove any ingredient before searching.</p>
          <p><strong className="text-on-surface">Privacy:</strong> Your image is processed in server memory only. It is never stored on our servers or sent to any third-party service.</p>
          <div className="p-3 bg-tertiary-container/30 border border-tertiary/20 rounded">
            <p className="font-technical text-xs text-on-tertiary-container">
              ⚠️ AI detection may miss or misidentify ingredients. Always review detected items before searching.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'feature2',
      icon: 'tune',
      title: 'Feature 2: ML-Enhanced Match Threshold',
      content: (
        <div className="space-y-3 text-sm text-on-surface-variant leading-relaxed">
          <p><strong className="text-on-surface">How it works:</strong> When you search by ingredient, recipes are ranked by a combined score: ingredient match percentage (how many of your ingredients the recipe uses) plus coverage percentage (what fraction of the recipe's total ingredients you have). You control the minimum match threshold using a slider.</p>
          <p><strong className="text-on-surface">Transparency:</strong> Every recipe card shows its exact match percentage and which ingredients were matched. Hidden recipes are counted and disclosed.</p>
          <p><strong className="text-on-surface">No hidden ranking factors:</strong> Result order is determined solely by ingredient overlap. There is no popularity score, promoted content, or personalization.</p>
        </div>
      ),
    },
    {
      id: 'feature3',
      icon: 'auto_awesome',
      title: 'Feature 3: Content-Based Recommendations',
      content: (
        <div className="space-y-3 text-sm text-on-surface-variant leading-relaxed">
          <p><strong className="text-on-surface">Model:</strong> sentence-transformers/all-MiniLM-L6-v2 + ChromaDB (local vector store)</p>
          <p><strong className="text-on-surface">How it works:</strong> When you view a recipe, we find similar recipes using semantic embeddings of title, category, ingredients, and description. Similarity is computed using cosine distance in 384-dimensional embedding space.</p>
          <p><strong className="text-on-surface">What we do NOT use:</strong> Your personal history, demographic information, search history, click-through rates, or any other behavioral signal. Recommendations are purely content-based.</p>
          <p><strong className="text-on-surface">Diversity:</strong> We enforce that recommendations span at least two different recipe categories to prevent filter bubbles.</p>
          <p><strong className="text-on-surface">Data:</strong> All embeddings are computed from recipe text only and stored locally in our ChromaDB instance.</p>
        </div>
      ),
    },
    {
      id: 'feature4',
      icon: 'sell',
      title: 'Feature 4: Automated Dietary Tagging',
      content: (
        <div className="space-y-3 text-sm text-on-surface-variant leading-relaxed">
          <p><strong className="text-on-surface">Model:</strong> facebook/bart-large-mnli (zero-shot classification) with rule-based fallback</p>
          <p><strong className="text-on-surface">Tags applied:</strong> Vegan, Vegetarian, Gluten-Free, Dairy-Free, Keto, High-Protein, Nut-Free</p>
          <p><strong className="text-on-surface">Confidence threshold:</strong> We only apply a tag when the model confidence exceeds 75%. Borderline classifications are discarded. Confidence is displayed alongside every tag.</p>
          <p><strong className="text-on-surface">Known limitations:</strong> AI cannot evaluate cross-contamination risks, processing methods, or hidden ingredients in pre-packaged foods. Tags are a guide only.</p>
          <p><strong className="text-on-surface">User control:</strong> Any logged-in user can report an incorrect tag using the flag icon on any recipe. Reports are reviewed to improve model accuracy.</p>
          <div className="p-3 bg-error-container/30 border border-error/20 rounded">
            <p className="font-technical text-xs text-on-error-container">
              ⚠️ <strong>Critical:</strong> Do not rely solely on AI dietary tags for serious food allergies or medical dietary requirements. Always verify ingredients manually.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'feature5',
      icon: 'mic',
      title: 'Feature 5: Voice-Activated Search',
      content: (
        <div className="space-y-3 text-sm text-on-surface-variant leading-relaxed">
          <p><strong className="text-on-surface">Model:</strong> openai/whisper-small (local, runs on our server)</p>
          <p><strong className="text-on-surface">How it works:</strong> Your voice is recorded in your browser, sent as an audio file to our server, transcribed by Whisper, and parsed for ingredient names using spaCy. The transcript is shown to you before any search is performed.</p>
          <p><strong className="text-on-surface">Privacy:</strong> Audio is processed in-memory only. The temporary audio file is deleted immediately after transcription. No audio data is stored, logged, or sent to any third-party service.</p>
          <p><strong className="text-on-surface">Limitations:</strong> Accuracy depends on microphone quality, accent, and background noise. Whisper-small may mis-transcribe similar-sounding words.</p>
        </div>
      ),
    },
    {
      id: 'data',
      icon: 'database',
      title: 'Data We Collect & Store',
      content: (
        <div className="space-y-3 text-sm text-on-surface-variant leading-relaxed">
          <ul className="space-y-2">
            {[
              { label: 'Account data', detail: 'Name, email, username, hashed password. Never plaintext.' },
              { label: 'Recipes', detail: 'Title, ingredients, description, category, nutrition, images (URL only).' },
              { label: 'AI detection logs', detail: 'SHA-256 hash of uploaded image (not the image itself), number of ingredients detected, average confidence. Used for bias auditing.' },
              { label: 'Tag reports', detail: 'Which tag was reported as incorrect, user\'s suggested correction. Used to improve the model.' },
              { label: 'What we do NOT store', detail: 'Audio files, full images, search history, click history, browser data.' },
            ].map(item => (
              <li key={item.label} className="flex gap-2">
                <span className="material-symbols-outlined text-secondary mt-0.5 flex-shrink-0" style={{ fontSize: '14px' }}>check</span>
                <span><strong className="text-on-surface">{item.label}:</strong> {item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'openness',
      icon: 'code',
      title: 'Open-Source Commitment',
      content: (
        <div className="space-y-2 text-sm text-on-surface-variant leading-relaxed">
          <p>All AI models used by Savour are open-source and available for public scrutiny:</p>
          <ul className="space-y-1">
            {[
              { name: 'ultralytics/ultralytics (YOLOv8)', url: 'https://github.com/ultralytics/ultralytics' },
              { name: 'openai/CLIP', url: 'https://github.com/openai/CLIP' },
              { name: 'sentence-transformers/all-MiniLM-L6-v2', url: 'https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2' },
              { name: 'facebook/bart-large-mnli', url: 'https://huggingface.co/facebook/bart-large-mnli' },
              { name: 'openai/whisper', url: 'https://github.com/openai/whisper' },
            ].map(m => (
              <li key={m.name} className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-outline" style={{ fontSize: '13px' }}>arrow_right</span>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
          <p>No proprietary AI APIs are used. All inference happens on our server infrastructure.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '36px' }}>shield</span>
            <div>
              <p className="font-technical text-xs text-primary uppercase tracking-widest">Transparency Report</p>
              <h1 className="font-headline text-4xl text-on-surface">AI Ethics Statement</h1>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-xl">
            Savour is built on the principle that AI should be transparent.
            We believe you have the right to know exactly how AI features work, what data they use,
            and what their limitations are.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 mb-8">
          <p className="font-technical text-xs text-on-surface-variant uppercase tracking-wide mb-3">Contents</p>
          <ul className="space-y-1">
            {sections.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-primary hover:underline flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline" style={{ fontSize: '13px' }}>{s.icon}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map(s => (
            <section key={s.id} id={s.id} className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>{s.icon}</span>
                <h2 className="font-headline text-2xl text-on-surface">{s.title}</h2>
              </div>
              {s.content}
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-technical text-xs text-on-surface-variant">
            Last updated: April 2025 · Open-source AI only · No user tracking
          </p>
          <Link to="/recipes" className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
            Back to Recipe Search
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EthicsStatement;
