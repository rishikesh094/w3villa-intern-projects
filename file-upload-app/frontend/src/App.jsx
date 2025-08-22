import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = 'http://localhost:4000';

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/files`);
      setFiles(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load files");
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";

      fetchFiles();
    } catch (err) {
      setError("Failed to upload file");
      console.error("Error uploading file:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (f) => {
    try {
      const fileName = f.split("/").pop();
      await axios.delete(`${API_BASE}/delete/${fileName}`);
      fetchFiles();
    } catch (err) {
      setError("Failed to delete file");
      console.error("Error deleting file:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r-lg max-w-md w-full">
          <div className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 text-lg ml-2">×</button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleUpload}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mb-8 border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          File Upload
        </h1>

        <div className="space-y-4">
          <label
            htmlFor="file-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select File
          </label>

          {/* Custom file upload button */}
          <label
            htmlFor="file-input"
            className={`block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer text-center transition-all duration-200 ${
              file 
                ? "border-green-300 bg-green-50 text-green-700" 
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-500"
            }`}
          >
            <div className="text-2xl mb-2">📁</div>
            <div className="font-medium">
              {file ? file.name : "Click to choose file"}
            </div>
            {file && (
              <div className="text-xs mt-1 text-green-600">
                File selected ✓
              </div>
            )}
          </label>

          <input
            id="file-input"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            disabled={uploading}
          />

          <p className="text-xs text-gray-500 text-center">
            Supported formats: JPG, PNG, GIF, PDF, DOC, etc.
          </p>
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            !file || uploading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transform hover:scale-[1.02]"
          }`}
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </div>
          ) : (
            "Upload File"
          )}
        </button>
      </form>

      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Uploaded Files</h2>
          <button
            onClick={fetchFiles}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No files uploaded yet</h3>
            <p className="text-gray-500">Upload your first file to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200"
              >
                {f.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <div className="relative group w-full h-40 border-b overflow-hidden">
                    <img src={`${API_BASE}${f}`} alt="Uploaded Image" className="w-full h-full object-cover block" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                      <a
                        href={`${API_BASE}${f}`}
                        target="_blank"
                        className="bg-white text-blue-600 font-semibold px-3 py-1 rounded text-sm hover:bg-blue-600 hover:text-white transition"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(f)}
                        className="bg-white text-red-600 font-semibold px-3 py-1 rounded text-sm hover:bg-red-600 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
                    <div className="text-5xl mb-3">📄</div>
                    <p className="text-sm text-center text-gray-600 mb-4 font-medium truncate w-full">
                      {f.split("/").pop()}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={`${API_BASE}${f}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDelete(f)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {f.split("/").pop()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
