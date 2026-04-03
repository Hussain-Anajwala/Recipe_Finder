import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
    <div className="fixed inset-0 grain-overlay z-[-1]"></div>
    <main className="pt-24 min-h-screen bg-surface">
        {/* Hero Section */}
        <section className="min-h-[819px] flex flex-col md:flex-row items-center px-6 md:px-12 lg:px-24 py-12 gap-12 overflow-hidden">
            <div className="w-full md:w-1/2 flex flex-col items-start gap-8 z-10">
                <h1 className="font-headline text-6xl md:text-7xl lg:text-8xl text-on-surface leading-[0.95] tracking-[-0.02em]">
                    Cook Something <br /> Worth <br /> Remembering
                </h1>
                <p className="text-on-surface-variant max-w-md text-lg leading-relaxed font-light font-body">
                    Savour is a sensory sommelier for your kitchen. Curate your digital recipe library with the intentionality of a physical heirloom.
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                    <Link to="/recipes" className="bg-primary text-on-primary px-8 py-4 rounded-sm font-label uppercase tracking-widest text-sm font-semibold editorial-shadow hover:bg-primary-container transition-all">
                        Explore Recipes
                    </Link>
                    {isAuthenticated() ? (
                        <Link to="/add" className="border border-primary text-primary px-8 py-4 rounded-sm font-label uppercase tracking-widest text-sm font-semibold hover:bg-primary-fixed transition-all">
                            Share Your Recipe
                        </Link>
                    ) : (
                        <Link to="/signup" className="border border-primary text-primary px-8 py-4 rounded-sm font-label uppercase tracking-widest text-sm font-semibold hover:bg-primary-fixed transition-all">
                            Join Savour
                        </Link>
                    )}
                </div>
            </div>
            <div className="w-full md:w-1/2 relative h-[500px] md:h-[700px]">
                <div className="absolute inset-0 bg-surface-container-high rounded-sm overflow-hidden rotate-2 translate-x-8 translate-y-8"></div>
                <img alt="Artisanal food scene" className="absolute inset-0 w-full h-full object-cover rounded-sm editorial-shadow transition-transform hover:scale-105 duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR8M0InTN31e_nEx4PQmz9RLi7pCuSJYVddP7aW_4XopqvtXuIvY-ySZi8FmyGUBvHt62lGEI5BXKI3px3KSzDi9FE51DikSGN_spqAzcXgFXLuOnpMCdK9ekUbfsS8bFivw-TH-cddYSVy9QQJwe6JKStYehWLf3eBEiZZUtSiQbtJuqqacZTFvw7FpKSHyPtkpRMB-mH3NCwjfnKC1ZdBNC3d0NTDMw77o754n62ARwCoA7R1mVbJqzGfv_bpnBu6Z6YnF2PApcL" />
            </div>
        </section>

        {/* Features Section */}
        <section className="px-6 md:px-12 lg:px-24 py-24 bg-surface-container-low">
            <div className="flex flex-col gap-2 mb-16">
                <span className="font-label text-primary tracking-[0.2em] text-xs font-bold">THE EXPERIENCE</span>
                <h2 className="font-headline text-4xl md:text-5xl text-on-surface">Digital Craftsmanship</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-surface-container-lowest p-8 border-t-2 border-primary editorial-shadow group cursor-pointer hover:-translate-y-1 transition-all">
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12">
                        <span className="material-symbols-outlined text-primary text-3xl">restaurant_menu</span>
                    </div>
                    <h3 className="font-headline text-2xl mb-4 group-hover:text-primary transition-colors">Heirloom Curation</h3>
                    <p className="text-on-surface-variant font-light leading-relaxed font-body">
                        Transform chaotic bookmarks into a visually stunning, searchable archive that feels like a hand-bound cookbook.
                    </p>
                </div>
                {/* Feature 2 */}
                <div className="bg-surface-container-lowest p-8 border-t-2 border-primary editorial-shadow group cursor-pointer hover:-translate-y-1 transition-all">
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12">
                        <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                    </div>
                    <h3 className="font-headline text-2xl mb-4 group-hover:text-primary transition-colors">Chef-Grade Privacy</h3>
                    <p className="text-on-surface-variant font-light leading-relaxed font-body">
                        Your secret ingredients remain secret. Control visibility at a granular level for every family recipe and experiment.
                    </p>
                </div>
                {/* Feature 3 */}
                <div className="bg-surface-container-lowest p-8 border-t-2 border-primary editorial-shadow group cursor-pointer hover:-translate-y-1 transition-all">
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12">
                        <span className="material-symbols-outlined text-primary text-3xl">manage_search</span>
                    </div>
                    <h3 className="font-headline text-2xl mb-4 group-hover:text-primary transition-colors">Sensory Discovery</h3>
                    <p className="text-on-surface-variant font-light leading-relaxed font-body">
                        Search by mood, technique, or season. Our intuitive filtering system understands the context of your culinary desires.
                    </p>
                </div>
            </div>
        </section>

        {/* Signature Component: The Recipe Metronome Mockup */}
        <section className="px-6 md:px-12 lg:px-24 py-24 flex flex-col items-center text-center">
            <div className="max-w-3xl w-full bg-surface-container-high p-12 rounded-sm border border-outline-variant/20">
                <span className="font-technical text-primary text-sm mb-6 block uppercase tracking-widest">Interactive Ingredient Tracking</span>
                <h3 className="font-headline text-4xl mb-8">The Recipe Metronome</h3>
                <div className="space-y-4 text-left font-technical text-lg md:text-xl">
                    <div className="flex items-center gap-4 cursor-pointer group">
                        <span className="w-4 h-4 border border-outline group-hover:bg-primary transition-colors"></span>
                        <span className="text-on-surface">2.5kg Heirloom Tomatoes, quartered</span>
                    </div>
                    <div className="flex items-center gap-4 cursor-pointer group">
                        <span className="w-4 h-4 border border-outline bg-primary"></span>
                        <span className="text-outline-variant line-through decoration-primary">4 cloves Garlic, thinly sliced</span>
                    </div>
                    <div className="flex items-center gap-4 cursor-pointer group">
                        <span className="w-4 h-4 border border-outline group-hover:bg-primary transition-colors"></span>
                        <span className="text-on-surface">60ml Cold-pressed Olive Oil</span>
                    </div>
                    <div className="flex items-center gap-4 cursor-pointer group">
                        <span className="w-4 h-4 border border-outline group-hover:bg-primary transition-colors"></span>
                        <span className="text-on-surface">Handful of fresh Genovese Basil</span>
                    </div>
                </div>
                <p className="mt-12 text-on-surface-variant italic font-headline text-lg">
                    "Track your progress without smudging the screen. A digital pen for your culinary canvas."
                </p>
            </div>
        </section>

        {/* Community/Editorial Section */}
        <section className="px-6 md:px-12 lg:px-24 py-24 flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2 order-2 md:order-1 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    <img alt="Kitchen prep" className="w-full aspect-[3/4] object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRoWBG6zvsVvAIacbizUdyr8RTUlz2URPSOtNHvNQa7D_T-eMTw9CmQ6Ma699QY3RwA2jbhFqzwGEDXFwk7c_Qr57P2oDBjUokzIWUw9AdYh1xAw2hhFzHTMMsHI5H31LB471c3dt5enidqbHYp0ThbUVSFXsrO9EANsm3Fmc3TkbpKhqRtmSyy30VsPOg4IxKsASWKUGZPWLJTXEz7uRMBC9hlp-k5oYIf6M6p6R1283E0A4G72Omwl-kq9-VZOFqNlWPV3N0g7JQ" />
                    <img alt="Fresh ingredients" className="w-full aspect-square object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuBp5wrs7IXA5mSJ3bdpGTv-ewQHG68z6hDzGlLEeBYYrTW5MXeUMiod0Y_CeT2-sZ97VyZnB6ZT7WXpEhPakwZ7ATqRPmaNXiAw8C9qR961Pp8GWhmgjMssLHte2I_sTyNwnKa3y3p6FSa-ng_ksFao2bhVm3bpFUu4QAxmG__HsC28eZ6_3Qnpd-VbYexzQ8BkkRn7qxVb9H_0zjjyexECMwnULP4owwvV5PdGUd8edVpZ5tZkjsMCKWlr-a9F5uoqsVoHmyx-9D" />
                </div>
                <div className="pt-12 space-y-4">
                    <img alt="Plated dish" className="w-full aspect-square object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBphKciquSmSnXaaYEMzfqGvipvXzVmQie8fCZrkX9-Ahrsw3vAO8cTs-QiAwozWrTACjtZh8P0hpyXi0SyLz6SOF2OVW77uNcaA9it4v6Xq_4WckW4950RawA9ff2T1Z-eU-NElL0E2gXwPG-ACAIWWJcmXgVysrf2OMWtz5zZbqZFXDvNe7FbA56uXcIvuVWaFKp3qk0i2-YpKrXbBMkEjPE5wPT2WzmT1mgXycFIPzO4Gf9fUZAf-mj9NcZ9ftaOb_Tkd_jkZgHb" />
                    <img alt="Wine and dinner" className="w-full aspect-[3/4] object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd2oC-1ZUbJAUmPrKKaGCtXRJ2CC7DJpbA-cgFGO6XDv7gZ9oTcOcJolNDYWaqn_WPiQ3_8UUcIK7_tVR5TdUEu51fAg-dKeGUOTPObIC1qDawE3Tt-7uwWoWu02svJVz7SpHKqiJAvzTQ-O8dEf4zV8ZBSKQbP8AwV2s8PC7U3yYIb-3BDnXDv1yxlk73vOC_GmWh1zRAZKekcjZZfVGsTi2HG9r7AxP9rHYLj3VVWjhhjq7mOHRJTiTUFFStaZDVVLcbv3XFH2F8" />
                </div>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
                <span className="font-label text-primary tracking-[0.2em] text-xs font-bold">EDITOR'S CHOICE</span>
                <h2 className="font-headline text-5xl mt-4 mb-8 leading-tight">A Curated Community for the Culinary Arts</h2>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-8 font-body">
                    Savour isn't just a database; it's a movement toward intentional eating and craft. Connect with chefs, artisans, and enthusiasts who believe that every meal is an opportunity for storytelling.
                </p>
                <div className="p-6 bg-surface-container-high border-l-4 border-primary">
                    <p className="text-on-surface font-headline italic text-xl">
                        "The most beautiful kitchen tool I've used in a decade. It makes the digital feel visceral."
                    </p>
                    <span className="block mt-4 font-label text-xs tracking-widest text-primary uppercase font-bold">— Elena Rossi, Executive Chef</span>
                </div>
            </div>
        </section>
        
        {/* Footer */}
        <footer className="w-full py-12 px-6 md:px-24 flex flex-col items-center text-center space-y-6 bg-surface-container-high mt-12">
            <span className="text-xl font-headline font-bold text-primary">Savour</span>
            <div className="flex flex-wrap justify-center gap-8 font-label">
                <Link to="/" className="text-stone-500 hover:text-primary transition-all">About</Link>
                <Link to="/" className="text-stone-500 hover:text-primary transition-all">Privacy</Link>
                <Link to="/" className="text-stone-500 hover:text-primary transition-all">Terms</Link>
                <Link to="/" className="text-stone-500 hover:text-primary transition-all">Contact</Link>
            </div>
            <p className="text-stone-500 font-label text-sm font-light">© 2024 Savour. A curated community for the culinary arts.</p>
        </footer>
    </main>
    </>
  );
}
