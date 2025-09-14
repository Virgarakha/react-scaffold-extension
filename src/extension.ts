import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // ================= AUTH SCAFFOLD =================
  let disposableAuth = vscode.commands.registerCommand(
    'extension.createReactAuth',
    async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage('Buka folder project React/Vite dulu.');
        return;
      }

      const workspacePath = workspaceFolders[0].uri.fsPath;

      // Check dependencies
      const packageJsonPath = path.join(workspacePath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (!packageJson.dependencies['axios'] || !packageJson.dependencies['react-router-dom']) {
          vscode.window.showWarningMessage('Pastikan axios dan react-router-dom terinstal di proyek Anda.');
        }
      }

      // === Tanya user mau taruh di folder mana ===
      const folderInput = await vscode.window.showInputBox({
        prompt: 'Masukkan folder tujuan (contoh: src atau frontend/src)',
        value: 'src',
      });

      if (!folderInput) {
        vscode.window.showErrorMessage('Folder tujuan wajib diisi!');
        return;
      }

      const targetPath = path.join(workspacePath, folderInput);

      if (!fs.existsSync(targetPath)) {
        try {
          fs.mkdirSync(targetPath, { recursive: true });
        } catch (error) {
          if (error instanceof Error) {
            vscode.window.showErrorMessage('Gagal membuat folder: ' + error.message);
          } else {
            vscode.window.showErrorMessage('Gagal membuat folder: Terjadi error yang tidak diketahui');
          }
          return;
        }
      }

      // ====== AuthContext.jsx ======
      const authContextContent = `
import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [token, setToken] = useState(localStorage.getItem('token'));

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
`;

      fs.mkdirSync(path.join(targetPath, 'context'), { recursive: true });
      fs.writeFileSync(
        path.join(targetPath, 'context/AuthContext.jsx'),
        authContextContent.trim()
      );

      // ====== Login.jsx ======
      const loginPageContent = `
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(\`\${API_URL}/login\`, {
        email: email,
        password: password
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      alert('Login gagal: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
`;

      fs.mkdirSync(path.join(targetPath, 'pages'), { recursive: true });
      fs.writeFileSync(
        path.join(targetPath, 'pages/Login.jsx'),
        loginPageContent.trim()
      );

      // ====== Home.jsx ======
      const homePageContent = `
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      {user ? <div>Hi {user.full_name}</div> : <div>Loading...</div>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
`;

      fs.writeFileSync(
        path.join(targetPath, 'pages/Home.jsx'),
        homePageContent.trim()
      );

      // ====== PrivateRoute.jsx ======
      const privateRoute = `
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
     const {token} = useContext(AuthContext);
     const navigate = useNavigate();

     useEffect(()=> {
        if(!token) {
            navigate('/login')
        }
     }, [token, navigate])

     return token ? <Outlet/> : null
}

export default PrivateRoute;
`;

      fs.mkdirSync(path.join(targetPath, 'components'), {
        recursive: true,
      });
      fs.writeFileSync(
        path.join(targetPath, 'components/PrivateRoute.jsx'),
        privateRoute.trim()
      );

      // ====== Update App.jsx ======
      const appContent = `
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<PrivateRoute/>}>
            <Route path='/' element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
`;

      fs.writeFileSync(path.join(targetPath, 'App.jsx'), appContent.trim());

      vscode.window.showInformationMessage(
        `Auth scaffolding berhasil dibuat di folder: ${folderInput} 🚀`
      );
    }
  );

  // ================= CRUD SCAFFOLD =================
  let disposableCrud = vscode.commands.registerCommand(
    'extension.createCrud',
    async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage('Buka folder project React/Vite dulu.');
        return;
      }
      const workspacePath = workspaceFolders[0].uri.fsPath;

      // Check dependencies
      const packageJsonPath = path.join(workspacePath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (!packageJson.dependencies['axios'] || !packageJson.dependencies['react-router-dom']) {
          vscode.window.showWarningMessage('Pastikan axios dan react-router-dom terinstal di proyek Anda.');
        }
      }

      const folderInput = await vscode.window.showInputBox({
        prompt: 'Masukkan folder tujuan (contoh: src atau frontend/src)',
        value: 'src/pages',
      });
      if (!folderInput) {
        vscode.window.showErrorMessage('Folder tujuan wajib diisi!');
        return;
      }

      const crudName = await vscode.window.showInputBox({
        prompt: 'Masukkan nama CRUD (contoh: Barang)',
      });
      if (!crudName) {
        vscode.window.showErrorMessage('Nama CRUD wajib diisi!');
        return;
      }

      const targetPath = path.join(workspacePath, folderInput, crudName);

      if (!fs.existsSync(targetPath)) {
        try {
          fs.mkdirSync(targetPath, { recursive: true });
        } catch (error) {
          if (error instanceof Error) {
            vscode.window.showErrorMessage('Gagal membuat folder: ' + error.message);
          } else {
            vscode.window.showErrorMessage('Gagal membuat folder: Terjadi error yang tidak diketahui');
          }
          return;
        }
      }

      const templates = getCrudTemplate(crudName);
      Object.entries(templates).forEach(([fileName, content]) => {
        fs.writeFileSync(path.join(targetPath, fileName), content.trim());
      });

      // Update App.jsx to add CRUD routes
      const appPath = path.join(workspacePath, folderInput.replace(/pages.*/, ''), 'App.jsx'); // Assume App.jsx is in src
      if (fs.existsSync(appPath)) {
        let appContent = fs.readFileSync(appPath, 'utf8');
        const lower = crudName.toLowerCase();
        const importStatements = `
import ${crudName} from './pages/${crudName}/${crudName}'
import ${crudName}Create from './pages/${crudName}/${crudName}Create'
import ${crudName}Update from './pages/${crudName}/${crudName}Update'
import ${crudName}Detail from './pages/${crudName}/${crudName}Detail'
`;
        const newRoutes = `
            <Route path='/${lower}' element={<${crudName} />} />
            <Route path='/${lower}/create' element={<${crudName}Create />} />
            <Route path='/${lower}/:id' element={<${crudName}Detail />} />
            <Route path='/${lower}/:id/edit' element={<${crudName}Update />} />
`;

        // Add imports if not present
        if (!appContent.includes(`import ${crudName} from`)) {
          appContent = appContent.replace(
            /import PrivateRoute from '.\/components\/PrivateRoute'/,
            `$&\n${importStatements}`
          );
        }

        // Add routes inside PrivateRoute
        appContent = appContent.replace(
          /(<Route path='\/' element={<Home \/>} \/>\s*)/,
          `$1${newRoutes}`
        );

        fs.writeFileSync(appPath, appContent);
      } else {
        vscode.window.showWarningMessage('App.jsx tidak ditemukan. Tambahkan rute CRUD secara manual.');
      }

      vscode.window.showInformationMessage(
        `CRUD ${crudName} berhasil dibuat di folder: ${folderInput} 🚀`
      );
    }
  );

  context.subscriptions.push(disposableAuth, disposableCrud);
}

