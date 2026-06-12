const fs = require('fs');
const files = ['App.jsx', 'components/Navbar.jsx', 'pages/Home.jsx', 'pages/Dashboard.jsx', 'pages/Login.jsx', 'pages/Register.jsx', 'pages/Analysis.jsx'];
files.forEach(f => {
  const p = 'd:/AI Powered_Resume Grader/Frontend/src/' + f;
  let text = fs.readFileSync(p, 'utf8');
  // replace explicit white text with gray-100 (which we will map to very dark gray)
  text = text.replace(/text-white/g, 'text-gray-100');
  // but keep the button text white
  text = text.replace(/text-gray-100 font-semibold/g, 'text-white font-semibold');
  // keep navbar icon white
  text = text.replace(/p-2 rounded-xl text-gray-100/g, 'p-2 rounded-xl text-white');
  fs.writeFileSync(p, text);
});
console.log('JSX files text colors updated');
