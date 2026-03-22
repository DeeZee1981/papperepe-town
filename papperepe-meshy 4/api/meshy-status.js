export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { task_id } = req.query;
  if (!task_id) return res.status(400).json({ error: 'task_id required' });

  try {
    const response = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${task_id}`, {
      headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` },
    });
    const data = await response.json();
    res.status(response.status).json({
      status: data.status,       // PENDING / IN_PROGRESS / SUCCEEDED / FAILED
      progress: data.progress,   // 0-100
      glb_url: data.model_urls?.glb || null,
      thumbnail: data.thumbnail_url || null,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
