const JobService = require('../services/JobService');

class JobController {
  async unpaidJobs(req, res) {
    const { id: profileId } = req.profile;
    const jobs = await JobService.findUnpaidJobByProfileId(profileId);
    if (!jobs) return res.status(404).end();
    return res.json(jobs);
  }

  async payJob(req, res) {
    const { job_id: jobId } = req.params;

    const job = await JobService.payForJob(jobId);
    if (!job) return res.status(404).json('Error when updating');
    return res.json(`{message: paid successfully, jobId:${jobId}}`);
  }
}

module.exports = new JobController();
