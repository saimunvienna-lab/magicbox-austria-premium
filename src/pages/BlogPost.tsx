import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  content: string;
  content_en: string;
  category: string;
  category_en: string;
  image: string;
  read_time: string;
  created_at: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (postError || !postData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPost(postData);

      const { data: relatedData } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('category', postData.category)
        .neq('id', postData.id)
        .limit(2);

      setRelatedPosts(relatedData || []);
    } catch (err) {
      console.error('Error fetching post:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedContent = (post: BlogPost) => ({
    title: i18n.language === 'de' ? post.title : post.title_en,
    content: i18n.language === 'de' ? post.content : post.content_en,
    category: i18n.language === 'de' ? post.category : post.category_en,
    excerpt: i18n.language === 'de' ? post.excerpt : post.excerpt_en,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('blog.notFound', 'Artikel nicht gefunden')}
          </h1>
          <p className="text-blue-100 mb-8">
            {t('blog.notFoundDesc', 'Dieser Blogartikel existiert nicht oder wurde entfernt.')}
          </p>
          <Button onClick={() => navigate('/blog')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('blog.backToBlog', 'Zurück zum Blog')}
          </Button>
        </div>
      </div>
    );
  }

  const content = getLocalizedContent(post);
  const formattedDate = new Date(post.created_at).toLocaleDateString(
    i18n.language === 'de' ? 'de-AT' : 'en-GB',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <article className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/blog')}
          className="text-white hover:text-blue-200 mb-8 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('blog.backToBlog', 'Zurück zum Blog')}
        </Button>

        <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <img
            src={post.image}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
              {content.category}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.read_time}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {content.title}
          </h1>

          <div className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900 prose-strong:font-semibold
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-slate-700 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500
            prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600
            prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-code:text-sm prose-code:text-slate-800
            prose-table:border-collapse prose-table:w-full
            prose-th:bg-slate-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold
            prose-td:p-3 prose-td:border prose-td:border-slate-200"
          >
            <ReactMarkdown>{content.content}</ReactMarkdown>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              {t('blog.relatedPosts', 'Weiterlesen')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => {
                const relatedContent = getLocalizedContent(relatedPost);
                return (
                  <div
                    key={relatedPost.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
                    onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
                        {relatedContent.category}
                      </span>
                      <img
                        src={relatedPost.image}
                        alt={relatedContent.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <Clock className="w-4 h-4" />
                        <span>{relatedPost.read_time}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relatedContent.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>
      <Footer />
    </div>
  );
}
