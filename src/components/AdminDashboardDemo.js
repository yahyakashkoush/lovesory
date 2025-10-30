'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageCropper from './ImageCropper';

export default function AdminDashboardDemo() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [showCropper, setShowCropper] = useState(false);

  // Form states
  const [maleFirstName, setMaleFirstName] = useState('Ahmed');
  const [femaleFirstName, setFemaleFirstName] = useState('Mai');
  const [tagline, setTagline] = useState('');
  const [loveMessage, setLoveMessage] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content-demo');
      const data = await response.json();
      setContent(data);
      setMaleFirstName(data.maleFirstName || 'Ahmed');
      setFemaleFirstName(data.femaleFirstName || 'Mai');
      setTagline(data.tagline || '');
      setLoveMessage(data.loveMessage || '');
      setStartDate(data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '');
    } catch (error) {
      console.error('Failed to fetch content:', error);
      setMessage('❌ Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login-demo');
  };

  const handleSaveContent = async () => {
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage('❌ Not authenticated. Please login again.');
        setSaving(false);
        return;
      }

      const payload = {
        maleFirstName,
        femaleFirstName,
        tagline,
        loveMessage,
        startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
      };

      const response = await fetch('/api/content-demo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Response error:', data);
        throw new Error(data.error || 'Failed to save content');
      }

      setContent(data);
      setMaleFirstName(data.maleFirstName);
      setFemaleFirstName(data.femaleFirstName);
      setTagline(data.tagline);
      setLoveMessage(data.loveMessage);
      setMessage('✅ Content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    setSaving(true);
    setMessage('');

    try {
      // For demo, just add placeholder images
      const newImages = Array.from(files).map((file, index) => ({
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        name: file.name,
      }));

      const updatedContent = {
        ...content,
        images: [...(content.images || []), ...newImages],
      };

      setContent(updatedContent);
      setMessage('✅ Images added successfully! (Demo mode - not saved)');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Failed to add images');
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleSongUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    setMessage('');

    try {
      // For demo, just add placeholder song
      const updatedContent = {
        ...content,
        song: {
          url: URL.createObjectURL(file),
          uploadedAt: new Date(),
          name: file.name,
        },
      };

      setContent(updatedContent);
      setMessage('✅ Song added successfully! (Demo mode - not saved)');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Failed to add song');
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    setMessage('');

    try {
      // For demo, just add placeholder cover
      const updatedContent = {
        ...content,
        songCover: {
          url: URL.createObjectURL(file),
          uploadedAt: new Date(),
          name: file.name,
        },
      };

      setContent(updatedContent);
      setMessage('✅ Cover added successfully! (Demo mode - not saved)');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Failed to add cover');
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (index) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const updatedImages = content.images.filter((_, i) => i !== index);
      const updatedContent = {
        ...content,
        images: updatedImages,
      };

      setContent(updatedContent);
      setMessage('✅ Image deleted successfully! (Demo mode - not saved)');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('❌ Failed to delete image');
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    setSaving(true);
    setMessage('');

    try {
      const url = URL.createObjectURL(croppedBlob);
      const updatedContent = {
        ...content,
        images: [
          ...(content.images || []),
          {
            url,
            uploadedAt: new Date(),
            name: 'cropped-image.jpg',
          },
        ],
      };

      setContent(updatedContent);
      setShowCropper(false);
      setMessage('✅ Image cropped and added successfully! (Demo mode - not saved)');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Crop upload error:', error);
      setMessage('❌ Failed to crop image');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">❤️</div>
          <p className="text-rose-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-xs text-white/80 mt-1">🔧 Demo Mode (No MongoDB)</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-smooth"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md border-l-4 border-rose-500 message-slide-up glow-effect">
            {message}
          </div>
        )}

        {/* Demo Warning */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600">
            ℹ️ <strong>Demo Mode:</strong> This dashboard works without MongoDB. Changes are stored in memory only and will be lost on page refresh.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {['content', 'images', 'music'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-smooth ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-rose-600 hover:shadow-md'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="glass rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-rose-700 mb-6">Edit Content</h2>

            <div className="space-y-6">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-2">
                    Male Name
                  </label>
                  <input
                    type="text"
                    value={maleFirstName}
                    onChange={(e) => setMaleFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-2">
                    Female Name
                  </label>
                  <input
                    type="text"
                    value={femaleFirstName}
                    onChange={(e) => setFemaleFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-2">
                  Tagline
                </label>
                <textarea
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Love Message */}
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-2">
                  Love Message
                </label>
                <textarea
                  value={loveMessage}
                  onChange={(e) => setLoveMessage(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveContent}
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-smooth disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="glass rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-rose-700 mb-6">Manage Images</h2>

            {/* Upload Options */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Regular Upload */}
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-4">
                  Upload Images
                </label>
                <div className="border-2 border-dashed border-rose-300 rounded-lg p-8 text-center hover:border-rose-500 transition-smooth cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={saving}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-rose-600 font-semibold">
                      Click to upload
                    </p>
                    <p className="text-sm text-rose-500">PNG, JPG, GIF</p>
                  </label>
                </div>
              </div>

              {/* Crop Upload */}
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-4">
                  Crop & Upload
                </label>
                <button
                  onClick={() => setShowCropper(true)}
                  className="w-full h-full border-2 border-dashed border-rose-300 rounded-lg p-8 text-center hover:border-rose-500 transition-smooth cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="text-4xl mb-2">✂️</div>
                  <p className="text-rose-600 font-semibold">
                    Crop & Upload
                  </p>
                  <p className="text-sm text-rose-500">Portrait (3:4)</p>
                </button>
              </div>
            </div>

            {/* Image Cropper Modal */}
            {showCropper && (
              <ImageCropper
                onCropComplete={handleCropComplete}
                onClose={() => setShowCropper(false)}
              />
            )}

            {/* Gallery */}
            {content?.images && content.images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-rose-700 mb-4">
                  Uploaded Images ({content.images.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {content.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleDeleteImage(index)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center rounded-lg"
                      >
                        <span className="text-white font-semibold">Delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Music Tab */}
        {activeTab === 'music' && (
          <div className="space-y-8">
            {/* Song Upload */}
            <div className="glass rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-rose-700 mb-6">Upload Song</h2>

              <label className="block text-sm font-medium text-rose-700 mb-4">
                Love Song (MP3)
              </label>
              <div className="border-2 border-dashed border-rose-300 rounded-lg p-8 text-center hover:border-rose-500 transition-smooth cursor-pointer">
                <input
                  type="file"
                  accept="audio/mp3,audio/*"
                  onChange={handleSongUpload}
                  disabled={saving}
                  className="hidden"
                  id="song-upload"
                />
                <label htmlFor="song-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">🎵</div>
                  <p className="text-rose-600 font-semibold">
                    Click to upload song or drag and drop
                  </p>
                  <p className="text-sm text-rose-500">MP3 format up to 50MB</p>
                </label>
              </div>

              {content?.song?.url && (
                <div className="mt-6 p-4 bg-rose-50 rounded-lg">
                  <p className="text-sm text-rose-600 font-semibold mb-2">✅ Song uploaded</p>
                  <audio src={content.song.url} controls className="w-full" />
                </div>
              )}
            </div>

            {/* Cover Upload */}
            <div className="glass rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-rose-700 mb-6">Upload Song Cover</h2>

              <label className="block text-sm font-medium text-rose-700 mb-4">
                Cover Image
              </label>
              <div className="border-2 border-dashed border-rose-300 rounded-lg p-8 text-center hover:border-rose-500 transition-smooth cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={saving}
                  className="hidden"
                  id="cover-upload"
                />
                <label htmlFor="cover-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">🎨</div>
                  <p className="text-rose-600 font-semibold">
                    Click to upload cover or drag and drop
                  </p>
                  <p className="text-sm text-rose-500">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>

              {content?.songCover?.url && (
                <div className="mt-6">
                  <p className="text-sm text-rose-600 font-semibold mb-2">✅ Cover uploaded</p>
                  <img
                    src={content.songCover.url}
                    alt="Song Cover"
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