export function deactivate() {}

// crudGenerator.js (bagian generate file)

function getCrudTemplate(name: string) {
  const lower = name.toLowerCase();

  return {
    [`${name}.jsx`]: `import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Sesuaikan path jika perlu

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ${name} = () => {
  const [data, setData] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(\`\${API_BASE_URL}/${lower}s\`, {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        setData(response.data);
      } catch (error) {
        alert('Gagal memuat data: ' + (error.response?.data?.message || error.message));
      }
    };
    if (token) fetchData();
  }, [token]);

  return (
    <div>
      <h1>Daftar ${name}</h1>
      <Link to="/${lower}/create">Tambah ${name}</Link>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <Link to={\`/${lower}/\${item.id}\`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ${name};
`,

    [`${name}Create.jsx`]: `import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Sesuaikan path jika perlu

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ${name}Create = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(\`\${API_BASE_URL}/${lower}s\`, form, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      navigate("/${lower}");
    } catch (error) {
      alert('Gagal membuat data: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Buat ${name}</h1>
      <input name="name" placeholder="Nama" value={form.name} onChange={handleChange} />
      <input name="description" placeholder="Deskripsi" value={form.description} onChange={handleChange} />
      <input name="price" type="number" placeholder="Harga" value={form.price} onChange={handleChange} />
      <button type="submit">Simpan</button>
    </form>
  );
};

export default ${name}Create;
`,

    [`${name}Update.jsx`]: `import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Sesuaikan path jika perlu

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ${name}Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(\`\${API_BASE_URL}/${lower}s/\${id}\`, {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        setForm(response.data);
      } catch (error) {
        alert('Gagal memuat data: ' + (error.response?.data?.message || error.message));
      }
    };
    if (token) fetchData();
  }, [id, token]);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(\`\${API_BASE_URL}/${lower}s/\${id}\`, form, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      navigate("/${lower}");
    } catch (error) {
      alert('Gagal update data: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit ${name}</h1>
      <input name="name" placeholder="Nama" value={form.name} onChange={handleChange} />
      <input name="description" placeholder="Deskripsi" value={form.description} onChange={handleChange} />
      <input name="price" type="number" placeholder="Harga" value={form.price} onChange={handleChange} />
      <button type="submit">Update</button>
    </form>
  );
};

export default ${name}Update;
`,

    [`${name}Detail.jsx`]: `import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Sesuaikan path jika perlu

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ${name}Detail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(\`\${API_BASE_URL}/${lower}s/\${id}\`, {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        setData(response.data);
      } catch (error) {
        alert('Gagal memuat data: ' + (error.response?.data?.message || error.message));
      }
    };
    if (token) fetchData();
  }, [id, token]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Detail ${name}</h1>
      <p>Nama: {data.name}</p>
      <p>Deskripsi: {data.description}</p>
      <p>Harga: {data.price}</p>
    </div>
  );
};

export default ${name}Detail;
`
  };
}