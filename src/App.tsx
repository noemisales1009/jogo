import { useState } from 'react';
import { Linkedin, Twitter, Instagram, Loader2, Sparkles, Copy, Check } from 'lucide-react';

interface GeneratedPosts {
  linkedin: string;
  twitter: string;
  instagram: string;
}

export default function App() {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [posts, setPosts] = useState<GeneratedPosts | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const tones = ['Professional', 'Witty', 'Urgent', 'Inspirational', 'Casual', 'Educational'];

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    
    setIsGenerating(true);
    setPosts(null);
    setCopiedStates({});

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea, tone }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
      alert('An error occurred while generating posts. Please check the logs.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (platform: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [platform]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [platform]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-4">
            Social Media Content Generator
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Transform a single idea into tailored posts for LinkedIn, Twitter, and Instagram instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 sticky top-12 space-y-8 p-8 bg-white rounded-3xl shadow-sm border border-neutral-200">
            <div>
              <label htmlFor="idea" className="block text-sm font-medium text-neutral-700 mb-2">
                What's your core idea?
              </label>
              <textarea
                id="idea"
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none text-base"
                placeholder="e.g. We just launched a new feature that lets users export data to CSV with one click..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Select Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      tone === t
                        ? 'bg-neutral-900 text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !idea.trim()}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 disabled:text-neutral-500 text-white rounded-xl font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Posts
                </>
              )}
            </button>
          </div>

          {/* Right Column: Results Grid */}
          <div className="lg:col-span-8">
            {posts ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* LinkedIn Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#0A66C2]/10 rounded-xl">
                        <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                      </div>
                      <h3 className="text-xl font-medium tracking-tight">LinkedIn</h3>
                    </div>
                    <button
                      onClick={() => handleCopy('linkedin', posts.linkedin)}
                      className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedStates['linkedin'] ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap text-base text-neutral-700 leading-relaxed">
                    {posts.linkedin}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Twitter Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-neutral-900/5 rounded-xl">
                          <Twitter className="w-6 h-6 text-neutral-900" />
                        </div>
                        <h3 className="text-xl font-medium tracking-tight">Twitter / X</h3>
                      </div>
                      <button
                        onClick={() => handleCopy('twitter', posts.twitter)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedStates['twitter'] ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="whitespace-pre-wrap text-base text-neutral-700 leading-relaxed">
                      {posts.twitter}
                    </div>
                  </div>

                  {/* Instagram Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#E1306C]/10 rounded-xl">
                          <Instagram className="w-6 h-6 text-[#E1306C]" />
                        </div>
                        <h3 className="text-xl font-medium tracking-tight">Instagram</h3>
                      </div>
                      <button
                        onClick={() => handleCopy('instagram', posts.instagram)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedStates['instagram'] ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="whitespace-pre-wrap text-base text-neutral-700 leading-relaxed">
                      {posts.instagram}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 border-2 border-dashed border-neutral-200 rounded-3xl text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-2">Ready to generate</h3>
                <p className="text-neutral-500 max-w-sm">
                  Share your idea on the left, select a tone, and we'll craft optimized posts for each platform.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
