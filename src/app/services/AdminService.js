const { Op } = require('sequelize');
const { Job, Profile, Contract } = require('../../model');

class AdminService {
  async findBestProfessionPaidBetweenDates(start, end) {
    const startedDate = new Date(start);
    const endDate = new Date(end);

    const jobs = await Job.findAll({
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [startedDate, endDate],
        },
      },
      include: [
        {
          model: Contract,
          include: [
            {
              model: Profile,
              as: 'Contractor',
            },
          ],
        },
      ],
    });
    const relationOfProfessions = this.buildRelationOfProfession(jobs);
    const sortable = Object.entries(relationOfProfessions)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    return Object.keys(sortable)[0];
  }

  async findBestClientsBetweenDates(start, end, limit) {
    const startedDate = new Date(start);
    const endDate = new Date(end);

    const jobs = await Job.findAll({
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [startedDate, endDate],
        },
      },
      include: [
        {
          model: Contract,
        },
      ],
    });

    const relationOfClients = this.buildRelationOfClients(jobs);
    const sortableArray = Object.entries(relationOfClients).sort(
      ([, a], [, b]) => b - a
    );

    const customersToSearch = sortableArray
      .splice(0, limit)
      .map((item) => item[0]);

    const profiles = await Profile.findAll({
      where: {
        id: {
          [Op.in]: customersToSearch,
        },
      },
    });

    return customersToSearch.map((id) => {
      const profile = profiles.find((prof) => prof.id === Number(id));
      return {
        id: profile.id,
        fullName: `${profile.firstName} ${profile.lastName}`,
        paid: relationOfClients[profile.id],
      };
    });
  }

  buildRelationOfProfession(jobs) {
    const relationOfProfessions = {};
    for (const job of jobs) {
      const { profession } = job.Contract.Contractor;
      const { price } = job;
      const actualProfesion = relationOfProfessions[profession];
      relationOfProfessions[profession] = actualProfesion
        ? actualProfesion + price
        : price;
    }
    return relationOfProfessions;
  }

  buildRelationOfClients(jobs) {
    const relationOfClients = {};
    for (const job of jobs) {
      const { ClientId } = job.Contract;
      const { price } = job;
      const actualClient = relationOfClients[ClientId];
      relationOfClients[ClientId] = actualClient ? actualClient + price : price;
    }
    return relationOfClients;
  }
}

module.exports = new AdminService();
