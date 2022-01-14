const AdminService = require('../services/AdminService');

class AdminController {
  async bestProfession(req, res) {
    const { start, end } = req.query;
    const profession = await AdminService.findBestProfessionPaidBetweenDates(
      start,
      end
    );
    if (!profession) return res.status(404).end();
    return res.json({ profession });
  }

  async bestClients(req, res) {
    const { start, end, limit = 2 } = req.query;
    const clients = await AdminService.findBestClientsBetweenDates(
      start,
      end,
      limit
    );
    if (!clients) return res.status(404).end();
    return res.json(clients);
  }
}

module.exports = new AdminController();
