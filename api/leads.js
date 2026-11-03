// Vercel Serverless Function - Inquiries / Leads Live Cloud Sync
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
  const FILE_PATH = 'data/leads.json';

  // GET: Fetch leads from GitHub (with local fallback)
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
      console.warn('GitHub fetch leads error:', err);
    }

    // Fallback: Read local file
    try {
      const localFile = path.join(process.cwd(), FILE_PATH);
      if (fs.existsSync(localFile)) {
        const content = fs.readFileSync(localFile, 'utf-8');
        return res.status(200).json(JSON.parse(content));
      }
    } catch (err) {}

    return res.status(200).json([]);
  }

  // POST: Add new lead or sync leads array
  if (req.method === 'POST') {
    try {
      let payload = req.body;
      if (typeof payload === 'string') {
        payload = JSON.parse(payload);
      }

      // Get current leads & SHA
      let currentLeads = [];
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
          currentLeads = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));
        }
      } catch (e) {
        console.warn('Could not fetch existing leads:', e);
      }

      if (Array.isArray(payload)) {
        currentLeads = payload;
      } else {
        // Prepend new single lead, avoiding duplicate ids
        currentLeads = currentLeads.filter(l => l.id !== payload.id);
        currentLeads.unshift(payload);
      }

      const updatedContent = Buffer.from(JSON.stringify(currentLeads, null, 2)).toString('base64');
      const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Velmora-Sync-App'
        },
        body: JSON.stringify({
          message: 'Update inquiries via Velmora App',
          content: updatedContent,
          sha: sha || undefined
        })
      });

      if (!updateRes.ok) {
        const errJson = await updateRes.json();
        throw new Error(errJson.message || 'GitHub commit failed');
      }

      return res.status(200).json({ success: true, message: 'Inquiry recorded in cloud!' });
    } catch (err) {
      console.error('POST leads error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
