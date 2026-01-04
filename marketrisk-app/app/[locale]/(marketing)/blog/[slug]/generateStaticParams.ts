import { getAllBlogPosts } from '@/lib/data/blogPosts'

export function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
