import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  category: string;
  category_en: string;
  image: string;
  read_time: string;
  created_at: string;
  featured?: boolean;
}

export default function BlogIndex() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedContent = (post: BlogPost) => ({
    title: i18n.language === 'de' ? post.title : post.title_en,
    excerpt: i18n.language === 'de' ? post.excerpt : post.excerpt_en,
    category: i18n.language === 'de' ? post.category : post.category_en,
  });

  const featuredPost = posts.find(p => p.featured);
  const regularPosts = posts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('blog.title', 'Insights & News')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('blog.subtitle', 'B2B-Insights zu Lager, Schutzglas-Technologie und europäischem Mobilfunk-Handel.')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white text-xl">
              {t('blog.noPosts', 'Keine Beiträge vorhanden.')}
            </p>
          </div>
        ) : (
          <>
            {featuredPost && (
              <div className="mb-16 animate-slide-up">
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group"
                     onClick={() => navigate(`/blog/${featuredPost.slug}`)}>
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-slate-900">
                          FEATURED
                        </span>
                      </div>
                      <img
                        src={featuredPost.image}
                        alt={getLocalizedContent(featuredPost).title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {getLocalizedContent(featuredPost).category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost.read_time}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {getLocalizedContent(featuredPost).title}
                      </h2>
                      <p className="text-slate-600 mb-6 line-clamp-3">
                        {getLocalizedContent(featuredPost).excerpt}
                      </p>
                      <Button className="w-fit group-hover:gap-3 transition-all">
                        {t('blog.readMore', 'Artikel lesen')}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {regularPosts.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => {
                  const content = getLocalizedContent(post);
                  return (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
                          {content.category}
                        </span>
                        <img
                          src={post.image}
                          alt={content.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                          <Clock className="w-4 h-4" />
                          <span>{post.read_time}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {content.title}
                        </h3>
                        <p className="text-slate-600 mb-4 line-clamp-3">
                          {content.excerpt}
                        </p>
                        <Button variant="ghost" className="w-full group-hover:gap-3 transition-all">
                          {t('blog.readMore', 'Artikel lesen')}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
