import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import API from '../config/api';
import { toast } from '../utils/toast';
import LoadingSpinner from './LoadingSpinner';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import { useAuth } from '../context/AuthContext';

// ── Dietary Tag Config ─────────────────────────────────────────
const DIETARY_TAGS = [
  { key: 'vegan', label: 'Vegan', icon: 'eco' },
  { key: 'vegetarian', label: 'Vegetarian', icon: 'grass' },
  { key: 'gluten-free', label: 'Gluten-Free', icon: 'grain' },
  { key: 'dairy-free', label: 'Dairy-Free', icon: 'no_drinks' },
  { key: 'keto', label: 'Keto', icon: 'monitor_weight' },
  { key: 'high-protein', label: 'High-Protein', icon: 'fitness_center' },
  { key: 'nut-free', label: 'Nut-Free', icon: 'block' },
];

// ── Ingredient-keyword fallback for dietary detection ──────────
// Threshold-based: requires MULTIPLE signals to avoid false positives
const MEAT_KEYWORDS   = ['chicken','beef','pork','lamb','turkey','duck','fish','salmon','tuna','shrimp','prawn','bacon','sausage','ham','meat','seafood','anchovy','anchovies','pepperoni','lard','mutton','venison','crab','lobster','clam','oyster','mussels','scallop'];
const DAIRY_KEYWORDS  = ['milk','cheese','butter','cream','yogurt','yoghurt','ghee','paneer','cheddar','mozzarella','parmesan','brie','ricotta','whey','lactose','dairy'];
const GLUTEN_KEYWORDS = ['flour','wheat','bread','pasta','noodle','barley','rye','semolina','couscous','breadcrumb','croissant','baguette','tortilla','crouton','pita','bagel','pretzel'];
const NUT_KEYWORDS    = ['almond','cashew','walnut','pecan','pistachio','hazelnut','peanut','macadamia','pine nut','chestnut'];
// High-protein requires DENSE protein sources (not just an egg in a dessert)
const HIGH_PROTEIN_PRIMARY   = ['chicken breast','chicken thigh','ground beef','beef','steak','pork tenderloin','salmon fillet','tuna','turkey breast','tofu','tempeh','edamame','lentil','chickpea','black bean','kidney bean','cottage cheese','greek yogurt','protein powder','whey protein','seitan'];
const HIGH_PROTEIN_SECONDARY = ['egg','chicken','beef','pork','shrimp','fish','salmon','tuna','turkey','ham','bacon','legume','bean','quinoa'];
const KETO_BLOCKERS   = ['sugar','bread','rice','pasta','potato','corn','flour','oat','banana','honey','maple syrup','agave','cereal','tortilla','noodle','couscous','sweet potato','cassava','tapioca'];

function countKeywords(text, keywords) {
  return keywords.reduce((count, kw) => count + (text.includes(kw) ? 1 : 0), 0);
}

function recipeMatchesDietaryFilter(recipe, activeTag) {
  const aiTags = (recipe.dietaryTags || []).map(t => t.toLowerCase());
  // Always trust the AI tagger if it ran
  if (aiTags.includes(activeTag.toLowerCase())) return true;

  const ings = (recipe.ingredients || []).join(' ').toLowerCase();
  const nutrition = recipe.nutrition || {};

  switch (activeTag.toLowerCase()) {
    case 'vegetarian':
      // Must have zero meat ingredients
      return !MEAT_KEYWORDS.some(k => ings.includes(k));

    case 'vegan':
      // Must have zero meat AND zero dairy
      return !MEAT_KEYWORDS.some(k => ings.includes(k)) &&
             !DAIRY_KEYWORDS.some(k => ings.includes(k));

    case 'gluten-free':
      // Must have zero gluten ingredients
      return !GLUTEN_KEYWORDS.some(k => ings.includes(k));

    case 'dairy-free':
      return !DAIRY_KEYWORDS.some(k => ings.includes(k));

    case 'nut-free':
      return !NUT_KEYWORDS.some(k => ings.includes(k));

    case 'high-protein': {
      // Tier 1: trust stored nutrition — must be ≥15g protein per serving
      if (nutrition.protein && nutrition.protein >= 15) return true;
      // Tier 2: must match ≥1 PRIMARY dense-protein source
      if (countKeywords(ings, HIGH_PROTEIN_PRIMARY) >= 1) return true;
      // Tier 3: ≥2 secondary protein sources (e.g. egg + chicken counts, but 1 egg alone does NOT)
      if (countKeywords(ings, HIGH_PROTEIN_SECONDARY) >= 2) return true;
      return false;
    }

    case 'keto': {
      // Must NOT contain keto-blocking carbs
      // Allow 1 blocker (some recipes say "a pinch of sugar") but block on ≥2
      const blockerCount = countKeywords(ings, KETO_BLOCKERS);
      return blockerCount === 0;
    }

    default:
      return false;
  }
}

