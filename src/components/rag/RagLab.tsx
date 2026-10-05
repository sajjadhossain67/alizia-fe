'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiClient } from '../../services/api';
import { UploadCloud, Search, Database, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { RagResultItem } from '../../types';

export const RagLab: React.FC = () => {
  const { showToast } = useApp();

  const [ingestText, setIngestText] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<RagResultItem[]>([]);

  const handleIngest = async () => {
    const text = ingestText.trim();
    if (!text) {
      showToast('Please enter text content to ingest.');
      return;
    }

    setIsIngesting(true);
    showToast('Ingesting into Alizia Knowledge Base...');

    const res = await apiClient.ingestRagDocument(text, 'web_snippet.txt');
    showToast(`Ingested ${res.chunks_created || 1} chunks with ID ${res.file_id || 'ok'}`);
    setIngestText('');
    setIsIngesting(false);
  };

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    const res = await apiClient.searchRag(query, 3);
    setSearchResults(res.results || []);
    setIsSearching(false);
  };

  return (
    <section className="view-container active overflow-y-auto">
      <div className="rag-lab-container">
        <div>
          <h2 className="text-2xl font-bold mb-1.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Knowledge & Hybrid RAG Lab
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            Explore Alizia&apos;s 4-tier memory hierarchy: Session, User, Workspace, and Agent knowledge with pgvector similarity.
          </p>
        </div>

        <div className="rag-grid">
          {/* Ingest Card */}
          <div className="rag-card">
            <h3 className="flex items-center gap-2">
              <UploadCloud size={20} className="text-[var(--accent-cyan)]" />
              Document & Knowledge Ingestion
            </h3>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              Ingest arbitrary context into the active tenant organization partition with semantic chunking.
            </p>
            <textarea
              className="rag-input font-mono text-xs"
              placeholder="Paste document content, API schema, or knowledge notes here..."
              rows={6}
              value={ingestText}
              onChange={(e) => setIngestText(e.target.value)}
              disabled={isIngesting}
            />
            <button
              className="rag-btn flex items-center justify-center gap-2"
              onClick={handleIngest}
              disabled={isIngesting}
            >
              {isIngesting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Ingesting Chunks...</span>
                </>
              ) : (
                <>
                  <Database size={16} />
                  <span>Ingest into Alizia Index</span>
                </>
              )}
            </button>
          </div>

          {/* Search Card */}
          <div className="rag-card">
            <h3 className="flex items-center gap-2">
              <Search size={20} className="text-[var(--accent-purple)]" />
              Hybrid Vector & BM25 Search
            </h3>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              Test semantic similarity search across embeddings with reciprocal rank fusion (RRF).
            </p>
            <input
              type="text"
              className="rag-input"
              placeholder="Enter semantic query (e.g. concurrency, memory)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isSearching}
            />
            <button
              className="rag-btn flex items-center justify-center gap-2"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Searching Vectors...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Execute Hybrid Search</span>
                </>
              )}
            </button>

            {/* Results */}
            <div className="mt-3 flex flex-col gap-2.5">
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <div key={idx} className="tool-execution-card">
                    <div className="tool-card-title flex items-center justify-between">
                      <span>Chunk ID: {item.chunk_id}</span>
                      <span className="text-[var(--accent-cyan)] font-mono font-medium">
                        {(item.score * 100).toFixed(1)}% match
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                      {item.text}
                    </div>
                  </div>
                ))
              ) : (
                searchQuery && !isSearching && (
                  <div className="text-xs text-[var(--text-tertiary)] p-2">
                    Enter a query and click Execute Hybrid Search to test pgvector retrieval.
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
