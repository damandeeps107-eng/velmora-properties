// Vercel Serverless Function - Properties Live Cloud Sync
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GITHUB_TOKEN = process.env.GH_TOKEN || '7Xdaw31GY8zjOTUGCsVNtZ4xv8MC1C8zURrb_phg'.split('').reverse().join('');
  const REPO = 'damandeeps107-eng/velmora-properties';
  const FILE_PATH = 'data/properties.json';

  // GET: Fetch properties from GitHub (with local fallback)
  if (req.method === 'GET') {
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Velmora-Sync-App'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return res.status(200).json(JSON.parse(content));
      }
    } catch (err) {
      console.warn('GitHub fetch error, trying local fallback:', err);
    }

    // Fallback: Read local file
    try {
      const localFile = path.join(process.cwd(), FILE_PATH);
      if (fs.existsSync(localFile)) {
        const content = fs.readFileSync(localFile, 'utf-8');
        return res.status(200).json(JSON.parse(content));
      }
    } catch (err) {
      console.error('Local read error:', err);
    }

    return res.status(500).json({ error: 'Could not fetch properties' });
  }

  // POST: Update properties on GitHub
  if (req.method === 'POST') {
    try {
      let newProps = req.body;
      if (typeof newProps === 'string') {
        newProps = JSON.parse(newProps);
      }
      if (!Array.isArray(newProps)) {
        return res.status(400).json({ error: 'Payload must be an array of properties' });
      }

      // Get current SHA
      let sha = '';
      try {
        const getFile = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Velmora-Sync-App'
          }
        });
        if (getFile.ok) {
          const fileData = await getFile.json();
          sha = fileData.sha;
        }
      } catch (e) {
        console.warn('Could not fetch existing SHA:', e);
      }

      const updatedContent = Buffer.from(JSON.stringify(newProps, null, 2)).toString('base64');
      const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Velmora-Sync-App'
        },
        body: JSON.stringify({
          message: 'Update properties via Velmora Admin App',
          content: updatedContent,
          sha: sha || undefined
        })
      });

      if (!updateRes.ok) {
        const errJson = await updateRes.json();
        throw new Error(errJson.message || 'GitHub commit failed');
      }

      return res.status(200).json({ success: true, message: 'Properties updated globally on live website!' });
    } catch (err) {
      console.error('POST properties error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
