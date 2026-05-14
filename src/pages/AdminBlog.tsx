import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from "lucide-react";

type BlogPost = {
  id?: string;
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
  published: boolean;
  featured: boolean;
};

const AdminBlog = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Error loading posts", variant: "destructive" });
      return;
    }
    setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create/Update post
  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);

    const { error } = editing.id
      ? await supabase.from("blog_posts").update(editing).eq("id", editing.id)
      : await supabase.from("blog_posts").insert([editing]);

    if (error) {
      toast({ title: "Error saving post", variant: "destructive" });
    } else {
      toast({ title: editing.id ? "Post updated" : "Post created" });
      setEditing(null);
      fetchPosts();
    }
    setLoading(false);
  };

  // Delete post
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting post", variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
      fetchPosts();
    }
  };

  // New post template
  const newPost = (): BlogPost => ({
    slug: "",
    title: "",
    title_en: "",
    excerpt: "",
    excerpt_en: "",
    content: "",
    content_en: "",
    category: "Insights",
    category_en: "Insights",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=630&fit=crop",
    read_time: "5 min",
    published: false,
    featured: false,
  });

  const inputClass = "bg-white/5 border-white/10 text-white";

  return (
    <div className="min-h-screen bg-deep text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Blog Admin</h1>
          <Button onClick={() => setEditing(newPost())} className="gap-2">
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </div>

        {/* Editor */}
        {editing && (
          <div className="glass-dark rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editing.id ? "Edit Post" : "New Post"}</h2>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Slug */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2">Slug (URL)</label>
                <Input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                  placeholder="my-blog-post"
                  className={inputClass}
                />
              </div>

              {/* German Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">Title (DE)</label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* English Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">Title (EN)</label>
                <Input
                  value={editing.title_en}
                  onChange={(e) => setEditing({ ...editing, title_en: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* German Excerpt */}
              <div>
                <label className="block text-sm font-semibold mb-2">Excerpt (DE)</label>
                <Textarea
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  rows={3}
                  className={inputClass}
                />
              </div>

              {/* English Excerpt */}
              <div>
                <label className="block text-sm font-semibold mb-2">Excerpt (EN)</label>
                <Textarea
                  value={editing.excerpt_en}
                  onChange={(e) => setEditing({ ...editing, excerpt_en: e.target.value })}
                  rows={3}
                  className={inputClass}
                />
              </div>

              {/* German Content */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2">Content (DE) — Markdown supported</label>
                <Textarea
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={12}
                  className={inputClass}
                  placeholder="## Heading&#10;&#10;Paragraph text here...&#10;&#10;- List item&#10;- Another item"
                />
              </div>

              {/* English Content */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2">Content (EN) — Markdown supported</label>
                <Textarea
                  value={editing.content_en}
                  onChange={(e) => setEditing({ ...editing, content_en: e.target.value })}
                  rows={12}
                  className={inputClass}
                  placeholder="## Heading&#10;&#10;Paragraph text here...&#10;&#10;- List item&#10;- Another item"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category (DE)</label>
                <Input
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Category (EN)</label>
                <Input
                  value={editing.category_en}
                  onChange={(e) => setEditing({ ...editing, category_en: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">Image URL</label>
                <Input
                  value={editing.image}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm font-semibold mb-2">Read Time</label>
                <Input
                  value={editing.read_time}
                  onChange={(e) => setEditing({ ...editing, read_time: e.target.value })}
                  placeholder="5 min"
                  className={inputClass}
                />
              </div>

              {/* Checkboxes */}
              <div className="col-span-2 flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Featured</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleSave} disabled={loading} className="gap-2">
                <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Post"}
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="glass-dark rounded-xl p-6 flex items-center gap-4">
              <img src={post.image} alt="" className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  {post.published && <Eye className="w-4 h-4 text-green-400" />}
                  {!post.published && <EyeOff className="w-4 h-4 text-gray-500" />}
                  {post.featured && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Featured</span>}
                </div>
                <p className="text-sm text-white/60">{post.excerpt.slice(0, 100)}...</p>
                <div className="text-xs text-white/40 mt-2">/{post.slug}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(post)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => post.id && handleDelete(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