// ── Tag Report Modal ───────────────────────────────────────────
const TagReportModal = ({ recipeId, tag, onClose, onSuccess }) => {
  const [correction, setCorrection] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await API.post(`/api/recipes/${recipeId}/report-tag`, {
        reportedTag: tag,
        suggestedCorrection: correction,
      });
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/60 px-4">
      <div className="bg-surface-container-lowest p-8 max-w-sm w-full editorial-shadow border border-outline-variant/20">
        <h3 className="font-headline text-2xl text-on-surface mb-2 italic">Report Tag</h3>
        <p className="text-sm text-on-surface-variant font-body mb-6">
          Reporting: <strong className="text-primary">"{tag}"</strong>
        </p>
        <label className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3">
          Suggested correction (optional)
        </label>
        <input
          type="text"
          value={correction}
          onChange={e => setCorrection(e.target.value)}
          placeholder="e.g. This is not vegan due to honey"
          className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-body text-sm placeholder:text-surface-variant mb-6"
        />
        <div className="flex gap-4 justify-end">
          <button onClick={onClose} className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-primary text-on-primary font-label text-xs uppercase tracking-widest font-bold px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Recommendation Row ─────────────────────────────────────────
const RecommendationRow = ({ recipeId, recipeTitle, recipeIngredients, onSelectRecipe }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipeId) return;
    let mounted = true;
    setSimilar([]);
    setLoading(true);

    API.post('/api/ai/recommend', {
      recipe_id: recipeId,
      title: recipeTitle,
      ingredients: recipeIngredients,
      limit: 3,
    })
      .then(res => {
        if (!mounted) return;
        // FastAPI returns { similar: [...] } — normalise both shapes
        const recs = res.data?.similar || res.data?.recommendations || res.data || [];
        setSimilar(Array.isArray(recs) ? recs : []);
        setLoading(false);
      })
      .catch(err => {
        if (!mounted) return;
        setLoading(false);
        // Silent fail for 503 (AI service down) — hide section entirely
        if (err.response?.status !== 503) {
          console.error('[RecommendationRow] error:', err.response?.data);
        }
        setSimilar([]);
      });

    return () => { mounted = false; };
  }, [recipeId]); // recipeId is a string — stable primitive dep, no infinite loop

  if (!loading && similar.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-outline-variant/20">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>auto_awesome</span>
        <h4 className="font-headline text-xl text-on-surface italic">You Might Also Enjoy</h4>
      </div>
      <p className="font-technical text-xs text-on-surface-variant mb-4">
        Suggestions based on ingredient and flavor similarity — not your personal history or demographic data.
      </p>
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 p-3 bg-surface-container-low border border-outline/10 animate-pulse">
              <div className="w-16 h-16 bg-surface-container rounded-sm flex-shrink-0" />
              <div className="flex-1 py-1">
                <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
                <div className="h-3 bg-surface-container rounded w-1/2" />
              </div>
            </div>
          ))
        ) : (
          similar.map(rec => (
            <div
              key={rec.recipe_id}
              onClick={() => onSelectRecipe(rec.recipe_id)}
              className="flex gap-4 p-3 bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline/10 group"
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onSelectRecipe(rec.recipe_id)}
            >
              <div className="w-16 h-16 bg-surface-container flex items-center justify-center flex-shrink-0 rounded-sm overflow-hidden">
                <span className="material-symbols-outlined text-outline" style={{ fontSize: '24px' }}>restaurant</span>
              </div>
              <div>
                <p className="font-headline text-lg text-on-surface leading-tight group-hover:text-primary transition-colors">{rec.title}</p>
                <p className="font-technical text-xs text-on-surface-variant uppercase tracking-wider mt-1">
                  {rec.category && `${rec.category} · `}{Math.round((rec.similarity_score || 0) * 100)}% similar
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────
function RecipeList() {
  const { user } = useAuth();

  // Pagination
  const RECIPES_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  // Core state
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Original search state
  const [searchIngredients, setSearchIngredients] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Feature 2: Match threshold
  const [threshold, setThreshold] = useState(30);
  const [hiddenCount, setHiddenCount] = useState(0);
  const thresholdDebounceRef = useRef(null);

  // Feature 1: Image detection
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [detectingImage, setDetectingImage] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [detectedScores, setDetectedScores] = useState({});
  const fileInputRef = useRef(null);

  // Feature 4: Dietary filters
  const [activeDietaryTags, setActiveDietaryTags] = useState([]);

  // Feature 5: Voice search
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [processingVoice, setProcessingVoice] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Tag report
  const [reportModal, setReportModal] = useState(null);

  // ── Load recipes ───────────────────────────────────────────
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await API.get('/api/recipes');
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      toast.error('Failed to load recipes. Please try again later.');
      setLoading(false);
    }
  };

  // ── Original ingredient search ─────────────────────────────
  const handleSearch = useCallback(async (e, customIngredients, customThreshold) => {
    if (e) e.preventDefault();
    const ingredientsToSearch = customIngredients !== undefined ? customIngredients : searchIngredients;
    const thresholdToUse = customThreshold !== undefined ? customThreshold : threshold;

    if (!ingredientsToSearch.trim()) {
      clearSearch();
      return;
    }
    setIsSearching(true);
    try {
      const response = await API.get(`/api/recipes/search`, {
        params: { ingredients: ingredientsToSearch, threshold: thresholdToUse }
      });
      setSearchResults(response.data);
      setHiddenCount(response.data.hiddenByThreshold || 0);
      setIsSearching(false);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
      setIsSearching(false);
    }
  }, [searchIngredients, threshold]);

  const clearSearch = () => {
    setSearchIngredients('');
    setSearchResults(null);
    setHiddenCount(0);
    setDetectedIngredients([]);
    setDetectedScores({});
    setImageFile(null);
    setImagePreview('');
    setVoiceTranscript('');
  };

  // ── Feature 2: Threshold slider ───────────────────────────
  const handleThresholdChange = (val) => {
    setThreshold(val);
    if (thresholdDebounceRef.current) clearTimeout(thresholdDebounceRef.current);
    thresholdDebounceRef.current = setTimeout(() => {
      if (searchIngredients.trim()) {
        handleSearch(null, searchIngredients, val);
      }
    }, 300);
  };

  // ── Feature 1: Image detection ────────────────────────────
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setDetectedIngredients([]);
    setDetectedScores({});
  };

  const handleDetectIngredients = async () => {
    if (!imageFile) return;
    if (!user) { toast.error('Please sign in to use image detection.'); return; }
    setDetectingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const { data } = await API.post('/api/ai/detect-ingredients', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const detected = data.ingredients || [];
      const scores = data.confidence_scores || {};
      setDetectedIngredients(detected);
      setDetectedScores(scores);
      const combined = detected.join(', ');
      setSearchIngredients(combined);
      if (combined) handleSearch(null, combined, threshold);
    } catch (err) {
      if (err.response?.status === 503 || err.response?.data?.code === 'AI_SERVICE_DOWN') {
        toast.error('AI service not running. Start it with: uvicorn main:app --port 8000');
      } else if (err.response?.status === 500) {
        toast.error('Image detection failed. Try typing your ingredients instead.');
      } else {
        toast.error(err.response?.data?.error || 'Image detection failed.');
      }
    } finally {
      setDetectingImage(false);
    }
  };

  // ── Feature 5: Voice search ────────────────────────────────
  // Tries browser SpeechRecognition first (no AI service needed),
  // falls back to Whisper API only if browser SR is unavailable.
  const startVoiceSearch = () => {
    if (!user) { toast.error('Please sign in to use voice search.'); return; }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      // ── Browser-native path (Chrome/Edge, no network request) ──
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setRecording(true);
      setVoiceTranscript('');

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceTranscript(transcript);
        setSearchIngredients(transcript);
        setRecording(false);
        handleSearch(null, transcript, threshold);
      };

      recognition.onerror = (event) => {
        setRecording(false);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Allow mic access in browser settings.');
        } else {
          toast.error('Voice recognition error: ' + event.error);
        }
      };

      recognition.onend = () => setRecording(false);
      recognition.start();
      return; // Done — do NOT call Whisper
    }

    // ── Whisper fallback (Firefox or when SR unavailable) ──────
    startWhisperRecording();
  };

  const startWhisperRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceWithWhisper(audioBlob);
      };
      mr.start();
      setRecording(true);
      setRecordingSeconds(0);
      setVoiceTranscript('');
      let sec = 0;
      recordingTimerRef.current = setInterval(() => {
        sec++;
        setRecordingSeconds(sec);
        if (sec >= 10) stopRecording();
      }, 1000);
    } catch {
      toast.error('Microphone access denied. Please allow microphone access in your browser.');
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    setRecordingSeconds(0);
  };

  const processVoiceWithWhisper = async (audioBlob) => {
    setProcessingVoice(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      const { data } = await API.post('/api/ai/voice-to-ingredients', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVoiceTranscript(data.transcript || '');
      const extracted = data.ingredients || [];
      if (extracted.length > 0) {
        const combined = extracted.join(', ');
        setSearchIngredients(combined);
        handleSearch(null, combined, threshold);
      } else {
        toast.error("Couldn't extract ingredients from audio. Try speaking clearly or type instead.");
      }
    } catch (err) {
      if (err.response?.status === 503 || err.response?.data?.code === 'AI_SERVICE_DOWN') {
        toast.error('AI service not running. Start it with: uvicorn main:app --port 8000');
      } else if (err.response?.status === 500) {
        toast.error('Voice transcription failed. Try typing your ingredients instead.');
      } else {
        toast.error('Voice processing failed.');
      }
    } finally {
      setProcessingVoice(false);
    }
  };

  // ── Display logic (original + dietary filter + pagination) ───
  const displayRecipes = useMemo(() => {
    let filtered = searchResults ? searchResults.recipes || [] : recipes;
    if (selectedCategory !== 'All') filtered = filtered.filter(r => r.category === selectedCategory);
    if (selectedDifficulty !== 'All') filtered = filtered.filter(r => r.difficulty === selectedDifficulty);
    if (activeDietaryTags.length > 0) {
      filtered = filtered.filter(r =>
        activeDietaryTags.every(tag => recipeMatchesDietaryFilter(r, tag))
      );
    }
    return filtered;
  }, [recipes, searchResults, selectedCategory, selectedDifficulty, activeDietaryTags]);

  // Reset to page 1 whenever the filtered set changes
  useEffect(() => {
    setCurrentPage(1);
  }, [displayRecipes]);

  const totalPages = Math.max(1, Math.ceil(displayRecipes.length / RECIPES_PER_PAGE));
  const paginatedRecipes = displayRecipes.slice(
    (currentPage - 1) * RECIPES_PER_PAGE,
    currentPage * RECIPES_PER_PAGE
  );

  // ── Keyboard dismiss ────────────────────────────────────────
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') setSelectedRecipe(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <main className="min-h-screen bg-surface">
      <div className="fixed inset-0 grain-overlay pointer-events-none z-0"></div>

      {/* ── Search Header ────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-2xl">
            <h1 className="font-headline tracking-tight text-5xl md:text-6xl text-on-surface mb-4">The Recipe Collection</h1>
            <p className="font-body text-xl text-on-surface-variant leading-relaxed">
              A curated anthology of sensory experiences, from rustic hearth-baked breads to refined seasonal delicacies.
            </p>
          </div>

          {/* Search bar + AI inputs */}
          <div className="w-full md:w-[460px] space-y-3">
            {/* Main search form */}
            <form onSubmit={handleSearch} className="relative w-full bg-surface-container-lowest rounded-full editorial-shadow px-6 py-4 border border-outline/10 flex flex-row items-center gap-2 transition-all hover:border-primary/30 group">
              <input
                type="text"
                placeholder="What's in your kitchen today?"
                value={searchIngredients}
                onChange={e => setSearchIngredients(e.target.value)}
                className="flex-1 bg-transparent font-body text-sm outline-none text-on-surface placeholder:text-outline-variant italic focus:not-italic"
              />
              {isSearching ? (
                <span className="material-symbols-outlined animate-spin text-primary ml-1">autorenew</span>
              ) : (
                <button type="submit" className="flex items-center">
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors hover:scale-110">search</span>
                </button>
              )}
            </form>

            {/* AI Input Row: Image + Voice */}
            <div className="flex items-center gap-3 px-2">
              {/* Feature 1: Image upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Upload a photo to detect ingredients"
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant/50 bg-surface-container-lowest font-label text-xs uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>photo_camera</span>
                Scan Pantry
              </button>
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageSelect} className="hidden" />

              {/* Feature 5: Voice search */}
              <button
                onClick={recording ? stopRecording : startVoiceSearch}
                disabled={processingVoice}
                title={recording ? 'Stop recording' : 'Search by voice'}
                className={`flex items-center gap-2 px-4 py-2 border font-label text-xs uppercase tracking-widest transition-colors ${
                  recording
                    ? 'bg-error border-error text-on-error animate-pulse'
                    : processingVoice
                    ? 'border-outline-variant bg-surface-container text-on-surface-variant opacity-50'
                    : 'border-outline-variant/50 bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  {recording ? 'stop_circle' : processingVoice ? 'hourglass_empty' : 'mic'}
                </span>
                {recording ? `${10 - recordingSeconds}s` : 'Voice'}
              </button>

              {searchResults && (
                <button onClick={clearSearch} className="ml-auto text-xs font-label tracking-widest text-outline uppercase hover:text-error transition-colors">
                  Clear
                </button>
              )}
            </div>

            {/* Voice recording indicator */}
            {recording && (
              <div className="flex items-center gap-2 px-4 py-2 bg-error/10 border border-error/20 font-technical text-xs text-error">
                <span className="inline-block w-2 h-2 bg-error rounded-full animate-pulse" />
                Recording… {10 - recordingSeconds}s remaining. Speak your ingredients clearly.
              </div>
            )}

            {/* Voice transcript */}
            {voiceTranscript && (
              <div className="px-4 py-3 bg-surface-container border border-outline-variant/20 font-technical text-xs">
                <span className="text-on-surface-variant uppercase tracking-widest block mb-1">I heard:</span>
                <span className="text-on-surface">"{voiceTranscript}"</span>
                <span className="text-on-surface-variant block mt-1">Voice data processed locally — never stored externally.</span>
              </div>
            )}

            {/* Image detection panel */}
            {imagePreview && (
              <div className="px-4 py-3 bg-surface-container border border-outline-variant/20">
                <div className="flex gap-3 items-start">
                  <img src={imagePreview} alt="Uploaded for detection" className="w-16 h-16 object-cover" />
                  <div className="flex-1">
                    <p className="font-label text-[10px] tracking-[0.15em] uppercase text-outline mb-2">AI Ingredient Detection</p>
                    <button
                      onClick={handleDetectIngredients}
                      disabled={detectingImage}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {detectingImage ? (
                        <><span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>Analysing…</>
                      ) : (
                        <><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>search</span>Detect Ingredients</>
                      )}
                    </button>
                    <p className="font-technical text-xs text-on-surface-variant mt-2">
                      AI detection may miss or misidentify items. Please review before searching.
                    </p>
                  </div>
                  <button onClick={() => { setImageFile(null); setImagePreview(''); setDetectedIngredients([]); setDetectedScores({}); }} className="text-on-surface-variant hover:text-on-surface">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                </div>

                {/* Detected ingredient chips with confidence */}
                {detectedIngredients.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-outline-variant/20">
                    <p className="font-technical text-xs text-on-surface-variant mb-2 uppercase tracking-wider">
                      Detected ingredients (confidence shown):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {detectedIngredients.map(ing => {
                        const conf = detectedScores[ing];
                        const confPct = conf ? Math.round(conf * 100) : 0;
                        return (
                          <span key={ing} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary font-technical text-xs">
                            {ing}
                            <span className="opacity-60">{confPct}%</span>
                            <button onClick={() => {
                              setDetectedIngredients(prev => prev.filter(i => i !== ing));
                              const remaining = detectedIngredients.filter(i => i !== ing).join(', ');
                              setSearchIngredients(remaining);
                            }} className="hover:text-error transition-colors">
                              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>close</span>
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Search results count */}
            {searchResults && (
              <div className="flex items-center justify-between px-2 text-xs font-technical text-on-surface-variant">
                <span>{searchResults.totalResults || displayRecipes.length} found.</span>
                {hiddenCount > 0 && (
                  <span className="text-outline">{hiddenCount} hidden by threshold</span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <section className="bg-surface-container-low border-y border-outline/10 px-6 lg:px-12 py-5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Original category/difficulty filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-8 overflow-x-auto w-full md:w-auto no-scrollbar mask-edges-x">
              <div className="flex items-center gap-2 group cursor-pointer relative">
                <span className="font-technical font-bold text-[10px] tracking-[0.2em] uppercase text-on-surface-variant group-hover:text-primary transition-colors">Category</span>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:text-primary">expand_more</span>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full">
                  <option value="All">All Categories</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div className="flex items-center gap-2 group cursor-pointer relative">
                <span className="font-technical font-bold text-[10px] tracking-[0.2em] uppercase text-on-surface-variant group-hover:text-primary transition-colors">Difficulty</span>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">expand_more</span>
                <select value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full">
                  <option value="All">All Levels</option>
                  <option value="Easy">Beginner</option>
                  <option value="Medium">Intermediate</option>
                  <option value="Hard">Advanced</option>
                </select>
              </div>

              {/* Feature 4: Dietary tag chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {DIETARY_TAGS.map(tag => {
                  const active = activeDietaryTags.includes(tag.key);
                  return (
                    <button
                      key={tag.key}
                      onClick={() => setActiveDietaryTags(prev =>
                        active ? prev.filter(t => t !== tag.key) : [...prev, tag.key]
                      )}
                      className={`inline-flex items-center gap-1 px-3 py-1 font-technical text-[10px] uppercase tracking-widest transition-colors border ${
                        active ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{tag.icon}</span>
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="font-technical font-bold text-[10px] tracking-[0.2em] uppercase text-on-surface-variant hidden md:block">
              SHOWING {paginatedRecipes.length} OF {displayRecipes.length} GASTRONOMIC ENTRIES
            </div>
          </div>

          {/* Ethics disclaimer when dietary filter active */}
          {activeDietaryTags.length > 0 && (
            <p className="font-technical text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>info</span>
              Dietary tags are AI-generated (≥75% confidence). Always verify ingredients for serious dietary requirements or allergies.
            </p>
          )}

          {/* Feature 2: Threshold slider — shown only after search */}
          {searchResults !== null && (
            <div className="flex items-center gap-4 pt-2 border-t border-outline-variant/20">
              <span className="font-technical text-xs text-on-surface-variant whitespace-nowrap">Match threshold:</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={threshold}
                onChange={e => handleThresholdChange(Number(e.target.value))}
                className="flex-1 accent-primary"
                aria-label="Minimum ingredient match percentage"
              />
              <span className="font-technical text-xs font-medium text-primary whitespace-nowrap">≥ {threshold}%</span>
            </div>
          )}
          {searchResults !== null && hiddenCount > 0 && (
            <p className="font-technical text-xs text-outline">
              {hiddenCount} recipe{hiddenCount > 1 ? 's' : ''} hidden by this threshold. Lower the slider to see more.
            </p>
          )}
        </div>
      </section>

      {/* ── Recipe Grid ──────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 relative z-10 w-full">
        <div className="max-w-7xl mx-auto">
          {displayRecipes.length === 0 ? (
            <div className="py-32 text-center flex flex-col items-center justify-center opacity-70">
              <span className="material-symbols-outlined text-6xl text-outline mb-6">restaurant_menu</span>
              <p className="font-headline text-2xl text-on-surface-variant">
                {searchResults !== null && threshold > 0
                  ? `No recipes match ≥${threshold}% of your ingredients. Try lowering the slider.`
                  : 'No culinary entries match this combination.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {paginatedRecipes.map(recipe => (
                <article
                  key={recipe._id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="group cursor-pointer flex flex-col pt-3"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container shadow-md group-hover:shadow-[0px_20px_40px_rgba(88,65,60,0.12)] transition-shadow duration-700 mb-6 border border-outline/10">
                    <img
                      src={getImageUrl(recipe.imageUrl || recipe.image)}
                      alt={recipe.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110 ease-out"
                    />
                    <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full font-technical text-[9px] font-bold tracking-widest text-[#887F7A] uppercase editorial-shadow">
                      {recipe.category}
                    </div>
                    {recipe.matchPercentage !== undefined && (
                      <div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1.5 rounded-full font-technical text-[9px] font-bold tracking-widest editorial-shadow">
                        {recipe.matchPercentage}% MATCH
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <h2 className="font-headline text-3xl leading-[1.1] tracking-tight group-hover:text-primary transition-colors text-on-surface">{recipe.title}</h2>
                      <div className={`mt-1.5 flex-shrink-0 px-2 py-1 font-technical text-[8px] font-bold tracking-widest uppercase border border-outline/10 ${
                        recipe.difficulty === 'Hard' ? 'bg-[#FCEDEB] text-[#D84534]' :
                        recipe.difficulty === 'Medium' ? 'bg-[#EEF6F4] text-[#2C8566]' : 'bg-[#FFF3E0] text-[#B87A00]'
                      }`}>
                        {recipe.difficulty === 'Easy' ? 'BEGINNER' : recipe.difficulty === 'Medium' ? 'INTERMEDIATE' : 'ADVANCED'}
                      </div>
                    </div>

                    <p className="font-body text-[#7B716C] text-sm leading-relaxed mb-4 line-clamp-2">{recipe.description}</p>

                    {/* Dietary tags on card */}
                    {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {recipe.dietaryTags.slice(0, 3).map(tag => (
                          <span key={tag} className="font-technical text-[9px] px-2 py-0.5 bg-secondary-container/40 text-on-secondary-container uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-6 pb-2 border-b border-outline/20">
                      <div className="flex justify-start gap-8 font-technical text-[10px] tracking-widest uppercase text-on-surface-variant font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                          {recipe.prepTime + recipe.cookTime} MIN
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>restaurant</span>
                          SERVES {recipe.servings}
                        </div>
                      </div>
                    </div>

                    {/* Nutrition */}
                    {recipe.nutrition && (
                      <div className="mt-3 flex justify-between items-center font-technical text-[9px] tracking-widest text-on-surface-variant uppercase font-bold">
                        <span>NUTRITION / SERVING</span>
                        <div className="flex items-center gap-4 text-on-surface">
                          <span>{Math.round(recipe.nutrition.calories)} KCAL</span>
                          <span>{Math.round(recipe.nutrition.protein)}G PRO</span>
                        </div>
                      </div>
                    )}

                    {/* Match bar (if searched) */}
                    {recipe.matchPercentage !== undefined && (
                      <div className="mt-3 pt-3 border-t border-outline/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-technical text-xs text-on-surface-variant">Ingredient match</span>
                          <span className={`font-technical text-xs font-medium ${recipe.matchPercentage >= 70 ? 'text-secondary' : recipe.matchPercentage >= 40 ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                            {recipe.matchPercentage}%
                          </span>
                        </div>
                        <div className="h-1 bg-outline-variant rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${recipe.matchPercentage}%`,
                              backgroundColor: recipe.matchPercentage >= 70 ? '#366937' : recipe.matchPercentage >= 40 ? '#755700' : '#8c716b'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </article>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="mt-16 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 font-technical text-xs">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-outline-variant/50 text-on-surface-variant hover:text-on-surface hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === '...' ? (
                          <span key={`ellipsis-${i}`} className="px-2 py-2 text-outline">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`px-3 py-1 font-technical text-xs transition-colors ${
                              currentPage === p
                                ? 'bg-primary text-on-primary'
                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )
                    }

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-outline-variant/50 text-on-surface-variant hover:text-on-surface hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                  <p className="font-technical text-xs text-outline uppercase tracking-widest">
                    Page {currentPage} of {totalPages} · {displayRecipes.length} recipes
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Recipe Detail Modal ──────────────────────────────── */}
      {selectedRecipe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-12"
          onClick={() => setSelectedRecipe(null)}
        >
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"></div>

          <div
            className="relative bg-surface-container-lowest editorial-shadow w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row z-10 animate-in fade-in zoom-in duration-300 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-on-surface/10 hover:bg-on-surface text-on-surface hover:text-surface flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Modal image */}
            <div className="w-full md:w-2/5 md:min-h-full bg-surface-container-low relative sticky top-0">
              <img
                src={getImageUrl(selectedRecipe.imageUrl || selectedRecipe.image)}
                alt={selectedRecipe.title}
                className="w-full h-80 md:h-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute bottom-6 left-6 font-technical text-[10px] tracking-widest text-surface bg-on-surface/80 px-3 py-1.5 uppercase font-bold">
                {selectedRecipe.category}
              </div>
            </div>

            {/* Modal content */}
            <div className="w-full md:w-3/5 p-8 md:p-12 relative overflow-y-auto bg-surface-container-lowest">
              <h2 className="font-headline text-4xl md:text-5xl text-on-surface leading-[1.1] mb-2">{selectedRecipe.title}</h2>

              {/* Feature 2: Match breakdown */}
              {selectedRecipe.matchPercentage !== undefined && (
                <div className="mb-4 p-3 bg-primary/5 border border-primary/20">
                  <p className="font-technical text-xs text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>analytics</span>
                    {selectedRecipe.matchScore} of your ingredients found — {selectedRecipe.matchPercentage}% match
                  </p>
                </div>
              )}

              <p className="font-body text-base text-on-surface-variant text-balance leading-relaxed mb-6">
                {selectedRecipe.description}
              </p>

              {/* Meta */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 pb-8 border-b border-outline/20 font-technical text-sm text-center">
                {[
                  { label: 'Prep Time', value: `${selectedRecipe.prepTime} min` },
                  { label: 'Cook Time', value: `${selectedRecipe.cookTime} min` },
                  { label: 'Servings', value: selectedRecipe.servings },
                  { label: 'Difficulty', value: selectedRecipe.difficulty },
                ].map(m => (
                  <div key={m.label} className="bg-surface-container-low p-3">
                    <span className="block text-on-surface-variant font-bold tracking-widest uppercase text-[9px] mb-2">{m.label}</span>
                    <span className="text-on-surface">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Dietary tags in modal */}
              {selectedRecipe.dietaryTags && selectedRecipe.dietaryTags.length > 0 && (
                <div className="mb-6">
                  <p className="font-technical text-xs text-on-surface-variant uppercase tracking-widest mb-2">AI Dietary Tags</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedRecipe.dietaryTags.map(tag => {
                      const confPct = selectedRecipe.aiTagConfidence
                        ? Math.round((selectedRecipe.aiTagConfidence[tag] || 0) * 100) : null;
                      return (
                        <div key={tag} className="flex items-center gap-1">
                          <span className="font-technical text-xs px-3 py-1 bg-secondary-container/50 text-on-secondary-container">
                            {tag}{confPct > 0 && <span className="opacity-60 ml-1">{confPct}%</span>}
                          </span>
                          {user && (
                            <button
                              onClick={() => setReportModal({ recipeId: selectedRecipe._id, tag })}
                              title={`Report incorrect tag: ${tag}`}
                              className="text-on-surface-variant hover:text-error transition-colors"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>flag</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="font-technical text-xs text-on-surface-variant italic">
                    AI-generated (≥75% confidence). Always verify for allergies.
                  </p>
                </div>
              )}

              {/* Ingredients — with match highlighting */}
              <div className="space-y-10">
                <div>
                  <h3 className="font-technical text-sm font-bold tracking-[0.2em] uppercase text-primary mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>menu_book</span> Ingredients
                  </h3>
                  <ul className="space-y-3 font-body text-on-surface group">
                    {selectedRecipe.ingredients && selectedRecipe.ingredients.map((ingredient, i) => {
                      const isMatched = (selectedRecipe.matchedIngredients || []).some(m =>
                        ingredient.toLowerCase().includes(m.toLowerCase())
                      );
                      return (
                        <li key={i} className={`flex gap-4 p-2 transition-colors hover:bg-surface-container-low border-b border-outline/5 border-dashed last:border-0 ${isMatched ? 'text-secondary' : ''}`}>
                          <span className={`mt-1 ${isMatched ? 'text-secondary' : 'text-primary'}`}>
                            {isMatched ? '✓' : '•'}
                          </span>
                          <span>{ingredient}</span>
                          {isMatched && <span className="font-technical text-xs text-secondary/70 mt-1 ml-auto">matched</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="font-technical text-sm font-bold tracking-[0.2em] uppercase text-primary mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restaurant_menu</span> Methodology
                  </h3>
                  <div className="space-y-6 font-body text-on-surface">
                    {selectedRecipe.instructions && selectedRecipe.instructions.map((step, i) => (
                      <div key={i} className="flex gap-6 p-4 bg-surface-container-low/50 border border-outline/10 text-on-surface leading-relaxed">
                        <span className="font-headline text-3xl text-primary/30 italic mt-0">{(i + 1).toString().padStart(2, '0')}</span>
                        <span className="mt-2">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nutrition */}
                {selectedRecipe.nutrition && (
                  <div className="p-4 bg-surface-container-low border border-outline/10">
                    <p className="font-technical text-xs text-on-surface-variant uppercase tracking-widest mb-4">Nutrition per serving</p>
                    <div className="grid grid-cols-4 gap-3 text-center font-technical">
                      {[
                        { label: 'Calories', value: selectedRecipe.nutrition.calories, unit: 'kcal' },
                        { label: 'Protein', value: selectedRecipe.nutrition.protein, unit: 'g' },
                        { label: 'Fat', value: selectedRecipe.nutrition.fat, unit: 'g' },
                        { label: 'Carbs', value: selectedRecipe.nutrition.carbs, unit: 'g' },
                      ].map(n => (
                        <div key={n.label}>
                          <p className="font-headline text-xl text-on-surface">{Math.round(n.value)}</p>
                          <p className="text-xs text-on-surface-variant">{n.unit}</p>
                          <p className="text-xs text-on-surface-variant">{n.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feature 3: Recommendations */}
                <RecommendationRow
                  recipeId={selectedRecipe._id}
                  recipeTitle={selectedRecipe.title}
                  recipeIngredients={selectedRecipe.ingredients}
                  onSelectRecipe={async (id) => {
                    try {
                      const { data } = await API.get(`/api/recipes/${id}`);
                      setSelectedRecipe(data);
                    } catch { /* silently fail */ }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag report modal */}
      {reportModal && (
        <TagReportModal
          recipeId={reportModal.recipeId}
          tag={reportModal.tag}
          onClose={() => setReportModal(null)}
          onSuccess={() => toast.success('Tag report submitted. Thank you!')}
        />
      )}
    </main>
  );
}

export default RecipeList;