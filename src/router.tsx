import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// Code-split blog routes so homepage bundle stays ultra-lightweight
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex').then(m => ({ default: m.BlogIndex })));
const BlogPostPage = lazy(() => import('./pages/blog/BlogPost').then(m => ({ default: m.BlogPostPage })));
const BlogCategoryPage = lazy(() => import('./pages/blog/BlogCategory').then(m => ({ default: m.BlogCategoryPage })));
const BlogNotFound = lazy(() => import('./pages/blog/BlogNotFound').then(m => ({ default: m.BlogNotFound })));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#0a1220] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#ffc46b] border-t-transparent animate-spin" />
    </div>
  );
}

/**
 * Handles smooth scrolling to hash anchors (e.g. /#survey, /#services)
 * when navigating between blog pages and the homepage.
 */
function ScrollToAnchor() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export function AppRouter() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToAnchor />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/category/:slug" element={<BlogCategoryPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<BlogNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
