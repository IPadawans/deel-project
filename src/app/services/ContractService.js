const { Op } = require('sequelize');
const { Contract, Profile } = require('../../model');

class ContractService {
  async findContractByIdAndOwnerId(contractId, contractorId) {
    const contract = await Contract.findOne({
      attributes: { exclude: ['ContractorId', 'ClientId'] },
      where: { id: contractId, ContractorId: contractorId },
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
    });

    return contract;
  }

  async findAllNonTerminatedContractsOfInformedId(id) {
    const contracts = await Contract.findAll({
      attributes: { exclude: ['ContractorId', 'ClientId'] },
      where: {
        [Op.or]: [{ ContractorId: id }, { ClientId: id }],
      },
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
    });

    return contracts;
  }
}

module.exports = new ContractService();
