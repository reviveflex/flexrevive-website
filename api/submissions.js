// Protected admin view of stored submissions.
//
// This holds patient names, contact details and complaints, so it is
// locked behind ADMIN_SECRET (set this in Vercel -> Environment
// Variables — pick your own long random string).
//
// View it at:
//   https://your-site.vercel.app/api/submissions?key=YOUR_ADMIN_SECRET

const { supabase } = require('../lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const providedKey = req.query.key;
  if (!process.env.ADMIN_SECRET || providedKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('submissions error:', err);
    res.status(500).json({ ok: false, error: 'Could not load submissions.' });
  }
};
