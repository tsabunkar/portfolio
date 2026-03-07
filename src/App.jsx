/**
 * App.jsx
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import BaseLayout from "@/components/layout/BaseLayout";
import HomePage from "@/pages/Home";
import ArticleView from "@/pages/ArticleView";
import ScrollManager from "@/components/utils/ScrollManager";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollManager />
        <BaseLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:slug" element={<ArticleView />} />
          </Routes>
        </BaseLayout>
      </Router>
    </ThemeProvider>
  );
}
