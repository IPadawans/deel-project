const { Router } = require('express');
const { getProfile } = require('./middleware/getProfile');
const ContractController = require('./app/controllers/ContractController');
const JobController = require('./app/controllers/JobController');
const AdminController = require('./app/controllers/AdminController');

const routes = Router();
routes.get('/contracts/:id', getProfile, ContractController.index);
routes.get('/contracts', getProfile, ContractController.show);

routes.get('/jobs/unpaid', getProfile, JobController.unpaidJobs);
routes.post('/jobs/:job_id/pay', getProfile, JobController.payJob);

routes.get(
  '/admin/best-profession',
  getProfile,
  AdminController.bestProfession
);
routes.get('/admin/best-clients', getProfile, AdminController.bestClients);

module.exports = routes;
