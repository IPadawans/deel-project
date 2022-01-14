const { Op } = require('sequelize');
const { Job, Profile, Contract, sequelize } = require('../../model');

class JobService {
  async findUnpaidJobByProfileId(id) {
    const jobs = await Job.findAll({
      attributes: { exclude: ['ContractId'] },
      where: {
        paid: {
          [Op.not]: true,
        },
        [Op.or]: [
          { '$Contract.Contractor.id$': id },
          { '$Contract.Client.id$': id },
        ],
      },
      include: [
        {
          model: Contract,
          attributes: { exclude: ['ContractorId', 'ClientId'] },
          include: [
            {
              model: Profile,
              as: 'Contractor',
            },
            {
              model: Profile,
              as: 'Client',
            },
          ],
        },
      ],
    });

    return jobs;
  }

  async payForJob(jobId) {
    const job = await Job.findOne({
      where: { id: jobId },
      include: [
        {
          model: Contract,
          include: [
            {
              model: Profile,
              as: 'Contractor',
            },
            {
              model: Profile,
              as: 'Client',
            },
          ],
        },
      ],
    });

    if (!job) {
      return null;
    }
    const contractorId = job.Contract.Contractor.id;
    const clientId = job.Contract.Client.id;

    const client = await Profile.findOne({ where: { id: clientId } });
    console.log(client.balance);
    const jobPrice = job.price;

    if (client.balance < jobPrice) {
      return null;
    }

    const contractor = await Profile.findOne({ where: { id: contractorId } });

    contractor.balance += jobPrice;
    client.balance -= jobPrice;

    const transaction = await sequelize.transaction();
    try {
      await Profile.update(
        { balance: (contractor.balance += jobPrice) },
        { where: { id: contractorId }, transaction }
      );

      await Profile.update(
        { balance: (client.balance -= jobPrice) },
        { where: { id: clientId }, transaction }
      );

      await transaction.commit();
      return jobId;
    } catch (e) {
      await transaction.rollback();
      return null;
    }
  }
}

module.exports = new JobService();
