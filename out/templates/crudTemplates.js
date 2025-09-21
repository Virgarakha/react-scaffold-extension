"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrudTemplates = getCrudTemplates;
function getCrudTemplates(options) {
    const { name, lowerName, theme } = options;
    const isDark = theme === 'dark';
    const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const cardClass = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const textClass = isDark ? 'text-white' : 'text-gray-900';
    const inputClass = isDark
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';
    return {
        [`${name}.jsx`]: `import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Search, Eye, Edit, Trash2, Package } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const ${name} = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(\`\${API_BASE_URL}/${lowerName}s\`, {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        setData(response.data);
      } catch (error) {
        alert('Gagal memuat data: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const filteredData = data.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        await axios.delete(\`\${API_BASE_URL}/${lowerName}s/\${id}\`, {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        setData(data.filter(item => item.id !== id));
      } catch (error) {
        alert('Gagal menghapus data: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="min-h-screen ${bgClass}">
      {/* Header */}
      <div className="${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold ${textClass}">Daftar ${name}</h1>
            </div>
            <Link
              to="/${lowerName}/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah ${name}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border ${inputClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
                placeholder="Cari ${lowerName}..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Content */}
          <div className="${cardClass} border rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 ${textClass}">Loading...</span>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center p-12">
                <Package className="mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}" />
                <h3 className="mt-2 text-sm font-medium ${textClass}">Tidak ada ${lowerName}</h3>
                <p className="mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}">
                  Mulai dengan membuat ${lowerName} pertama Anda.
                </p>
                <div className="mt-6">
                  <Link
                    to="/${lowerName}/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah ${name}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}">
                  <thead className="${isDark ? 'bg-gray-700' : 'bg-gray-50'}">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium ${textClass}">{item.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm ${textClass}">Rp {item.price?.toLocaleString() || '0'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Link
                            to={\`/${lowerName}/\${item.id}\`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Detail
                          </Link>
                          <Link
                            to={\`/${lowerName}/\${item.id}/edit\`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-200"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ${name};
`,
        [`${name}Create.jsx`]: `import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Save, ArrowLeft, Package } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const ${name}Create = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(\`\${API_BASE_URL}/${lowerName}s\`, form, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      navigate("/${lowerName}");
    } catch (error) {
      alert('Gagal membuat data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ${bgClass}">
      {/* Header */}
      <div className="${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              to="/${lowerName}"
              className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md ${isDark ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold ${textClass}">Buat ${name}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="${cardClass} border rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium ${textClass} mb-2">
                  Nama ${name}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full px-3 py-3 border ${inputClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
                  placeholder="Masukkan nama ${lowerName}"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              {/* Deskripsi Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium ${textClass} mb-2">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="block w-full px-3 py-3 border ${inputClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
                  placeholder="Masukkan deskripsi ${lowerName}"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              {/* Harga Field */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium ${textClass} mb-2">
                  Harga
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  className="block w-full px-3 py-3 border ${inputClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
                  placeholder="Masukkan harga ${lowerName}"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  to="/${lowerName}"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${isDark ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ${name}Create;
`,
        [`${name}Update.jsx`]: `import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Save, ArrowLeft, Package } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const ${name}Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(\`\${API_BASE_URL}/${lowerName}s/\${id}\`, {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        setForm(response.data);
      } catch (error) {
        alert('Gagal memuat data: ' + (error.response?.data?.message || error.message));
      } finally {
        setDataLoading(false);
      }
    };
    if (token) fetchData();
  }, [id, token]);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(\`\${API_BASE_URL}/${lowerName}s/\${id}\`, form, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      navigate("/${lowerName}");
    } catch (error) {
      alert('Gagal update data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen ${bgClass} flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 ${textClass}">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ${bgClass}">
      {/* Header */}
      <div className="${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              to="/${lowerName}"
              className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md ${isDark ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold ${textClass}">Edit ${name}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="${cardClass} border rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium ${textClass} mb-2">
                  Nama ${name}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full px-3 py-3 border ${inputClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
                  placeholder="Masukkan nama ${lowerName}"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              {/* Deskripsi Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium ${textClass} mb-2">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="block w-full px-3 py-3 border ${inputClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
                  placeholder="Masukkan deskripsi ${lowerName}"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              {/* Harga Field */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium ${textClass} mb-2">
                  Harga
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  className="block w-full px-3 py-3 border ${inputClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
                  placeholder="Masukkan harga ${lowerName}"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  to="/${lowerName}"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${isDark ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ${name}Update;
`,
        [`${name}Detail.jsx`]: `import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, Edit, Package, DollarSign, FileText, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const ${name}Detail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(\`\${API_BASE_URL}/${lowerName}s/\${id}\`, {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        setData(response.data);
      } catch (error) {
        alert('Gagal memuat data: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen ${bgClass} flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 ${textClass}">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen ${bgClass} flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}" />
          <h3 className="mt-2 text-sm font-medium ${textClass}">Data tidak ditemukan</h3>
          <div className="mt-6">
            <Link
              to="/${lowerName}"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ${bgClass}">
      {/* Header */}
      <div className="${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/${lowerName}"
                className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md ${isDark ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <h1 className="ml-3 text-2xl font-bold ${textClass}">Detail ${name}</h1>
              </div>
            </div>
            <Link
              to={\`/${lowerName}/\${data.id}/edit\`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit ${name}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="${cardClass} border rounded-lg shadow-sm overflow-hidden">
            {/* Header Card */}
            <div className="${isDark ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold ${textClass}">{data.name}</h2>
                  <p className="${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm">ID: {data.id}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {/* Nama */}
                <div>
                  <dt className="flex items-center text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}">
                    <Package className="h-4 w-4 mr-2" />
                    Nama ${name}
                  </dt>
                  <dd className="mt-1 text-sm ${textClass} font-semibold">{data.name}</dd>
                </div>

                {/* Harga */}
                <div>
                  <dt className="flex items-center text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Harga
                  </dt>
                  <dd className="mt-1 text-sm ${textClass} font-semibold">
                    Rp {data.price?.toLocaleString() || '0'}
                  </dd>
                </div>

                {/* Created At */}
                {data.created_at && (
                  <div>
                    <dt className="flex items-center text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}">
                      <Calendar className="h-4 w-4 mr-2" />
                      Dibuat
                    </dt>
                    <dd className="mt-1 text-sm ${textClass}">
                      {new Date(data.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </dd>
                  </div>
                )}

                {/* Updated At */}
                {data.updated_at && (
                  <div>
                    <dt className="flex items-center text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}">
                      <Calendar className="h-4 w-4 mr-2" />
                      Diperbarui
                    </dt>
                    <dd className="mt-1 text-sm ${textClass}">
                      {new Date(data.updated_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </dd>
                  </div>
                )}

                {/* Deskripsi - Full Width */}
                <div className="sm:col-span-2">
                  <dt className="flex items-center text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}">
                    <FileText className="h-4 w-4 mr-2" />
                    Deskripsi
                  </dt>
                  <dd className="mt-1 text-sm ${textClass}">
                    <div className="${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4">
                      {data.description || 'Tidak ada deskripsi'}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Action Buttons */}
            <div className="${isDark ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}">
              <div className="flex justify-end space-x-3">
                <Link
                  to="/${lowerName}"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${isDark ? 'text-gray-300 bg-gray-600 border-gray-500 hover:bg-gray-500' : 'text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Kembali ke Daftar
                </Link>
                <Link
                  to={\`/${lowerName}/\${data.id}/edit\`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDark ? 'focus:ring-offset-gray-700' : 'focus:ring-offset-gray-50'} transition duration-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit ${name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ${name}Detail;
`
    };
}
//# sourceMappingURL=crudTemplates.js.map