const ContractService = require('../services/ContractService');

class ContractController {
  async index(req, res) {
    const { id: contractId } = req.params;
    const { id: contractorId } = req.profile;
    const contract = await ContractService.findContractByIdAndOwnerId(
      contractId,
      contractorId
    );
    if (!contract) return res.status(404).end();
    return res.json(contract);
  }

  async show(req, res) {
    const { id: contractorId } = req.profile;
    const contract =
      await ContractService.findAllNonTerminatedContractsOfInformedId(
        contractorId
      );
    if (!contract) return res.status(404).end();
    return res.json(contract);
  }
}

module.exports = new ContractController();
